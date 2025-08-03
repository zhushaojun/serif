import { Blog } from './database'

/**
 * 博客状态枚举
 */
export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const

export type BlogStatus = typeof BLOG_STATUS[keyof typeof BLOG_STATUS]

/**
 * 博客卡片显示的数据类型
 */
export interface BlogCardData extends Pick<Blog, 'id' | 'title' | 'subtitle' | 'created_at'> {
  excerpt: string
  readTime: number
  status: BlogStatus
  tags: string[]
  publishedAt?: string | null
}

/**
 * 博客表单数据类型
 */
export interface BlogFormData {
  title: string
  subtitle?: string
  image?: string
  content: string
  author: string
}

/**
 * 博客列表查询参数
 */
export interface BlogListParams {
  page?: number
  limit?: number
  search?: string
  author_id?: string
}

/**
 * 博客创建/更新操作的响应类型
 */
export interface BlogOperationResult {
  success: boolean
  data?: Blog
  error?: string
} 