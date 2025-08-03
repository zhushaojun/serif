'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { BlogOperationResult } from '@/types/blogs'
import { Blog } from '@/types/database'
import { generateSlug } from '@/lib/slug-generator'

/**
 * 博客表单验证 schema
 */
const blogSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题不能超过200个字符'),
  subtitle: z.string().max(300, '副标题不能超过300个字符').optional(),
  image: z.string().url('请输入有效的图片URL').optional().or(z.literal('')),
  content: z.string().min(1, '内容不能为空'),
  author: z.string().min(1, '作者名称不能为空').max(100, '作者名称不能超过100个字符'),
})

/**
 * 创建新博客
 */
export async function createBlog(formData: FormData): Promise<BlogOperationResult> {
  try {
    const supabase = await createClient()
    
    // 验证用户是否已认证
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: '用户未认证' }
    }

    // 检查 formData 是否有效
    if (!formData) {
      return { success: false, error: '表单数据无效' }
    }

    // 解析表单数据
    const rawData = {
      title: formData.get('title') as string || '',
      subtitle: formData.get('subtitle') as string || '',
      image: formData.get('image') as string || '',
      content: formData.get('content') as string || '',
      author: formData.get('author') as string || '',
    }

    // 验证数据
    const validatedData = blogSchema.parse(rawData)

    // 生成智能slug
    const generatedSlug = generateSlug(validatedData.title)

    // 检查slug唯一性并处理冲突
    let finalSlug = generatedSlug
    let counter = 1
    while (true) {
      const { data: existingBlog } = await supabase
        .from('blogs')
        .select('id')
        .eq('slug', finalSlug)
        .single()

      if (!existingBlog) break
      
      finalSlug = `${generatedSlug}-${counter}`
      counter++
    }

    // 插入数据到数据库
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        ...validatedData,
        author_id: user.id,
        slug: finalSlug,
      })
      .select()
      .single()

    if (error) {
      console.error('创建博客失败:', error)
      return { success: false, error: '创建博客失败' }
    }

    revalidatePath('/dashboard/blogs')
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    console.error('创建博客错误:', error)
    return { success: false, error: '创建博客时发生未知错误' }
  }
}

/**
 * 更新博客
 */
export async function updateBlog(id: string, formData: FormData): Promise<BlogOperationResult> {
  try {
    const supabase = await createClient()
    
    // 验证用户是否已认证
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: '用户未认证' }
    }

    // 检查 formData 是否有效
    if (!formData) {
      return { success: false, error: '表单数据无效' }
    }

    // 解析表单数据
    const rawData = {
      title: formData.get('title') as string || '',
      subtitle: formData.get('subtitle') as string || '',
      image: formData.get('image') as string || '',
      content: formData.get('content') as string || '',
      author: formData.get('author') as string || '',
    }

    // 验证数据
    const validatedData = blogSchema.parse(rawData)

    // 更新数据库
    const { data, error } = await supabase
      .from('blogs')
      .update(validatedData)
      .eq('id', id)
      .eq('author_id', user.id) // 确保只能更新自己的博客
      .select()
      .single()

    if (error) {
      console.error('更新博客失败:', error)
      return { success: false, error: '更新博客失败' }
    }

    revalidatePath('/dashboard/blogs')
    revalidatePath(`/dashboard/blogs/${data.slug}`)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    console.error('更新博客错误:', error)
    return { success: false, error: '更新博客时发生未知错误' }
  }
}

/**
 * 删除博客
 */
export async function deleteBlog(id: string): Promise<BlogOperationResult> {
  try {
    const supabase = await createClient()
    
    // 验证用户是否已认证
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: '用户未认证' }
    }

    // 删除博客
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
      .eq('author_id', user.id) // 确保只能删除自己的博客

    if (error) {
      console.error('删除博客失败:', error)
      return { success: false, error: '删除博客失败' }
    }

    revalidatePath('/dashboard/blogs')
    return { success: true }
  } catch (error) {
    console.error('删除博客错误:', error)
    return { success: false, error: '删除博客时发生未知错误' }
  }
}

/**
 * 获取用户的所有博客
 */
export async function getUserBlogs(page = 1, limit = 10): Promise<{ blogs: Blog[]; total: number; error?: string }> {
  try {
    const supabase = await createClient()
    
    // 验证用户是否已认证
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { blogs: [], total: 0, error: '用户未认证' }
    }

    const offset = (page - 1) * limit

    // 获取总数
    const { count } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user.id)

    // 获取分页数据
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('获取博客列表失败:', error)
      return { blogs: [], total: 0, error: '获取博客列表失败' }
    }

    return { blogs: blogs || [], total: count || 0 }
  } catch (error) {
    console.error('获取博客列表错误:', error)
    return { blogs: [], total: 0, error: '获取博客列表时发生未知错误' }
  }
}

/**
 * 根据 slug 获取博客（公开访问，不需要认证）
 */
export async function getBlogBySlug(slug: string): Promise<{ blog: Blog | null; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { blog: null, error: '博客不存在' }
      }
      console.error('获取博客失败:', error)
      return { blog: null, error: '获取博客失败' }
    }

    return { blog }
  } catch (error) {
    console.error('获取博客错误:', error)
    return { blog: null, error: '获取博客时发生未知错误' }
  }
}

/**
 * 根据 ID 获取博客（用于编辑）
 */
export async function getBlogById(id: string): Promise<{ blog: Blog | null; error?: string }> {
  try {
    const supabase = await createClient()
    
    // 验证用户是否已认证
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { blog: null, error: '用户未认证' }
    }

    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .eq('author_id', user.id) // 确保只能获取自己的博客
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { blog: null, error: '博客不存在' }
      }
      console.error('获取博客失败:', error)
      return { blog: null, error: '获取博客失败' }
    }

    return { blog }
  } catch (error) {
    console.error('获取博客错误:', error)
    return { blog: null, error: '获取博客时发生未知错误' }
  }
}

/**
 * 创建博客后重定向到编辑页面
 */
export async function createBlogAndRedirect(prevState: BlogOperationResult | null, formData: FormData) {
  const result = await createBlog(formData)
  
  if (result.success && result.data) {
    const timestamp = Date.now()
    redirect(`/dashboard/blogs/${result.data.id}/edit?success=true&action=create&t=${timestamp}`)
  }
  
  return result
}

/**
 * 更新博客后重定向到列表页面
 */
export async function updateBlogAndRedirect(id: string, prevState: BlogOperationResult | null, formData: FormData) {
  const result = await updateBlog(id, formData)
  
  if (result.success) {
    const timestamp = Date.now()
    redirect(`/dashboard/blogs?success=true&action=update&t=${timestamp}`)
  }
  
  return result
}

/**
 * 删除博客后重定向到列表页面
 */
export async function deleteBlogAndRedirect(id: string) {
  const result = await deleteBlog(id)
  
  if (result.success) {
    const timestamp = Date.now()
    redirect(`/dashboard/blogs?success=true&action=delete&t=${timestamp}`)
  }
  
  return result
} 