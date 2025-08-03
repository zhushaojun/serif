# Next.js + AI SDK 集成指南：构建流式AI聊天系统

本指南基于实际项目开发经验，详细介绍如何在Next.js应用中集成AI SDK来构建流式AI聊天系统，支持多AI模型选择。

## 📋 目录

1. [项目设置与依赖安装](#1-项目设置与依赖安装)
2. [环境配置](#2-环境配置)
3. [数据库设计](#3-数据库设计)
4. [TypeScript类型定义](#4-typescript类型定义)
5. [后端API实现](#5-后端api实现)
6. [前端UI组件](#6-前端ui组件)
7. [常见问题与解决方案](#7-常见问题与解决方案)
8. [性能优化建议](#8-性能优化建议)
9. [最佳实践](#9-最佳实践)

## 1. 项目设置与依赖安装

### 核心依赖

```bash
# AI SDK v5.0 - 核心包
pnpm add ai @ai-sdk/openai @ai-sdk/react

# OpenAI客户端（如果使用OpenAI兼容API）
pnpm add openai

# React Markdown支持
pnpm add react-markdown

# 数据库和认证（使用Supabase）
pnpm add @supabase/supabase-js

# UI组件库
pnpm add @radix-ui/react-select @radix-ui/react-scroll-area
pnpm add class-variance-authority clsx tailwind-merge
pnpm add sonner # Toast通知

# 开发依赖
pnpm add -D @types/react @types/node
```

### 版本兼容性重要提示

⚠️ **关键注意事项**：
- AI SDK v5.0 与 v4.0 API有重大变化
- 确保所有AI相关包版本一致
- 建议固定版本避免自动升级导致的问题

```json
{
  "dependencies": {
    "ai": "5.0.0",
    "@ai-sdk/openai": "2.0.0", 
    "@ai-sdk/react": "2.0.0",
    "openai": "5.11.0",
    "react-markdown": "10.1.0"
  }
}
```

## 2. 环境配置

### 环境变量设置

创建 `.env.local` 文件：

```bash
# OpenAI API配置
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1  # 或自定义API端点

# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Supabase客户端配置

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => 
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// lib/supabase/server.ts  
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 忽略在服务端设置cookie时的错误
          }
        },
      },
    }
  )
}
```

## 3. 数据库设计

### Supabase数据库迁移

```sql
-- 创建聊天表
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-3.5-turbo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建消息表
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建updated_at触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建RLS策略
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 聊天RLS策略
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

-- 消息RLS策略
CREATE POLICY "Users can view messages from own chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to own chats" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );
```

## 4. TypeScript类型定义

### 完整类型定义

```typescript
// types/chats.ts
export interface Chat {
  id: string
  user_id: string
  title: string
  model: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  chat_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface CreateChatRequest {
  title?: string
  model?: string
}

export interface CreateMessageRequest {
  chat_id: string
  role: 'user' | 'assistant'
  content: string
}

export interface ChatWithLastMessage extends Chat {
  lastMessage?: Message
  lastMessageTime?: string
}

// AI模型配置
export const AI_MODELS = {
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    description: '快速、高效的通用AI模型',
    provider: 'openai'
  },
  'qwen3-235b-a22b-2507:free': {
    name: 'Qwen3-235B (免费)',
    description: '阿里巴巴大语言模型免费版',
    provider: 'custom'
  },
  'glm-4.5-flash': {
    name: 'GLM-4.5 Flash',
    description: '智谱AI快速响应模型',
    provider: 'custom'
  },
  'ernie-4.5-vl-28b-a3b': {
    name: 'ERNIE-4.5-VL-28B',
    description: '百度文心大模型多模态版本',
    provider: 'custom'
  }
} as const

export type AIModelKey = keyof typeof AI_MODELS

// AI SDK v5.0 消息格式
export interface UIMessage {
  id: string
  role: 'user' | 'assistant'
  parts: Array<{
    type: 'text'
    text: string
  }>
}
```

## 5. 后端API实现

### 聊天API路由 (app/api/chat/route.ts)

```typescript
import { createOpenAI } from '@ai-sdk/openai'
import { streamText, convertToModelMessages } from 'ai'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json()
    
    // 验证用户认证
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response('Unauthorized', { status: 401 })
    }

    // 验证chatId（如果提供）并获取模型信息
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
    }

    // 验证环境变量
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_BASE_URL) {
      console.error('Missing OpenAI configuration')
      return new Response('Server configuration error', { status: 500 })
    }

    // 创建OpenAI实例
    const openai = createOpenAI({
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
    })

    // 转换消息格式
    const modelMessages = convertToModelMessages(messages)

    // 处理自定义模型
    let modelToUse = selectedModel
    if (!['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'].includes(selectedModel)) {
      console.log('Using custom model:', selectedModel)
    }

    // 创建流式响应
    const result = await streamText({
      model: openai.chat(modelToUse),
      messages: modelMessages,
      async onFinish({ text }) {
        // 保存消息到数据库
        if (chatId && text) {
          try {
            // 保存用户消息
            const userMessage = messages[messages.length - 1]
            if (userMessage && userMessage.role === 'user') {
              const userContent = userMessage.parts?.find(part => part.type === 'text')?.text || ''
              
              await supabase.from('messages').insert({
                chat_id: chatId,
                role: 'user',
                content: userContent,
              })
            }

            // 保存AI回复
            await supabase.from('messages').insert({
              chat_id: chatId,
              role: 'assistant',
              content: text,
            })

            console.log('Messages saved successfully')
          } catch (dbError) {
            console.error('Database save error:', dbError)
          }
        }
      },
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
```

## 6. 前端UI组件

### 主聊天页面组件

```typescript
// app/chat/[id]/page.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { getChats, getChatMessages, createChat } from '@/lib/actions/chat-actions'
import { Message as MessageType, ChatWithLastMessage } from '@/types/chats'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'

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

  // 使用AI SDK 5.0的useChat hook
  const {
    messages,
    setMessages,
  } = useChat({
    onError: (error) => {
      console.error('Chat error:', error)
      toast.error('发送消息失败，请重试')
      setIsAiLoading(false)
    },
    onFinish: () => {
      loadChats()
      setIsAiLoading(false)
    },
  })

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // 提交表单处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !chatId || isAiLoading) return
    
    const message = input.trim()
    setInput('')
    setIsAiLoading(true)
    
    try {
      // 调用聊天API
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
          chatId: chatId,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // 添加用户消息到界面
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        parts: [{ type: 'text', text: message } as const]
      }

      const newMessages = [...messages, userMessage]
      setMessages(newMessages)

      // 处理流式响应
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body reader')
      }

      const decoder = new TextDecoder()
      let aiResponse = ''
      const aiMessageId = (Date.now() + 1).toString()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          aiResponse += chunk
          
          // 更新AI消息
          const aiMessage = {
            id: aiMessageId,
            role: 'assistant' as const,
            parts: [{ type: 'text', text: aiResponse } as const]
          }
          
          setMessages([...newMessages, aiMessage])
        }
      } catch (streamError) {
        console.error('Stream processing error:', streamError)
        throw new Error(`Stream error: ${streamError}`)
      }
      
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('发送消息失败，请重试')
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}>
              {message.role === 'assistant' ? (
                <ReactMarkdown className="prose prose-sm dark:prose-invert">
                  {message.parts[0]?.text || ''}
                </ReactMarkdown>
              ) : (
                <p>{message.parts[0]?.text || ''}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的消息..."
              disabled={isAiLoading}
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (input.trim() && !isAiLoading) {
                    handleSubmit(e)
                  }
                }
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || isAiLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
          >
            {isAiLoading ? '发送中...' : '发送'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

## 7. 常见问题与解决方案

### 问题1：AI SDK版本兼容性

**症状**：
```
Module not found: Can't resolve 'ai/react'
Property 'input' does not exist on type 'UseChatHelpers'
```

**解决方案**：
- 确保使用AI SDK v5.0
- 使用 `@ai-sdk/react` 而不是 `ai/react`
- 检查所有相关包版本一致

```bash
pnpm remove ai @ai-sdk/openai @ai-sdk/react
pnpm add ai@5.0.0 @ai-sdk/openai@2.0.0 @ai-sdk/react@2.0.0
```

### 问题2：消息格式转换错误

**症状**：
```
Invalid prompt: The messages must be a ModelMessage[]
```

**解决方案**：
使用 `convertToModelMessages` 转换UI消息格式

```typescript
import { convertToModelMessages } from 'ai'

// 在API路由中
const modelMessages = convertToModelMessages(messages)
```

### 问题3：自定义API端点配置

**症状**：
```
Incorrect API key provided
model not found or incompatibility
```

**解决方案**：
正确配置OpenAI提供者

```typescript
import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL, // 自定义端点
  apiKey: process.env.OPENAI_API_KEY,
})

// 使用chat端点而不是completion
const result = await streamText({
  model: openai.chat(selectedModel),
  messages: modelMessages,
})
```

### 问题4：流式响应处理

**症状**：
- AI回复不显示
- 流式数据解析错误

**解决方案**：
简化流式响应处理

```typescript
// 客户端流式处理
const reader = response.body?.getReader()
const decoder = new TextDecoder()
let aiResponse = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  
  // 直接解码文本内容
  const chunk = decoder.decode(value, { stream: true })
  aiResponse += chunk
  
  // 更新UI
  setMessages([...newMessages, {
    id: aiMessageId,
    role: 'assistant',
    parts: [{ type: 'text', text: aiResponse }]
  }])
}
```

### 问题5：数据库连接和RLS

**症状**：
```
column chats.model does not exist
Chat not found or unauthorized
```

**解决方案**：
- 确保数据库迁移正确执行
- 验证RLS策略配置
- 检查用户认证状态

```sql
-- 手动添加缺失字段
ALTER TABLE chats ADD COLUMN model TEXT NOT NULL DEFAULT 'gpt-3.5-turbo';

-- 验证RLS策略
SELECT * FROM chats WHERE auth.uid() = user_id;
```

## 8. 性能优化建议

### 8.1 消息分页加载

```typescript
// 实现消息分页
const MESSAGES_PER_PAGE = 50

export async function getChatMessages(
  chatId: string, 
  page: number = 0
): Promise<Message[]> {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false })
    .range(page * MESSAGES_PER_PAGE, (page + 1) * MESSAGES_PER_PAGE - 1)

  return messages?.reverse() || []
}
```

### 8.2 实时更新优化

```typescript
// 使用Supabase实时订阅
useEffect(() => {
  if (!chatId) return

  const subscription = supabase
    .channel(`messages:${chatId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, 
      (payload) => {
        const newMessage = payload.new as Message
        // 更新消息列表
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [chatId])
```

## 9. 最佳实践

### 9.1 错误处理策略

```typescript
// 分层错误处理
export class ChatError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'ChatError'
  }
}

// API路由错误处理
export async function POST(req: Request) {
  try {
    // ... 业务逻辑
  } catch (error) {
    if (error instanceof ChatError) {
      return new Response(error.message, { status: error.statusCode })
    }
    
    console.error('Unexpected error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
```

### 9.2 类型安全

```typescript
// 使用严格的TypeScript配置
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}

// 运行时类型验证
import { z } from 'zod'

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
  chatId: z.string().uuid(),
})

export async function POST(req: Request) {
  const body = await req.json()
  const validatedData = MessageSchema.parse(body)
  // ... 处理验证后的数据
}
```

### 9.3 安全考虑

```typescript
// 输入验证和清理
import DOMPurify from 'isomorphic-dompurify'

const sanitizeContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre'],
    ALLOWED_ATTR: []
  })
}

// 速率限制
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 每分钟10次请求
})

export async function POST(req: Request) {
  const identifier = getClientIdentifier(req)
  const { success } = await ratelimit.limit(identifier)
  
  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }
  
  // ... 处理请求
}
```

## 总结

这个指南涵盖了从零开始构建Next.js + AI SDK流式聊天系统的完整流程。关键要点：

1. **版本管理**：确保AI SDK相关包版本一致
2. **错误处理**：实现分层错误处理和用户友好的错误提示
3. **数据安全**：使用RLS和Server Actions保护数据
4. **性能优化**：实现流式响应、消息分页和虚拟化
5. **类型安全**：使用TypeScript和运行时验证
6. **用户体验**：提供实时反馈和优雅的加载状态

通过遵循这些最佳实践，你可以构建一个功能完整、安全可靠的AI聊天系统。 