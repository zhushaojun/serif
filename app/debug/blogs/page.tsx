import { getUserBlogs } from '@/lib/actions/blog-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DebugBlogsPage() {
  const { blogs, total, error } = await getUserBlogs()

  if (error) {
    return <div className="p-6 text-red-600">错误: {error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>博客调试信息</CardTitle>
          <p className="text-muted-foreground">总共 {total} 篇博客</p>
        </CardHeader>
        <CardContent>
          {blogs.length === 0 ? (
            <p>没有找到任何博客</p>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold">{blog.title}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>ID:</strong> {blog.id}</p>
                    <p><strong>Slug:</strong> {blog.slug}</p>
                    <p><strong>Author:</strong> {blog.author}</p>
                    <p><strong>Created:</strong> {new Date(blog.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link href={`/blog/${blog.slug}`} target="_blank">
                        查看
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                        编辑
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 