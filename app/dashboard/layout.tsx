import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ToastHandler } from '@/components/dashboard/toast-handler'
import { Suspense } from 'react'

export default async function DashboardLayout({
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
      <Suspense fallback={null}>
        <ToastHandler />
      </Suspense>
    </div>
  )
} 