'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { generateSlug, generateShortSlug, isValidSlug, previewSlug } from '@/lib/slug-generator'

export default function SlugGeneratorPage() {
  const [title, setTitle] = useState('')
  const [result, setResult] = useState<ReturnType<typeof previewSlug> | null>(null)

  const handleGenerate = () => {
    if (title.trim()) {
      const slugResult = previewSlug(title.trim())
      setResult(slugResult)
    }
  }

  const testCases = [
    '你好世界',
    'React 18 新特性详解',
    '前端开发最佳实践',
    'TypeScript 进阶技巧',
    '如何学习编程？',
    'Next.js App Router 完整指南',
    '深入理解 JavaScript 闭包',
    '2024年前端开发趋势分析',
    '微服务架构设计模式',
    'Vue 3 Composition API 实战'
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Slug 生成器测试</CardTitle>
          <p className="text-muted-foreground">
            使用 pinyin 库将中文标题转换为 URL 安全的 slug
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 输入测试 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">输入标题</Label>
              <div className="flex gap-2">
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入博客标题..."
                  className="flex-1"
                />
                <Button onClick={handleGenerate} disabled={!title.trim()}>
                  生成 Slug
                </Button>
              </div>
            </div>

            {/* 结果显示 */}
            {result && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium">标准 Slug:</span>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    {result.normal}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">短 Slug (首字母):</span>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    {result.short}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">状态:</span>
                  <Badge variant={result.isValid ? 'default' : 'destructive'}>
                    {result.isValid ? '✅ 有效' : '❌ 无效'}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* 快速测试按钮 */}
          <div className="space-y-4">
            <h3 className="font-semibold">快速测试用例</h3>
            <div className="grid gap-2">
              {testCases.map((testTitle) => (
                <Button
                  key={testTitle}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTitle(testTitle)
                    setResult(previewSlug(testTitle))
                  }}
                  className="justify-start text-left"
                >
                  {testTitle}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 生成示例 */}
      <Card>
        <CardHeader>
          <CardTitle>📊 生成示例</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testCases.slice(0, 5).map((testTitle) => {
              const example = previewSlug(testTitle)
              return (
                <div key={testTitle} className="border rounded-lg p-4">
                  <div className="font-medium mb-2">{testTitle}</div>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-600">标准:</span>{' '}
                      <code className="bg-gray-100 px-1 rounded">{example.normal}</code>
                    </div>
                    <div>
                      <span className="text-gray-600">短版:</span>{' '}
                      <code className="bg-gray-100 px-1 rounded">{example.short}</code>
                    </div>
                    <div>
                      <span className="text-gray-600">有效:</span>{' '}
                      <Badge size="sm" variant={example.isValid ? 'default' : 'destructive'}>
                        {example.isValid ? '是' : '否'}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>📚 使用说明</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>功能特点:</strong></p>
          <ul className="list-disc ml-4 space-y-1">
            <li>使用 <code>pinyin</code> 库将中文转换为拼音</li>
            <li>支持分词，提高多音字准确率</li>
            <li>生成 URL 安全的 slug（只包含字母、数字、连字符）</li>
            <li>自动处理长度限制和特殊字符</li>
            <li>支持短 slug 生成（首字母缩写）</li>
          </ul>
          
          <p className="mt-4"><strong>集成到博客系统:</strong></p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`import { generateSlug } from '@/lib/slug-generator'

// 在博客创建时自动生成 slug
const slug = generateSlug('React 18 新特性详解')
// 输出: "react-18-xin-te-xing-xiang-jie"`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
} 