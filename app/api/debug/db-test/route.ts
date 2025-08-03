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

    // 测试数据库连接 - 检查chats表是否存在
    const { data: chats, error: chatsError } = await supabase
      .from('chats')
      .select('*')
      .limit(1)

    // 测试messages表
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .limit(1)

    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      },
      database: {
        chats: {
          accessible: !chatsError,
          error: chatsError?.message || null,
          count: chats?.length || 0
        },
        messages: {
          accessible: !messagesError,
          error: messagesError?.message || null,
          count: messages?.length || 0
        }
      }
    })

  } catch (error) {
    return Response.json({ 
      success: false, 
      error: 'Server error', 
      details: error instanceof Error ? error.message : String(error)
    })
  }
} 