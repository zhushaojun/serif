'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Edit, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Blog } from '@/types/database'
import { deleteBlogAndRedirect } from '@/lib/actions/blog-actions'

interface BlogCardProps {
  blog: Blog
  showActions?: boolean
}

export function BlogCard({ blog, showActions = true }: BlogCardProps) {
  // 从HTML内容中提取纯文本作为摘录（统一处理，避免SSR不匹配）
  const getExcerpt = (content: string) => {
    if (!content || typeof content !== 'string') {
      return '暂无内容预览...'
    }
    
    // 统一使用服务器端的处理方式，避免hydration mismatch
    let text = content
      .replace(/<[^>]*>/g, '')           // 移除HTML标签
      .replace(/&nbsp;/g, ' ')          // 替换HTML实体
      .replace(/&amp;/g, '&')          // 替换&符号
      .replace(/&lt;/g, '<')           // 替换<符号
      .replace(/&gt;/g, '>')           // 替换>符号
      .replace(/&quot;/g, '"')         // 替换引号
      .replace(/&#39;/g, "'")          // 替换单引号
      .replace(/\s+/g, ' ')            // 规范化空白字符
      .trim()                          // 移除首尾空格
    
    return text.length > 150 ? text.substring(0, 150) + '...' : text
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
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {blog.title}
            </h3>
            {blog.subtitle && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {blog.subtitle}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(blog.created_at)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readTime} 分钟
              </div>
            </div>
          </div>
          <Badge variant="default" className="ml-2">
            已发布
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {excerpt}
        </p>
        
        {blog.author && (
          <div className="text-sm text-muted-foreground">
            作者：{blog.author}
          </div>
        )}
        
        {showActions && (
          <div className="flex items-center gap-2 pt-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                <Edit className="h-3 w-3 mr-1" />
                编辑
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/blog/${blog.slug}`} target="_blank">
                <Eye className="h-3 w-3 mr-1" />
                查看
              </Link>
            </Button>
            <form action={deleteBlogAndRedirect.bind(null, blog.id)} className="inline">
              <Button 
                type="submit" 
                size="sm" 
                variant="outline" 
                className="text-red-600 hover:text-red-700"
                onClick={(e) => {
                  if (!confirm('确定要删除这篇博客吗？此操作不可撤销。')) {
                    e.preventDefault()
                  }
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                删除
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 