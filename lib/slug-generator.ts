/**
 * Slug 生成工具
 * 使用 pinyin 库将中文转换为 URL 安全的拼音
 */

import pinyin from 'pinyin'

export interface SlugOptions {
  maxLength?: number
  separator?: string
  style?: 'normal' | 'first_letter'
}

/**
 * 将标题转换为 URL 安全的 slug
 */
export function generateSlug(title: string, options: SlugOptions = {}): string {
  const {
    maxLength = 50,
    separator = '-',
    style = 'normal'
  } = options

  if (!title || typeof title !== 'string') {
    return `blog-${Date.now()}`
  }

  try {
    // 使用 pinyin 库转换中文
    const pinyinResult = pinyin(title, {
      style: style === 'first_letter' ? 'first_letter' : 'normal',
      segment: true, // 启用分词，提高准确率
      heteronym: false // 不返回多音字
    })

    // 提取拼音并连接
    let slug = pinyinResult
      .map(item => item[0])
      .join(separator)
      .toLowerCase()

    // 清理非字母数字字符
    slug = slug
      .replace(/[^a-z0-9\-]/g, separator) // 替换特殊字符
      .replace(new RegExp(`${separator}+`, 'g'), separator) // 合并多个分隔符
      .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '') // 移除首尾分隔符

    // 限制长度
    if (slug.length > maxLength) {
      slug = slug.substring(0, maxLength).replace(new RegExp(`${separator}[^${separator}]*$`), '')
    }

    // 如果结果为空，使用时间戳
    if (!slug || slug.length < 2) {
      slug = `blog-${Date.now()}`
    }

    return slug
  } catch (error) {
    console.error('Slug generation failed:', error)
    return `blog-${Date.now()}`
  }
}

/**
 * 生成短 slug（首字母缩写）
 */
export function generateShortSlug(title: string): string {
  return generateSlug(title, { style: 'first_letter', maxLength: 20 })
}

/**
 * 验证 slug 是否合法
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false
  
  // URL 安全：只包含字母、数字、连字符
  const urlSafeRegex = /^[a-z0-9\-]+$/
  
  return urlSafeRegex.test(slug) && 
         slug.length >= 2 && 
         slug.length <= 100 &&
         !slug.startsWith('-') && 
         !slug.endsWith('-')
}

/**
 * 预览 slug 生成结果
 */
export function previewSlug(title: string): {
  normal: string
  short: string
  isValid: boolean
} {
  const normal = generateSlug(title)
  const short = generateShortSlug(title)
  
  return {
    normal,
    short,
    isValid: isValidSlug(normal)
  }
}

// 示例用法
export const examples = {
  '你好世界': previewSlug('你好世界'),
  'React 18 新特性详解': previewSlug('React 18 新特性详解'),
  '前端开发最佳实践': previewSlug('前端开发最佳实践'),
  'TypeScript 进阶技巧': previewSlug('TypeScript 进阶技巧'),
} 