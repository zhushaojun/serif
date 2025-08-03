'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function ToastHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lastToastId = useRef<string | null>(null)

  useEffect(() => {
    // 使用setTimeout延迟执行，确保页面完全加载后再显示toast
    const timer = setTimeout(() => {
      const success = searchParams.get('success')
    const error = searchParams.get('error')
    const action = searchParams.get('action')
    const timestamp = searchParams.get('t')

    // 使用时间戳避免重复显示同一个toast
    if (!timestamp || lastToastId.current === timestamp) {
      return
    }

    if (success === 'true' && action) {
      lastToastId.current = timestamp
      
      // 显示对应的成功消息
      switch (action) {
        case 'create':
          toast.success('博客创建成功！', {
            description: '您的博客已成功创建，现在可以查看和分享了。'
          })
          break
        case 'update':
          toast.success('博客更新成功！', {
            description: '您的博客已成功更新并保存。'
          })
          break
        case 'delete':
          toast.success('博客删除成功！', {
            description: '选中的博客已被成功删除。'
          })
          break
        default:
          toast.success('操作成功！')
      }
      
      // 清理URL参数，避免刷新页面时重复显示toast
      const currentUrl = new URL(window.location.href)
      currentUrl.searchParams.delete('success')
      currentUrl.searchParams.delete('action') 
      currentUrl.searchParams.delete('t')
      router.replace(currentUrl.pathname + (currentUrl.search || ''), { scroll: false })
    }

    if (error && action) {
      lastToastId.current = timestamp
      
      // 显示对应的错误消息
      switch (action) {
        case 'create':
          toast.error('博客创建失败', {
            description: error
          })
          break
        case 'update':
          toast.error('博客更新失败', {
            description: error
          })
          break
        case 'delete':
          toast.error('博客删除失败', {
            description: error
          })
          break
        default:
          toast.error('操作失败', {
            description: error
          })
      }
      
      // 清理URL参数，避免刷新页面时重复显示toast
      const currentUrl = new URL(window.location.href)
      currentUrl.searchParams.delete('success')
      currentUrl.searchParams.delete('error')
      currentUrl.searchParams.delete('action')
      currentUrl.searchParams.delete('t')
      router.replace(currentUrl.pathname + (currentUrl.search || ''), { scroll: false })
    }
    }, 100) // 延迟100ms执行

    return () => clearTimeout(timer)
  }, [searchParams, router])

  return null
} 