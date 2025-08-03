import { createClient } from '@/lib/server'

export async function POST() {
  try {
    const supabase = await createClient()
    
    // 测试用户认证
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      return Response.json({ 
        success: false, 
        error: 'Auth error', 
        details: authError 
      })
    }

    if (!user) {
      return Response.json({ 
        success: false, 
        error: 'No user found' 
      })
    }

    console.log('Test: Creating chat for user:', user.id)

    // 尝试创建测试聊天
    const { data: chat, error: createError } = await supabase
      .from('chats')
      .insert({
        user_id: user.id,
        title: 'Test Chat - ' + new Date().toISOString(),
      })
      .select()
      .single()

    if (createError) {
      console.error('Test: Error creating chat:', createError)
      return Response.json({
        success: false,
        error: 'Failed to create chat',
        details: createError
      })
    }

    console.log('Test: Chat created successfully:', chat)

    // 验证聊天是否真的被创建
    const { data: verifyChat, error: verifyError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chat.id)
      .single()

    return Response.json({
      success: true,
      chat: chat,
      verification: {
        found: !verifyError,
        data: verifyChat,
        error: verifyError?.message || null
      }
    })

  } catch (error) {
    console.error('Test: Server error:', error)
    return Response.json({ 
      success: false, 
      error: 'Server error', 
      details: error instanceof Error ? error.message : String(error)
    })
  }
} 