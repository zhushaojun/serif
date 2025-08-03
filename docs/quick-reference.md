# Next.js + AI SDK 快速参考

## 🚀 快速开始

### 安装依赖
```bash
pnpm add ai @ai-sdk/openai @ai-sdk/react openai react-markdown
```

### 环境变量
```bash
# .env.local
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://your-api-endpoint.com/v1
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 数据库迁移
```sql
-- 快速创建聊天表
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-3.5-turbo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 快速创建消息表
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 常见问题快速修复

### 1. AI SDK 版本问题
```bash
# 错误: Module not found: Can't resolve 'ai/react'
# 解决:
pnpm remove ai @ai-sdk/openai @ai-sdk/react
pnpm add ai@latest @ai-sdk/openai@latest @ai-sdk/react@latest
```

### 2. 自定义API端点
```typescript
// app/api/chat/route.ts
import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL, // 关键配置
  apiKey: process.env.OPENAI_API_KEY,
})
```

### 3. 流式响应不显示
```typescript
// 前端处理
const decoder = new TextDecoder()
let aiResponse = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  
  const chunk = decoder.decode(value, { stream: true })
  aiResponse += chunk
  
  // 实时更新UI
  setMessages([...newMessages, {
    id: aiMessageId,
    role: 'assistant',
    parts: [{ type: 'text', text: aiResponse }]
  }])
}
```

### 4. 数据库字段缺失
```sql
-- 添加model字段
ALTER TABLE chats ADD COLUMN model TEXT NOT NULL DEFAULT 'gpt-3.5-turbo';
```

### 5. RLS策略问题
```sql
-- 启用RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 基本策略
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);
```

## 📋 调试检查清单

### 环境变量检查
- [ ] `OPENAI_API_KEY` 已设置
- [ ] `OPENAI_BASE_URL` 正确
- [ ] Supabase URL 和 Key 正确

### 数据库检查
- [ ] `chats` 表存在且有 `model` 字段
- [ ] `messages` 表存在
- [ ] RLS 策略已启用
- [ ] 用户已认证

### 代码检查
- [ ] AI SDK v5.0 正确安装
- [ ] 使用 `@ai-sdk/react` 而不是 `ai/react`
- [ ] 消息格式使用 `parts` 数组
- [ ] API 路由返回 `toTextStreamResponse()`

## 🛠️ 常用命令

```bash
# 开发服务器
pnpm dev

# 构建项目
pnpm build

# 数据库迁移
supabase db push

# 重置数据库
supabase db reset

# 查看Supabase状态
supabase status
```

## 📱 测试步骤

1. **启动开发服务器**
   ```bash
   pnpm dev
   ```

2. **访问聊天页面**
   ```
   http://localhost:3000/chat
   ```

3. **测试流程**
   - 登录用户
   - 创建新聊天
   - 发送消息
   - 验证AI回复

## 🚨 紧急故障排除

### 如果聊天完全不工作：
1. 检查控制台错误
2. 验证环境变量
3. 确认数据库表存在
4. 检查用户认证状态

### 如果AI不回复：
1. 检查API密钥
2. 验证base URL
3. 查看网络请求
4. 检查服务器日志

### 如果数据库错误：
1. 运行数据库迁移
2. 检查RLS策略
3. 验证用户权限
4. 确认表结构正确

## 🎯 核心文件结构

```
app/
├── api/chat/route.ts          # 聊天API端点
├── chat/
│   ├── layout.tsx             # 聊天全屏布局
│   ├── page.tsx               # 聊天主页
│   └── [id]/page.tsx          # 具体聊天页面
├── lib/actions/chat-actions.ts # 聊天Server Actions
├── components/chat/
│   ├── chat-sidebar.tsx       # 聊天侧边栏
│   ├── message.tsx            # 消息组件
│   └── model-selector.tsx     # 模型选择器
└── types/chats.ts             # 聊天相关类型定义
```

## 💡 关键代码片段

### AI SDK v5.0 useChat Hook
```typescript
import { useChat } from '@ai-sdk/react'

const { messages, setMessages } = useChat({
  onError: (error) => console.error('Chat error:', error),
  onFinish: () => console.log('Message finished'),
})
```

### 自定义OpenAI提供者
```typescript
import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
})
```

### 流式响应处理
```typescript
const result = await streamText({
  model: openai.chat('gpt-3.5-turbo'),
  messages: convertToModelMessages(messages),
})

return result.toTextStreamResponse()
``` 