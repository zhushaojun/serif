'use client'

import { useState } from 'react'
import { SimpleEditor } from '@/components/blog/simple-editor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestEditorPage() {
  const [content, setContent] = useState('<p>欢迎使用博客编辑器！</p><p>试试以下功能：</p><ul><li>选择文本并使用工具栏格式化</li><li>创建标题和列表</li><li>添加引用块</li></ul>')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>TipTap 编辑器测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">编辑器</h3>
            <SimpleEditor
              content={content}
              onChange={setContent}
              placeholder="开始编写内容..."
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">预览</h3>
            <div 
              className="prose prose-gray max-w-none p-4 border rounded-lg bg-gray-50"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">HTML 输出</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
              {content}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 