'use client'

import { useState, useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleEditor } from './simple-editor'
import { Blog } from '@/types/database'
import { generateSlug } from '@/lib/slug-generator'
import { Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BlogFormProps {
  blog?: Blog
  action: (formData: FormData) => Promise<any>
  title: string
  isEditing?: boolean
}

export function BlogForm({ blog, action, title, isEditing = false }: BlogFormProps) {
  const router = useRouter()
  const [content, setContent] = useState(blog?.content || '')
  const [titleValue, setTitleValue] = useState(blog?.title || '')
  const [slugPreview, setSlugPreview] = useState('')
  const [state, formAction, isPending] = useActionState(action, { success: true })

  // 实时生成slug预览
  useEffect(() => {
    if (titleValue.trim()) {
      const generatedSlug = generateSlug(titleValue.trim())
      setSlugPreview(generatedSlug)
    } else {
      setSlugPreview('')
    }
  }, [titleValue])

  const handleCancel = () => {
    router.push('/dashboard/blogs')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {title}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
              >
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* 显示错误信息 */}
            {state && !state.success && state.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {state.error}
              </div>
            )}
            
            {/* 显示成功信息 */}
            {state && state.success && state.data && !isEditing && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                博客创建成功！
              </div>
            )}

            {/* 标题字段 */}
            <div className="space-y-2">
              <Label htmlFor="title">博客标题 *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="请输入博客标题"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                required
                maxLength={200}
                disabled={isPending}
              />
              {/* Slug 预览 */}
              {slugPreview && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">URL 预览:</span>{' '}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    /blog/{slugPreview}
                  </code>
                </div>
              )}
            </div>

            {/* 副标题字段 */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">副标题</Label>
              <Input
                id="subtitle"
                name="subtitle"
                type="text"
                placeholder="请输入副标题（可选）"
                defaultValue={blog?.subtitle || ''}
                maxLength={300}
                disabled={isPending}
              />
            </div>

            {/* 封面图片字段 */}
            <div className="space-y-2">
              <Label htmlFor="image">封面图片 URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                defaultValue={blog?.image || ''}
                disabled={isPending}
              />
              <p className="text-sm text-gray-500">
                请输入图片的完整 URL 地址
              </p>
            </div>

            {/* 作者字段 */}
            <div className="space-y-2">
              <Label htmlFor="author">作者 *</Label>
              <Input
                id="author"
                name="author"
                type="text"
                placeholder="请输入作者名称"
                defaultValue={blog?.author || ''}
                required
                maxLength={100}
                disabled={isPending}
              />
            </div>

            {/* 内容编辑器 */}
            <div className="space-y-2">
              <Label htmlFor="content">博客内容 *</Label>
              <SimpleEditor
                content={content}
                onChange={setContent}
                placeholder="开始编写你的博客内容..."
                className="min-h-[400px]"
              />
              <input
                type="hidden"
                name="content"
                value={content}
              />
            </div>

            {/* 提交按钮 */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={isPending || !content.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                {isPending 
                  ? (isEditing ? '更新中...' : '保存中...') 
                  : (isEditing ? '更新博客' : '保存博客')
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 预览区域 */}
      {content && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>内容预览</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
} 