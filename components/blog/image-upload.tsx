'use client'

import { useState, useEffect } from 'react'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone'
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'
import { createClient } from '@/lib/client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload, X, ExternalLink } from 'lucide-react'

interface ImageUploadProps {
  defaultValue?: string
  onChange?: (imageUrl: string) => void
  disabled?: boolean
}

export function ImageUpload({ defaultValue = '', onChange, disabled = false }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue)
  const [manualUrl, setManualUrl] = useState(defaultValue)
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload')
  const supabase = createClient()

  const uploadProps = useSupabaseUpload({
    bucketName: 'blog-images',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  })

  // 当上传成功时，生成公共 URL
  useEffect(() => {
    if (uploadProps.isSuccess && uploadProps.uploadedPaths.length > 0) {
      const uploadedPath = uploadProps.uploadedPaths[0]
      generatePublicUrl(uploadedPath.filePath)
    }
  }, [uploadProps.isSuccess, uploadProps.uploadedPaths])

  const generatePublicUrl = (filePath: string) => {
    try {
      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)
      
      const publicUrl = data.publicUrl
      setImageUrl(publicUrl)
      onChange?.(publicUrl)
    } catch (error) {
      console.error('Error generating public URL:', error)
    }
  }

  const handleManualUrlChange = (url: string) => {
    setManualUrl(url)
    setImageUrl(url)
    onChange?.(url)
  }

  const clearImage = () => {
    setImageUrl('')
    setManualUrl('')
    onChange?.('')
    uploadProps.setFiles([])
    // 重置上传状态
    if (uploadProps.uploadedPaths) {
      // 清空上传路径的状态在 hook 内部处理
    }
  }

  return (
    <div className="space-y-4">
      <Label>封面图片</Label>
      
      {/* 模式切换 */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={uploadMode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('upload')}
          disabled={disabled}
        >
          <Upload className="h-4 w-4 mr-2" />
          上传图片
        </Button>
        <Button
          type="button"
          variant={uploadMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('url')}
          disabled={disabled}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          输入链接
        </Button>
      </div>

      {/* 上传模式 */}
      {uploadMode === 'upload' && (
        <div className="space-y-4">
          <Dropzone {...uploadProps} className="w-full">
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
          
          {uploadProps.files.length > 0 && !uploadProps.isSuccess && (
            <Button
              type="button"
              onClick={uploadProps.onUpload}
              disabled={uploadProps.loading || uploadProps.files.some(f => f.errors.length > 0)}
              className="w-full"
            >
              {uploadProps.loading ? '上传中...' : '开始上传'}
            </Button>
          )}
        </div>
      )}

      {/* URL 输入模式 */}
      {uploadMode === 'url' && (
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={manualUrl}
            onChange={(e) => handleManualUrlChange(e.target.value)}
            disabled={disabled}
          />
          <p className="text-sm text-muted-foreground">
            请输入图片的完整 URL 地址
          </p>
        </div>
      )}

      {/* 图片预览 */}
      {imageUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">预览</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearImage}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt="预览"
              className="w-full h-48 object-cover"
              onError={() => {
                console.error('Image failed to load:', imageUrl)
              }}
            />
          </div>
        </div>
      )}

      {/* 隐藏的表单字段 */}
      <input
        type="hidden"
        name="image"
        value={imageUrl}
      />
    </div>
  )
} 