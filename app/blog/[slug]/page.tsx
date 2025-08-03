import { getBlogBySlug } from '@/lib/actions/blog-actions'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock, User } from 'lucide-react'
import { notFound } from 'next/navigation'

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const { blog, error } = await getBlogBySlug(slug)

  if (error || !blog) {
    notFound()
  }

  // 计算阅读时间（统一处理，避免SSR不匹配）
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

  const readTime = calculateReadTime(blog.content)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="space-y-8">
        {/* 头部信息 */}
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{blog.title}</h1>
          
          {blog.subtitle && (
            <p className="text-xl text-muted-foreground">{blog.subtitle}</p>
          )}
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readTime} 分钟阅读</span>
            </div>
          </div>
        </header>

        {/* 封面图片 */}
        {blog.image && (
          <div className="aspect-video overflow-hidden rounded-lg bg-muted">
            <img
              src={blog.image}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* 博客内容 */}
        <div className="prose prose-gray max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </article>
    </div>
  )
}

// 生成元数据
export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params
  const { blog } = await getBlogBySlug(slug)

  if (!blog) {
    return {
      title: '博客不存在',
    }
  }

  // 统一的HTML处理函数
  const getPlainText = (content: string) => {
    if (!content || typeof content !== 'string') {
      return ''
    }

    return content
      .replace(/<[^>]*>/g, '')           // 移除HTML标签
      .replace(/&nbsp;/g, ' ')          // 替换HTML实体
      .replace(/&amp;/g, '&')          // 替换&符号
      .replace(/&lt;/g, '<')           // 替换<符号
      .replace(/&gt;/g, '>')           // 替换>符号
      .replace(/&quot;/g, '"')         // 替换引号
      .replace(/&#39;/g, "'")          // 替换单引号
      .replace(/\s+/g, ' ')            // 规范化空白字符
      .trim()                          // 移除首尾空格
  }

  const description = blog.subtitle || getPlainText(blog.content).substring(0, 160)

  return {
    title: blog.title,
    description,
    openGraph: {
      title: blog.title,
      description,
      images: blog.image ? [{ url: blog.image }] : [],
    },
  }
} 