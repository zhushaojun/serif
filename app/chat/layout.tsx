import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'
import { Suspense } from 'react'

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 验证用户是否已登录
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    // 使用 100vh 高度和 flex 布局实现全屏
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {children}
    </div>
  )
} 