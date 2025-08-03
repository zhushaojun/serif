'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, Clock, Edit, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Blog } from '@/types/database'
import { deleteBlogAndRedirect } from '@/lib/actions/blog-actions'
import { toast } from 'sonner'

interface BlogCardProps {
  blog: Blog
  showActions?: boolean
}

export function BlogCard({ blog, showActions = true }: BlogCardProps) {
  // 处理删除操作
  const handleDelete = async () => {
    if (!confirm('确定要删除这篇博客吗？此操作不可撤销。')) {
      return
    }

    try {
      toast.promise(
        deleteBlogAndRedirect(blog.id),
        {
          loading: '正在删除博客...',
          success: '博客删除成功！',
          error: '删除博客失败，请重试。',
        }
      )
    } catch (error) {
      console.error('删除博客时出错:', error)
      toast.error('删除博客失败', {
        description: '请稍后重试或联系管理员。'
      })
    }
  }

  // 从HTML内容中提取纯文本作为摘录（统一处理，避免SSR不匹配）
  const getExcerpt = (content: string) => {
    if (!content || typeof content !== 'string') {
      return '暂无内容预览...'
    }
    
    // 统一使用服务器端的处理方式，避免hydration mismatch
    const text = content
      .replace(/<[^>]*>/g, '')           // 移除HTML标签
      .replace(/&nbsp;/g, ' ')          // 替换HTML实体
      .replace(/&amp;/g, '&')          // 替换&符号
      .replace(/&lt;/g, '<')           // 替换<符号
      .replace(/&gt;/g, '>')           // 替换>符号
      .replace(/&quot;/g, '"')         // 替换引号
      .replace(/&#39;/g, "'")          // 替换单引号
      .replace(/\s+/g, ' ')            // 规范化空白字符
      .trim()                          // 移除首尾空格
    
    return text.length > 120 ? text.substring(0, 120) + '...' : text
  }

  // 计算阅读时间（基于内容长度，统一处理避免SSR不匹配）
  const calculateReadTime = (content: string) => {
    if (!content || typeof content !== 'string') {
      return 1
    }
    
    // 统一使用服务器端的处理方式
    const text = content
      .replace(/<[^>]*>/g, '')           // 移除HTML标签
      .replace(/&nbsp;/g, ' ')          // 替换HTML实体
      .replace(/&amp;/g, '&')          // 替换&符号
      .replace(/&lt;/g, '<')           // 替换<符号
      .replace(/&gt;/g, '>')           // 替换>符号
      .replace(/&quot;/g, '"')         // 替换引号
      .replace(/&#39;/g, "'")          // 替换单引号
      .replace(/\s+/g, ' ')            // 规范化空白字符
      .trim()                          // 移除首尾空格
    
    const wordsPerMinute = 200
    const words = text.split(/\s+/).filter(word => word.length > 0).length
    return Math.max(1, Math.ceil(words / wordsPerMinute))
  }

  const excerpt = getExcerpt(blog.content)
  const readTime = calculateReadTime(blog.content)

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden border-0 shadow-sm">
      {/* 封面图片 */}
      <div className="relative h-48 w-full overflow-hidden">
        {blog.image ? (
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
            <div className="text-white text-2xl font-bold opacity-80">
              {blog.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* 浮动标签 */}
        {blog.category && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-black/20 text-white border-0 backdrop-blur-sm">
              {blog.category}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        {/* 阅读时间 */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <Clock className="h-3 w-3" />
          {readTime} min read
        </div>

        {/* 标题和副标题 */}
        <div className="space-y-2 mb-4">
          <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
          {blog.subtitle && (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {blog.subtitle}
            </p>
          )}
        </div>

        {/* 内容摘录 */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {excerpt}
        </p>

        {/* 作者信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={blog.author} />
              <AvatarFallback className="text-xs bg-red-100 text-red-700">
                {blog.author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{blog.author}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(blog.created_at)}
              </span>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                  <Edit className="h-3 w-3" />
                </Link>
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                <Link href={`/blog/${blog.slug}`} target="_blank">
                  <Eye className="h-3 w-3" />
                </Link>
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 