import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogCard } from '@/components/blog/blog-card'
import { getUserBlogs } from '@/lib/actions/blog-actions'
import { Plus, FileText } from 'lucide-react'
import Link from 'next/link'

export default async function BlogsPage() {
  const { blogs, total, error } = await getUserBlogs()

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">博客管理</h1>
            <p className="text-muted-foreground">
              管理你的所有博客文章
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              {error}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">博客管理</h1>
          <p className="text-muted-foreground">
            管理你的所有博客文章
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            新建文章
          </Link>
        </Button>
      </div>

      {/* 统计信息 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              总文章数
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">
              所有已发布的文章
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 博客列表 */}
      {blogs.length > 0 ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                所有文章
                <span className="text-sm font-normal text-muted-foreground">
                  ({blogs.length})
                </span>
              </CardTitle>
              <CardDescription>
                你创建的所有博客文章
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} showActions={true} />
                ))}
              </div>
            </CardContent>
          </Card>
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
  )
} 