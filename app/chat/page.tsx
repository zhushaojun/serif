import { ChatSidebar } from '@/components/chat/chat-sidebar'
import { getChats } from '@/lib/actions/chat-actions'
import { MessageSquare, Sparkles } from 'lucide-react'

export default async function ChatPage() {
  const chats = await getChats()

  return (
    <>
      <ChatSidebar chats={chats} />
      
      {/* 主内容区域 - 欢迎页面 */}
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex items-center justify-center">
            <div className="relative">
              <MessageSquare className="h-16 w-16 text-muted-foreground" />
              <Sparkles className="h-6 w-6 text-primary absolute -top-1 -right-1" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">欢迎使用 AI 聊天</h1>
            <p className="text-muted-foreground">
              选择一个已有的聊天或创建新的聊天开始对话
            </p>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <span>支持 Markdown 格式渲染</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <span>实时流式响应</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <span>智能上下文理解</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 