import { Profile } from './profiles'

/**
 * 博客文章类型定义
 */
export interface Blog {
  id: string
  title: string
  slug: string
  subtitle?: string
  image?: string
  content: string
  author: string
  author_id: string
  created_at: string
  updated_at: string
}

/**
 * 数据库表定义
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      blogs: {
        Row: Blog
        Insert: Omit<Blog, 'id' | 'slug' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Blog, 'id' | 'slug' | 'author_id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/**
 * 数据库表类型
 */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

/**
 * 数据库插入类型
 */
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']

/**
 * 数据库更新类型
 */
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'] 