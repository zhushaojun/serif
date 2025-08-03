'use client'

import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { User, Bot } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Message as MessageType } from '@/types/chats'

interface MessageProps {
  message: MessageType
}

export const Message = memo(function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 p-4 ${isUser ? 'bg-muted/30' : 'bg-background'}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="text-sm font-medium">
          {isUser ? '你' : 'AI 助手'}
        </div>
        
        <div className="text-sm text-foreground">
          {isUser ? (
            // 用户消息直接显示，不需要 markdown 渲染
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          ) : (
            // AI 消息使用 markdown 渲染
            <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-muted prose-pre:border">
              <ReactMarkdown
                components={{
                  // 自定义代码块样式
                  pre: ({ children }) => (
                    <pre className="bg-muted border rounded-md p-3 overflow-x-auto">
                      {children}
                    </pre>
                  ),
                  // 自定义内联代码样式
                  code: ({ children, className }) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    ) : (
                      <code className={className}>{children}</code>
                    )
                  },
                  // 自定义链接样式
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          {new Date(message.created_at).toLocaleString('zh-CN')}
        </div>
      </div>
    </div>
  )
}) 