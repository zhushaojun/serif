'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, MessageSquare, Trash2, MoreHorizontal, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { createChat, deleteChat } from '@/lib/actions/chat-actions'
import type { ChatWithLastMessage, AIModelKey } from '@/types/chats'
import { AI_MODELS } from '@/types/chats'
import { ModelSelector } from './model-selector'
import { toast } from 'sonner'

interface ChatSidebarProps {
  chats: ChatWithLastMessage[]
}

export function ChatSidebar({ chats }: ChatSidebarProps) {
  const pathname = usePathname()
  const [isCreating, setIsCreating] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModelKey>('gpt-3.5-turbo')

  const handleCreateChat = async () => {
    setIsCreating(true)
    try {
      const result = await createChat({ 
        title: 'New Chat',
        model: selectedModel 
      })
      if (result.success && result.chat) {
        // 重定向到新创建的聊天
        window.location.href = `/chat/${result.chat.id}`
      } else {
        toast.error(result.error || 'Failed to create chat')
      }
    } catch (error) {
      toast.error('Failed to create chat')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    try {
      const result = await deleteChat(chatId)
      if (result.success) {
        toast.success('Chat deleted successfully')
        // 如果删除的是当前聊天，重定向到聊天首页
        if (pathname === `/chat/${chatId}`) {
          window.location.href = '/chat'
        }
      } else {
        toast.error(result.error || 'Failed to delete chat')
      }
    } catch (error) {
      toast.error('Failed to delete chat')
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('zh-CN', { 
        weekday: 'short' 
      })
    } else {
      return date.toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  return (
    <div className="w-80 h-full bg-muted/50 border-r flex flex-col">
      {/* 头部 */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">聊天</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LogOut className="h-4 w-4 mr-2" />
                  返回仪表板
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* 模型选择器 */}
        <div className="mb-3">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            disabled={isCreating}
          />
        </div>
        
        <Button 
          onClick={handleCreateChat}
          disabled={isCreating}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? '创建中...' : '新建聊天'}
        </Button>
      </div>

      {/* 聊天列表 */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {chats.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无聊天记录</p>
              <p className="text-xs">点击上方按钮开始新的对话</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => {
                const isActive = pathname === `/chat/${chat.id}`
                
                return (
                  <div
                    key={chat.id}
                    className={`group relative rounded-lg p-3 transition-colors hover:bg-accent ${
                      isActive ? 'bg-accent' : ''
                    }`}
                  >
                    <Link href={`/chat/${chat.id}`} className="block">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {chat.title}
                          </h3>
                          {chat.last_message && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {chat.last_message.role === 'user' ? '你: ' : 'AI: '}
                              {chat.last_message.content}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                              {formatTime(chat.updated_at)}
                            </p>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                              {AI_MODELS[chat.model as AIModelKey]?.name || chat.model}
                            </span>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.preventDefault()}
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDeleteChat(chat.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              删除聊天
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 