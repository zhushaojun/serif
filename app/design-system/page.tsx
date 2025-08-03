"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/theme-toggle'
import { Copy, Check, Palette, Type, Layout, Package } from 'lucide-react'
import { BlogCard } from '@/components/blog/blog-card'

export default function DesignSystemPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const colorPalette = [
    // Primary Colors
    { name: "Background", variable: "--background", className: "bg-background border", textColor: "text-foreground" },
    { name: "Foreground", variable: "--foreground", className: "bg-foreground", textColor: "text-background" },
    { name: "Primary", variable: "--primary", className: "bg-primary", textColor: "text-primary-foreground" },
    { name: "Primary Foreground", variable: "--primary-foreground", className: "bg-primary-foreground border", textColor: "text-primary" },
    { name: "Secondary", variable: "--secondary", className: "bg-secondary", textColor: "text-secondary-foreground" },
    { name: "Secondary Foreground", variable: "--secondary-foreground", className: "bg-secondary-foreground", textColor: "text-secondary" },
    
    // Accent Colors
    { name: "Accent", variable: "--accent", className: "bg-accent", textColor: "text-accent-foreground" },
    { name: "Accent Foreground", variable: "--accent-foreground", className: "bg-accent-foreground", textColor: "text-accent" },
    { name: "Muted", variable: "--muted", className: "bg-muted", textColor: "text-muted-foreground" },
    { name: "Muted Foreground", variable: "--muted-foreground", className: "bg-muted-foreground", textColor: "text-muted" },
    { name: "Destructive", variable: "--destructive", className: "bg-destructive", textColor: "text-white" },
    { name: "Border", variable: "--border", className: "bg-border border-2 border-foreground", textColor: "text-foreground" },
    
    // UI Colors
    { name: "Card", variable: "--card", className: "bg-card border", textColor: "text-card-foreground" },
    { name: "Card Foreground", variable: "--card-foreground", className: "bg-card-foreground", textColor: "text-card" },
    { name: "Popover", variable: "--popover", className: "bg-popover border", textColor: "text-popover-foreground" },
    { name: "Input", variable: "--input", className: "bg-input border", textColor: "text-foreground" },
    { name: "Ring", variable: "--ring", className: "bg-ring", textColor: "text-background" },
    
    // Chart Colors
    { name: "Chart 1", variable: "--chart-1", className: "bg-chart-1", textColor: "text-white" },
    { name: "Chart 2", variable: "--chart-2", className: "bg-chart-2", textColor: "text-white" },
    { name: "Chart 3", variable: "--chart-3", className: "bg-chart-3", textColor: "text-white" },
    { name: "Chart 4", variable: "--chart-4", className: "bg-chart-4", textColor: "text-white" },
    { name: "Chart 5", variable: "--chart-5", className: "bg-chart-5", textColor: "text-white" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Serif 设计系统</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                完整的设计系统展示，包含色彩调色板、排版系统和组件样式
              </p>
            </div>
            <ThemeToggle />
          </div>
          
          {/* Navigation */}
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" size="sm" onClick={() => document.getElementById('colors')?.scrollIntoView()}>
              <Palette className="w-4 h-4 mr-2" />
              色彩系统
            </Button>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('typography')?.scrollIntoView()}>
              <Type className="w-4 h-4 mr-2" />
              排版系统
            </Button>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('components')?.scrollIntoView()}>
              <Package className="w-4 h-4 mr-2" />
              组件展示
            </Button>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('spacing')?.scrollIntoView()}>
              <Layout className="w-4 h-4 mr-2" />
              间距布局
            </Button>
          </div>
        </div>

        {/* Color Palette */}
        <section id="colors" className="space-y-6">
          <h2 className="text-3xl font-semibold text-foreground">色彩调色板</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {colorPalette.map((color) => (
              <ColorSwatch 
                key={color.variable}
                name={color.name}
                variable={color.variable}
                className={color.className}
                textColor={color.textColor}
                onCopy={copyToClipboard}
                isCopied={copiedText === color.variable}
              />
            ))}
          </div>
        </section>

        {/* Typography */}
        <section id="typography" className="space-y-6">
          <h2 className="text-3xl font-semibold text-foreground">排版系统</h2>
          
          {/* Font Families */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-foreground">字体家族</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Inter (默认)</CardTitle>
                  <CardDescription>现代无衬线字体，用于界面和正文</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-sans text-sm">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                  <p className="font-sans text-sm">abcdefghijklmnopqrstuvwxyz</p>
                  <p className="font-sans text-sm">0123456789</p>
                  <p className="font-sans">这是一段示例文本，展示Inter字体的效果。</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Font Sizes and Weights */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-foreground">字体大小和粗细</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-foreground">标题</h4>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">H1 - 4xl / Bold (36px)</h1>
                  <h2 className="text-3xl font-semibold">H2 - 3xl / Semibold (30px)</h2>
                  <h3 className="text-2xl font-semibold">H3 - 2xl / Semibold (24px)</h3>
                  <h4 className="text-xl font-medium">H4 - xl / Medium (20px)</h4>
                  <h5 className="text-lg font-medium">H5 - lg / Medium (18px)</h5>
                  <h6 className="text-base font-medium">H6 - base / Medium (16px)</h6>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-medium text-foreground">正文</h4>
                <div className="space-y-2">
                  <p className="text-lg">大号正文 - lg (18px)</p>
                  <p className="text-base">标准正文 - base (16px)</p>
                  <p className="text-sm">小号正文 - sm (14px)</p>
                  <p className="text-xs">超小正文 - xs (12px)</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-medium text-foreground">字体粗细</h4>
                <div className="space-y-2">
                  <p className="font-thin">细体 - font-thin (100)</p>
                  <p className="font-extralight">超细体 - font-extralight (200)</p>
                  <p className="font-light">细体 - font-light (300)</p>
                  <p className="font-normal">常规 - font-normal (400)</p>
                  <p className="font-medium">中等 - font-medium (500)</p>
                  <p className="font-semibold">半粗体 - font-semibold (600)</p>
                  <p className="font-bold">粗体 - font-bold (700)</p>
                  <p className="font-extrabold">超粗体 - font-extrabold (800)</p>
                  <p className="font-black">黑体 - font-black (900)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Showcase */}
        <section id="components" className="space-y-6">
          <h2 className="text-3xl font-semibold text-foreground">组件展示</h2>
          
          {/* Buttons */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-foreground">按钮</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">默认按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">边框按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="link">链接按钮</Button>
              <Button variant="destructive">危险按钮</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">小号</Button>
              <Button size="default">默认</Button>
              <Button size="lg">大号</Button>
              <Button size="icon">🎉</Button>
            </div>
          </div>

          {/* Form Elements */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-foreground">表单元素</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="example-input">示例输入框</Label>
                <Input id="example-input" placeholder="请输入内容..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled-input">禁用状态</Label>
                <Input id="disabled-input" placeholder="禁用状态" disabled />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-foreground">卡片</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>基础卡片</CardTitle>
                  <CardDescription>这是一个基础的卡片组件</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>卡片内容区域，可以包含任何内容。</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>带操作的卡片</CardTitle>
                  <CardDescription>包含按钮和交互元素的卡片</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>这是卡片的主要内容区域。</p>
                  <Button size="sm">操作按钮</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>复杂卡片</CardTitle>
                  <CardDescription>包含多种元素的复杂卡片</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                    <span className="text-sm">状态指示器</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    更多详细信息和描述内容。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Blog Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-foreground">博客卡片</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BlogCard 
                blog={{
                  id: '1',
                  title: 'Getting Started with Next.js 14',
                  subtitle: 'Learn the fundamentals of modern web development',
                  slug: 'getting-started-nextjs-14',
                  content: 'This is a comprehensive guide to getting started with Next.js 14. We will cover the basics of setting up a project, understanding the app router, and building your first components. The new features in Next.js 14 bring significant improvements to performance and developer experience.',
                  author: 'John Doe',
                  author_id: 'user-1',
                  category: 'design',
                  image: '/images/hero-background.jpg',
                  created_at: '2025-06-18T10:00:00Z',
                  updated_at: '2025-06-18T10:00:00Z'
                }}
                showActions={false}
              />
              
              <BlogCard 
                blog={{
                  id: '2',
                  title: '构建现代化的用户界面',
                  subtitle: '使用 React 和 Tailwind CSS 创建优美的组件',
                  slug: 'building-modern-ui',
                  content: '在这篇文章中，我们将探讨如何使用现代化的工具和技术来构建用户界面。我们将涵盖设计原则、组件架构和样式系统。',
                  author: '张三',
                  author_id: 'user-2',
                  category: 'tech',
                  created_at: '2025-06-17T14:30:00Z',
                  updated_at: '2025-06-17T14:30:00Z'
                }}
                showActions={false}
              />
              
              <BlogCard 
                blog={{
                  id: '3',
                  title: 'Design System Best Practices',
                  subtitle: 'Creating consistent and scalable design systems',
                  slug: 'design-system-best-practices',
                  content: 'A well-structured design system is the foundation of any successful product. It ensures consistency, speeds up development, and improves collaboration between designers and developers.',
                  author: 'Designer Pro',
                  author_id: 'user-3',
                  category: 'lifestyle',
                  image: '/images/hero-background.jpg',
                  created_at: '2025-06-16T09:15:00Z',
                  updated_at: '2025-06-16T09:15:00Z'
                }}
                showActions={false}
              />
            </div>
          </div>
        </section>

        {/* Spacing and Radius */}
        <section id="spacing" className="space-y-6">
          <h2 className="text-3xl font-semibold text-foreground">间距和圆角</h2>
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-foreground">圆角系统</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="w-16 h-16 bg-primary rounded-sm"></div>
                <p className="text-sm">Small (0.375rem)</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-primary rounded-md"></div>
                <p className="text-sm">Medium (0.5rem)</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-primary rounded-lg"></div>
                <p className="text-sm">Large (0.625rem)</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-primary rounded-xl"></div>
                <p className="text-sm">XLarge (0.75rem)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-foreground">间距系统</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-1 h-6 bg-primary"></div>
                <span className="text-sm">0.25rem (4px) - space-1</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-6 bg-primary"></div>
                <span className="text-sm">0.5rem (8px) - space-2</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-6 bg-primary"></div>
                <span className="text-sm">0.75rem (12px) - space-3</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-6 bg-primary"></div>
                <span className="text-sm">1rem (16px) - space-4</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-primary"></div>
                <span className="text-sm">1.5rem (24px) - space-6</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-6 bg-primary"></div>
                <span className="text-sm">2rem (32px) - space-8</span>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-foreground">使用指南</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>颜色使用原则</CardTitle>
                <CardDescription>如何正确使用设计系统中的颜色</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h5 className="font-medium">主色彩 (Primary)</h5>
                  <p className="text-sm text-muted-foreground">用于主要操作按钮、链接和重要元素的强调</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">次要色彩 (Secondary)</h5>
                  <p className="text-sm text-muted-foreground">用于次要操作和辅助信息的展示</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">强调色 (Accent)</h5>
                  <p className="text-sm text-muted-foreground">用于悬停状态和活跃元素</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">危险色 (Destructive)</h5>
                  <p className="text-sm text-muted-foreground">用于删除、警告和错误状态</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>排版层次</CardTitle>
                <CardDescription>文字大小和权重的使用建议</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h5 className="font-medium">标题层次</h5>
                  <p className="text-sm text-muted-foreground">H1-H6 用于建立清晰的信息层次结构</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">正文文本</h5>
                  <p className="text-sm text-muted-foreground">base (16px) 为标准阅读大小</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">辅助信息</h5>
                  <p className="text-sm text-muted-foreground">sm (14px) 用于次要信息和标签</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">主要字体</h5>
                  <p className="text-sm text-muted-foreground">Inter 用于所有界面文字和正文内容</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

// Color Swatch Component
interface ColorSwatchProps {
  name: string
  variable: string
  className: string
  textColor: string
  onCopy?: (text: string) => void
  isCopied?: boolean
}

function ColorSwatch({ name, variable, className, textColor, onCopy, isCopied }: ColorSwatchProps) {
  return (
    <div className="space-y-2">
      <div 
        className={`w-full h-20 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${className}`}
        onClick={() => onCopy?.(variable)}
        title={`点击复制 ${variable}`}
      >
        <span className={`text-xs font-medium ${textColor}`}>
          {name}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <p className="font-mono">{variable}</p>
          <button 
            onClick={() => onCopy?.(variable)}
            className="ml-2 p-1 rounded hover:bg-accent"
            title="复制变量名"
          >
            {isCopied ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 