import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/blog/blog-card'
import { getUserBlogs } from '@/lib/actions/blog-actions'
import { FileText, Users, Eye, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const { blogs, total } = await getUserBlogs(1, 3) // 获取最新的3篇博客

  const mockStats = [
    {
      title: '总文章数',
      value: total.toString(),
      description: '所有已发布的文章',
      icon: FileText,
    },
    {
      title: '总访问量',
      value: '2,451',
      description: '比上月增长 18%',
      icon: Eye,
    },
    {
      title: '订阅者',
      value: '156',
      description: '比上月增长 12',
      icon: Users,
    },
    {
      title: '月度增长',
      value: '+23%',
      description: '持续增长中',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
          <p className="text-muted-foreground">
            欢迎回来！这里是你的博客管理中心。
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blogs/new">
            <Plus className="h-4 w-4 mr-2" />
            新建文章
          </Link>
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 最近文章 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">最近文章</h2>
          <Button asChild variant="outline">
            <Link href="/dashboard/blogs">
              查看全部
            </Link>
          </Button>
        </div>
        {blogs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} showActions={false} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">还没有博客文章</h3>
                  <p className="text-muted-foreground">
                    开始创建你的第一篇博客文章吧！
                  </p>
                </div>
                <Button asChild>
                  <Link href="/dashboard/blogs/new">
                    <Plus className="h-4 w-4 mr-2" />
                    创建第一篇博客
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 