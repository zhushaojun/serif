import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FileQuestion className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">博客不存在</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            你要编辑的博客文章不存在，或者你没有权限访问它。
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/dashboard/blogs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回博客列表
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/blogs/new">
                创建新博客
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 