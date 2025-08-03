'use client'

import { useState } from 'react'
import { AI_MODELS, type AIModelKey } from '@/types/chats'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ModelSelectorProps {
  selectedModel: AIModelKey
  onModelChange: (model: AIModelKey) => void
  disabled?: boolean
}

export function ModelSelector({ selectedModel, onModelChange, disabled = false }: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-muted-foreground">
        模型选择:
      </label>
      <Select
        value={selectedModel}
        onValueChange={(value) => onModelChange(value as AIModelKey)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="选择AI模型" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(AI_MODELS).map(([key, model]) => (
            <SelectItem key={key} value={key}>
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 