'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Blog } from '@/types/database'

interface FeaturedBlogCardProps {
  blog: Blog
}

export function FeaturedBlogCard({ blog }: FeaturedBlogCardProps) {
  // 从HTML内容中提取纯文本作为摘录
  const getExcerpt = (content: string) => {
    if (!content || typeof content !== 'string') {
      return '暂无内容预览...'
    }
    
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
    
    return text.length > 200 ? text.substring(0, 200) + '...' : text
  }

  // 计算阅读时间
  const calculateReadTime = (content: string) => {
    if (!content || typeof content !== 'string') {
      return 1
    }
    
    const text = content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
    
    const wordsPerMinute = 200
    const words = text.split(/\s+/).filter(word => word.length > 0).length
    return Math.max(1, Math.ceil(words / wordsPerMinute))
  }

  const excerpt = getExcerpt(blog.content)
  const readTime = calculateReadTime(blog.content)

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
      <Link href={`/blog/${blog.slug}`}>
        {/* 封面图片 - 更大尺寸 */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          {blog.image ? (
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
              <div className="text-white text-6xl font-bold opacity-80">
                {blog.title.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          
          {/* 浮动标签 */}
          {blog.category && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/30 text-white border-0 backdrop-blur-sm text-sm px-3 py-1">
                {blog.category}
              </Badge>
            </div>
          )}
          
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-6 md:p-8">
          {/* 阅读时间和日期 */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readTime} min read
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(blog.created_at)}
            </div>
          </div>

          {/* 标题和副标题 */}
          <div className="space-y-3 mb-6">
            <h2 className="font-bold text-2xl md:text-3xl leading-tight line-clamp-2 group-hover:text-red-600 transition-colors">
              {blog.title}
            </h2>
            {blog.subtitle && (
              <p className="text-muted-foreground text-base md:text-lg line-clamp-2">
                {blog.subtitle}
              </p>
            )}
          </div>

          {/* 内容摘录 */}
          <p className="text-muted-foreground line-clamp-3 mb-6 text-base leading-relaxed">
            {excerpt}
          </p>

          {/* 作者信息和阅读更多 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={blog.author} />
                <AvatarFallback className="text-sm bg-red-100 text-red-700 font-medium">
                  {blog.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-base font-medium">{blog.author}</span>
                <span className="text-sm text-muted-foreground">
                  作者
                </span>
              </div>
            </div>

            {/* 阅读更多指示器 */}
            <div className="flex items-center gap-2 text-red-600 font-medium group-hover:gap-3 transition-all">
              <span className="text-sm">阅读更多</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
} 