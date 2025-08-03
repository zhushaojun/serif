'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChatSidebar } from '@/components/chat/chat-sidebar'
import { Message } from '@/components/chat/message'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getChats, getChatMessages, updateChatTitle } from '@/lib/actions/chat-actions'
import type { ChatWithLastMessage, Message as MessageType } from '@/types/chats'
import { toast } from 'sonner'

interface ChatPageProps {
  params: Promise<{ id: string }>
}

export default function ChatPage({ params }: ChatPageProps) {
  const [chatId, setChatId] = useState<string>('')
  const [chats, setChats] = useState<ChatWithLastMessage[]>([])
  const [initialMessages, setInitialMessages] = useState<MessageType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [input, setInput] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 使用 AI SDK 5.0 的 useChat hook
  const {
    messages,
    sendMessage,
    setMessages,
  } = useChat({
    onError: (error) => {
      console.error('Chat error:', error)
      toast.error('发送消息失败，请重试')
      setIsAiLoading(false)
    },
    onFinish: () => {
      // 消息完成后，刷新聊天列表以更新最后消息时间
      loadChats()
      setIsAiLoading(false)
    },
  })

  // 加载聊天 ID
  useEffect(() => {
    params.then(({ id }) => {
      setChatId(id)
    })
  }, [params])

  // 加载聊天列表
  const loadChats = async () => {
    try {
      const chatsData = await getChats()
      setChats(chatsData)
    } catch (error) {
      console.error('Failed to load chats:', error)
      toast.error('加载聊天列表失败')
    }
  }

  // 加载初始消息
  const loadMessages = async (id: string) => {
    if (!id) return
    
    // 检查是否是有效的UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      console.error('Invalid chat ID format:', id)
      toast.error('无效的聊天ID，请创建新聊天')
      setIsLoading(false)
      return
    }
    
    try {
      const messagesData = await getChatMessages(id)
      setInitialMessages(messagesData)
      
      // 如果聊天不存在，getChatMessages 应该返回空数组
      // 但我们需要额外验证聊天是否真的存在
      
      // 将数据库中的消息转换为 AI SDK 5.0 的格式
      const aiMessages = messagesData.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        parts: [{ type: 'text', text: msg.content } as const],
      }))
      
      setMessages(aiMessages)
    } catch (error) {
      console.error('Failed to load messages:', error)
      toast.error('聊天不存在，正在创建新聊天...')
      
      // 聊天不存在时自动创建新聊天
      try {
        const { createChat } = await import('@/lib/actions/chat-actions')
        const result = await createChat({ title: 'New Chat' })
        if (result.success && result.chat) {
          window.location.href = `/chat/${result.chat.id}`
          return
        }
      } catch (createError) {
        console.error('Failed to create new chat:', createError)
        toast.error('创建新聊天失败，请手动创建')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 当聊天 ID 变化时，加载数据
  useEffect(() => {
    if (chatId) {
      setIsLoading(true)
      loadChats()
      loadMessages(chatId)
    }
  }, [chatId])

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // 自动更新聊天标题（基于第一条用户消息）
  useEffect(() => {
    const userMessages = messages.filter(m => m.role === 'user')
    if (userMessages.length === 1 && chatId) {
      const textPart = userMessages[0].parts.find(p => p.type === 'text')
      if (textPart && 'text' in textPart) {
        const firstUserMessage = textPart.text
        const title = firstUserMessage.length > 50 
          ? firstUserMessage.substring(0, 50) + '...' 
          : firstUserMessage
        
        updateChatTitle(chatId, title).catch(console.error)
      }
    }
  }, [messages, chatId])

  if (isLoading) {
    return (
      <>
        <ChatSidebar chats={chats} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">加载中...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <ChatSidebar chats={chats} />
      
      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col h-screen">
        {/* 消息列表 */}
        <ScrollArea ref={scrollAreaRef} className="flex-1">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full py-12">
                <div className="text-center space-y-2">
                  <div className="text-lg font-medium">开始新的对话</div>
                  <div className="text-muted-foreground">
                    在下方输入消息开始与 AI 助手对话
                  </div>
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {messages.map((message) => {
                  // 为了兼容 AI SDK 5.0 的消息格式，我们需要转换
                  const textPart = message.parts.find(p => p.type === 'text')
                  const content = textPart && 'text' in textPart ? textPart.text : ''
                  
                  const messageData: MessageType = {
                    id: message.id,
                    chat_id: chatId,
                    role: message.role as 'user' | 'assistant',
                    content: content,
                    created_at: new Date().toISOString(), // AI SDK 消息没有时间戳，使用当前时间
                  }
                  
                  return <Message key={message.id} message={messageData} />
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 输入区域 - 使用 AI SDK 5.0 的表单 */}
        <div className="border-t bg-background p-4">
          <form onSubmit={async (e) => {
            e.preventDefault()
            if (!input.trim() || !chatId || isAiLoading) return
            
            // 检查chatId是否是有效的UUID格式
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            if (!uuidRegex.test(chatId)) {
              toast.error('请先创建一个新聊天')
              return
            }
            
            const message = input.trim()
            setInput('')
            setIsAiLoading(true)
            
            try {
              console.log('Sending message to chatId:', chatId)
              console.log('Current messages:', messages)
              
              // 直接调用API而不是使用sendMessage
              const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  messages: [
                    ...messages,
                    {
                      id: Date.now().toString(),
                      role: 'user',
                      parts: [{ type: 'text', text: message }]
                    }
                  ],
                  chatId: chatId || null,
                }),
              })
              
              console.log('API response status:', response.status)

              if (!response.ok) {
                throw new Error('Failed to send message')
              }

              // 添加用户消息到界面
              const userMessage = {
                id: Date.now().toString(),
                role: 'user' as const,
                parts: [{ type: 'text', text: message } as const]
              }

              // 添加用户消息立即显示
              const newMessages = [...messages, userMessage]
              setMessages(newMessages)

              // 处理流式响应
              const reader = response.body?.getReader()
              if (!reader) {
                throw new Error('No response body reader')
              }

              const decoder = new TextDecoder()
              let aiResponse = ''
              let aiMessageId = (Date.now() + 1).toString()

              try {
                while (true) {
                  const { done, value } = await reader.read()
                  if (done) break
                  
                  // 直接解码文本内容
                  const chunk = decoder.decode(value, { stream: true })
                  console.log('Raw chunk:', chunk)
                  
                  // 直接添加到AI响应
                  aiResponse += chunk
                  console.log('Full AI response so far:', aiResponse)
                  
                  // 创建或更新AI消息
                  const aiMessage = {
                    id: aiMessageId,
                    role: 'assistant' as const,
                    parts: [{ type: 'text', text: aiResponse } as const]
                  }
                  
                  // 更新消息列表，包含用户消息和AI回复
                  setMessages([...newMessages, aiMessage])
                }
              } catch (streamError) {
                console.error('Stream processing error:', streamError)
                throw new Error(`Stream error: ${streamError}`)
              }
              
              // 刷新聊天列表
              loadChats()
            } catch (error) {
              console.error('Failed to send message:', error)
              toast.error('发送消息失败，请重试')
            } finally {
              setIsAiLoading(false)
            }
          }} className="flex gap-2 items-end max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={!chatId ? "请先选择或创建一个聊天..." : "输入你的消息... (Enter 发送，Shift+Enter 换行)"}
                disabled={!chatId || isAiLoading}
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-[200px]"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (input.trim() && chatId && !isAiLoading) {
                      const form = e.currentTarget.closest('form')
                      if (form) {
                        const submitEvent = new Event('submit', { cancelable: true, bubbles: true })
                        form.dispatchEvent(submitEvent)
                      }
                    }
                  }
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={!input.trim() || !chatId || isAiLoading}
              className="h-10 w-10 flex-shrink-0 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isAiLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-b-transparent" />
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
          
          <div className="text-xs text-muted-foreground mt-2 text-center max-w-4xl mx-auto">
            AI 可能会产生不准确的信息。请验证重要信息。
          </div>
        </div>
      </div>
    </>
  )
} 