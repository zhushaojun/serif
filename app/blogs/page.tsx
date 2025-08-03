import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BlogCard } from '@/components/blog/blog-card'
import { FeaturedBlogCard } from '@/components/blog/featured-blog-card'
import SiteHeader from '@/components/header'
import { getPublicBlogs, getFeaturedBlogs, getBlogCategories } from '@/lib/actions/blog-actions'
import { Filter, Search } from 'lucide-react'

interface BlogsPageProps {
  searchParams: Promise<{
    category?: string
    page?: string
  }>
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams
  const currentCategory = params.category || 'all'
  const currentPage = parseInt(params.page || '1', 10)

  // 并行获取数据
  const [blogsResult, featuredResult, categoriesResult] = await Promise.all([
    getPublicBlogs({
      page: currentPage,
      limit: 9,
      category: currentCategory
    }),
    getFeaturedBlogs(1),
    getBlogCategories()
  ])

  const { blogs, total } = blogsResult
  const { blogs: featuredBlogs } = featuredResult
  const { categories } = categoriesResult
  const featuredBlog = featuredBlogs[0]

  const totalPages = Math.ceil(total / 9)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SiteHeader />
      
      {/* 页面内容 */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              我们的博客
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              探索设计、技术和创意的精彩世界，分享我们的见解与经验
            </p>
          </div>

          {/* 特色博客 */}
          {featuredBlog && (
            <section className="mb-16">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">特色文章</h2>
              </div>
              <div className="max-w-4xl mx-auto">
                <FeaturedBlogCard blog={featuredBlog} />
              </div>
            </section>
          )}

          {/* 分类筛选 */}
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">筛选分类</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={currentCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                asChild
                className={currentCategory === 'all' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <a href="/blogs">全部</a>
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={currentCategory === category ? 'default' : 'outline'}
                  size="sm"
                  asChild
                  className={currentCategory === category ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  <a href={`/blogs?category=${category}`}>{category}</a>
                </Button>
              ))}
            </div>
          </section>

          {/* 博客列表 */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentCategory === 'all' ? '所有文章' : `${currentCategory} 文章`}
                </h2>
                <Badge variant="secondary" className="ml-2">
                  {total} 篇
                </Badge>
              </div>
            </div>

            {blogs.length > 0 ? (
              <>
                {/* 博客网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {blogs.map((blog) => (
                    <div key={blog.id}>
                      <BlogCard blog={blog} showActions={false} />
                    </div>
                  ))}
                </div>

                {/* 分页 */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    {currentPage > 1 && (
                      <Button variant="outline" asChild>
                        <a
                          href={`/blogs?${new URLSearchParams({
                            ...(currentCategory !== 'all' && { category: currentCategory }),
                            page: (currentPage - 1).toString(),
                          }).toString()}`}
                        >
                          上一页
                        </a>
                      </Button>
                    )}
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? 'default' : 'ghost'}
                          size="sm"
                          asChild
                          className={pageNum === currentPage ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                          <a
                            href={`/blogs?${new URLSearchParams({
                              ...(currentCategory !== 'all' && { category: currentCategory }),
                              page: pageNum.toString(),
                            }).toString()}`}
                          >
                            {pageNum}
                          </a>
                        </Button>
                      ))}
                    </div>

                    {currentPage < totalPages && (
                      <Button variant="outline" asChild>
                        <a
                          href={`/blogs?${new URLSearchParams({
                            ...(currentCategory !== 'all' && { category: currentCategory }),
                            page: (currentPage + 1).toString(),
                          }).toString()}`}
                        >
                          下一页
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* 空状态 */
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    暂无文章
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {currentCategory === 'all'
                      ? '还没有发布任何文章，请稍后再来查看'
                      : `在 "${currentCategory}" 分类下还没有文章`}
                  </p>
                  {currentCategory !== 'all' && (
                    <Button asChild className="bg-red-600 hover:bg-red-700">
                      <a href="/blogs">查看所有文章</a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
} 