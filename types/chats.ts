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
  last_message?: Message
  message_count?: number
}

// 可用的AI模型配置
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