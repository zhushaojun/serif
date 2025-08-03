'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

import { Home, FileText, Settings, User, LogOut, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SidebarNavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: '首页',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: '博客',
    href: '/dashboard/blogs',
    icon: FileText,
  },
  {
    title: 'AI 聊天',
    href: '/chat',
    icon: MessageSquare,
  },
  {
    title: '设置',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('退出登录时发生错误:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/10">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-semibold">S</span>
          </div>
          <span className="text-lg font-semibold">Serif</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-secondary text-secondary-foreground'
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User Account Section (Bottom) */}
      <div className="p-4 space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-start"
          asChild
        >
          <Link href="/dashboard/account">
            <User className="mr-3 h-4 w-4" />
            账户设置
          </Link>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          {isLoggingOut ? '退出中...' : '退出登录'}
        </Button>
      </div>
    </div>
  )
} 