import { BlogForm } from '@/components/blog/blog-form'
import { getBlogById, updateBlogAndRedirect } from '@/lib/actions/blog-actions'
import { notFound } from 'next/navigation'

interface EditBlogPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params
  const { blog, error } = await getBlogById(id)

  if (error || !blog) {
    notFound()
  }

  const updateAction = updateBlogAndRedirect.bind(null, blog.id)
  
  return (
    <BlogForm
      blog={blog}
      action={updateAction}
      title="编辑博客"
      isEditing={true}
    />
  )
} 