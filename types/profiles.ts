/**
 * Profile 表相关类型定义
 */
export interface Profile {
  id: string
  user_id: string
  first_name?: string | null
  avatar_url?: string | null
  email: string
  created_at: string
  updated_at: string
}

/**
 * 创建 Profile 时的类型（不包含自动生成的字段）
 */
export interface CreateProfileInput {
  user_id: string
  first_name?: string | null
  avatar_url?: string | null
  email: string
}

/**
 * 更新 Profile 时的类型（所有字段都是可选的）
 */
export interface UpdateProfileInput {
  first_name?: string | null
  avatar_url?: string | null
  email?: string
}

/**
 * Profile 表的数据库行类型
 */
export type ProfileRow = Profile

/**
 * Profile 表的插入类型
 */
export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>

/**
 * Profile 表的更新类型
 */
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>> 