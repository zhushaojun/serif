import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Globe, 
  Palette, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Smartphone,
  Save 
} from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">设置</h1>
        <p className="text-muted-foreground">
          管理你的博客和账户设置
        </p>
      </div>

      <div className="grid gap-6">
        {/* 网站设置 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>网站设置</CardTitle>
            </div>
            <CardDescription>
              配置你的博客基本信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="site-title">网站标题</Label>
              <Input id="site-title" defaultValue="Serif - 现代博客平台" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-description">网站描述</Label>
              <Input 
                id="site-description" 
                defaultValue="一个专注于技术分享和知识传播的现代博客平台" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-url">网站URL</Label>
              <Input id="site-url" defaultValue="https://serif.example.com" />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              保存更改
            </Button>
          </CardContent>
        </Card>

        {/* 外观设置 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>外观</CardTitle>
            </div>
            <CardDescription>
              自定义你的博客外观和主题
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>主题模式</Label>
                <p className="text-sm text-muted-foreground">
                  选择亮色或暗色主题
                </p>
              </div>
              <ThemeToggle />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>颜色主题</Label>
              <div className="flex gap-2">
                <Badge variant="secondary">Stone (当前)</Badge>
                <Badge variant="outline">Blue</Badge>
                <Badge variant="outline">Green</Badge>
                <Badge variant="outline">Purple</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 通知设置 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>通知</CardTitle>
            </div>
            <CardDescription>
              管理你的通知偏好
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  邮件通知
                </Label>
                <p className="text-sm text-muted-foreground">
                  接收新评论和互动的邮件通知
                </p>
              </div>
              <Button variant="outline" size="sm">启用</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  推送通知
                </Label>
                <p className="text-sm text-muted-foreground">
                  接收浏览器推送通知
                </p>
              </div>
              <Button variant="outline" size="sm">设置</Button>
            </div>
          </CardContent>
        </Card>

        {/* 安全设置 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>安全</CardTitle>
            </div>
            <CardDescription>
              管理你的账户安全设置
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">当前密码</Label>
              <Input id="current-password" type="password" placeholder="输入当前密码" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">新密码</Label>
              <Input id="new-password" type="password" placeholder="输入新密码" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">确认新密码</Label>
              <Input id="confirm-password" type="password" placeholder="再次输入新密码" />
            </div>
            <Button variant="outline">
              更新密码
            </Button>
          </CardContent>
        </Card>

        {/* 数据导入导出 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>数据管理</CardTitle>
            </div>
            <CardDescription>
              备份和管理你的博客数据
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>导出数据</Label>
                <p className="text-sm text-muted-foreground">
                  下载你的所有博客数据和设置
                </p>
              </div>
              <Button variant="outline">导出</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>导入数据</Label>
                <p className="text-sm text-muted-foreground">
                  从其他平台导入博客数据
                </p>
              </div>
              <Button variant="outline">导入</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 