import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Calendar,
  CreditCard,
  Crown,
  Settings,
  Trash2,
  Upload
} from 'lucide-react'

export default function AccountPage() {
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">账户设置</h1>
        <p className="text-muted-foreground">
          管理你的个人资料和账户信息
        </p>
      </div>

      <div className="grid gap-6">
        {/* 个人资料 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>个人资料</CardTitle>
            </div>
            <CardDescription>
              更新你的个人信息和头像
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/avatars/01.png" alt="头像" />
                <AvatarFallback className="text-lg">JD</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  更换头像
                </Button>
                <p className="text-xs text-muted-foreground">
                  推荐使用 400x400 像素的正方形图片
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="first-name">名字</Label>
                <Input id="first-name" defaultValue="John" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">姓氏</Label>
                <Input id="last-name" defaultValue="Doe" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="username">用户名</Label>
              <Input id="username" defaultValue="johndoe" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">个人简介</Label>
              <Input 
                id="bio" 
                defaultValue="全栈开发者，专注于现代Web技术"
                placeholder="介绍一下你自己..."
              />
            </div>
            
            <Button>保存更改</Button>
          </CardContent>
        </Card>

        {/* 联系信息 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle>联系信息</CardTitle>
            </div>
            <CardDescription>
              管理你的邮箱和联系方式
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱地址</Label>
              <div className="flex gap-2">
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue="john.doe@example.com"
                  className="flex-1"
                />
                <Badge variant="secondary" className="px-3">已验证</Badge>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="website">个人网站</Label>
              <Input 
                id="website" 
                type="url" 
                defaultValue="https://johndoe.dev"
                placeholder="https://your-website.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input 
                id="twitter" 
                defaultValue="@johndoe"
                placeholder="@username"
              />
            </div>
            
            <Button variant="outline">更新联系信息</Button>
          </CardContent>
        </Card>

        {/* 账户信息 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>账户信息</CardTitle>
            </div>
            <CardDescription>
              查看你的账户状态和统计
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-sm font-medium">注册日期</Label>
                <p className="text-sm text-muted-foreground">2024年1月15日</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">账户类型</Label>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <Badge variant="secondary">专业版</Badge>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">发布文章</Label>
                <p className="text-sm text-muted-foreground">12 篇</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">总访问量</Label>
                <p className="text-sm text-muted-foreground">2,451 次</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 订阅管理 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>订阅管理</CardTitle>
            </div>
            <CardDescription>
              管理你的订阅和付费计划
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <Label className="font-medium">专业版订阅</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  每月 ¥29 · 下次续费：2024年1月15日
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  管理
                </Button>
              </div>
            </div>
            
            <div className="text-center py-4">
              <Button variant="outline">查看所有计划</Button>
            </div>
          </CardContent>
        </Card>

        {/* 危险操作 */}
        <Card className="border-destructive/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">危险操作</CardTitle>
            </div>
            <CardDescription>
              这些操作无法撤销，请谨慎操作
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>删除账户</Label>
                <p className="text-sm text-muted-foreground">
                  永久删除你的账户和所有数据
                </p>
              </div>
              <Button variant="destructive" size="sm">
                删除账户
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 