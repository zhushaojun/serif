import { createOpenAI } from '@ai-sdk/openai'
import { streamText, convertToModelMessages } from 'ai'
import { createClient } from '@/lib/server'

export async function POST(req: Request) {
  console.log('Chat API called')
  
  try {
    const { messages, chatId } = await req.json()
    console.log('Request body:', { messages: messages?.length, chatId })

    // 验证用户身份
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('Auth error:', authError)
      return new Response('Authentication failed', { status: 401 })
    }

    if (!user) {
      console.error('No user found')
      return new Response('User not found', { status: 401 })
    }

    console.log('User authenticated:', user.id)

    // 如果提供了 chatId，验证用户是否拥有该聊天并获取模型信息
    let selectedModel = 'gpt-3.5-turbo' // 默认模型
    if (chatId) {
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .select('user_id, model')
        .eq('id', chatId)
        .single()

      if (chatError || !chat || chat.user_id !== user.id) {
        console.error('Chat access error:', { chatError, chat, userId: user.id })
        return new Response('Chat not found or unauthorized', { status: 404 })
      }

      selectedModel = chat.model || 'gpt-3.5-turbo'
      console.log('Using model for chat:', selectedModel)
    }

    console.log('Starting OpenAI request...')

    // 验证环境变量
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not set')
      return new Response('OpenAI API key not configured', { status: 500 })
    }

    // 创建自定义 OpenAI 提供者实例，指定 baseURL
    const openai = createOpenAI({
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
    })

    // 打印原始消息以调试
    console.log('Original messages:', JSON.stringify(messages, null, 2))
    
    // 转换 UI 消息格式为模型消息格式
    const modelMessages = convertToModelMessages(messages)
    console.log('Converted messages:', JSON.stringify(modelMessages, null, 2))

    // 使用 AI SDK 5.0 创建流式响应 - 明确使用聊天API
    // 注意：目前只有兼容OpenAI格式的模型可以直接使用
    // 其他模型需要配置对应的提供者
    const modelToUse = selectedModel
    if (!['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'].includes(selectedModel)) {
      // 对于自定义模型，假设它们兼容OpenAI格式
      console.log('Using custom model:', selectedModel)
    }
    
    const result = await streamText({
      model: openai.chat(modelToUse),
      messages: modelMessages,
      async onFinish({ text }) {
        console.log('AI response finished, saving to database...')
        
        // 在流式响应完成后，保存消息到数据库
        if (chatId && text) {
          try {
            // 保存用户消息
            const userMessage = messages[messages.length - 1]
            if (userMessage && userMessage.role === 'user') {
              // 从 parts 中提取文本内容
              const textPart = userMessage.parts?.find((p: { type: string; text?: string }) => p.type === 'text')
              const content = textPart?.text || ''
              
              await supabase.from('messages').insert({
                chat_id: chatId,
                role: 'user',
                content: content,
              })
            }

            // 保存 AI 回复
            await supabase.from('messages').insert({
              chat_id: chatId,
              role: 'assistant',
              content: text,
            })

            // 更新聊天的 updated_at 时间戳
            await supabase
              .from('chats')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', chatId)
              
            console.log('Messages saved successfully')
          } catch (error) {
            console.error('Failed to save messages:', error)
          }
        }
      },
    })

    console.log('Returning streaming response')
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    
    // 提供更详细的错误信息
    if (error instanceof Error) {
      return new Response(`Internal Server Error: ${error.message}`, { status: 500 })
    }
    
    return new Response('Internal Server Error', { status: 500 })
  }
} 