import { BlogForm } from '@/components/blog/blog-form'
import { createBlogAndRedirect } from '@/lib/actions/blog-actions'

export default function NewBlogPage() {
  return (
    <BlogForm
      action={createBlogAndRedirect}
      title="创建新博客"
      isEditing={false}
    />
  )
} 