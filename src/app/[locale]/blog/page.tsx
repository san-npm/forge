import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import PageNavbar from '@/components/PageNavbar'
import Footer from '@/components/Footer'
import { BreadcrumbJsonLd, useBreadcrumbs } from '@/components/BreadcrumbJsonLd'
import { getTranslations, getLocale } from 'next-intl/server'

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export default async function BlogPage() {
  const posts = getAllPosts()
  const locale = await getLocale()
  const t = await getTranslations('blog')

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white">
        <PageNavbar />
        <div className="flex-1">
          <div className="min-h-screen pt-20 pb-16">
            {/* Blog header */}
            <div className="bg-gray-50 pb-16">
              <div className="max-w-5xl mx-auto px-4 pt-8">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-8 group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('backToHome')}
                </Link>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
                  {t('title')}
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl animate-fade-in">
                  {t('subtitle')}
                </p>
              </div>
            </div>

            {/* Posts grid */}
            <div className="max-w-5xl mx-auto px-4 -mt-8">
              {posts.length === 0 ? (
                <p className="text-center text-gray-400 py-20">{t('empty')}</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post, index) => {
                    const readTime = estimateReadTime(post.content)
                    const title = post.title[locale] || post.title.fr
                    const excerpt = post.excerpt?.[locale] || post.excerpt?.fr || ''

                    return (
                      <Link
                        key={post.slug}
                        href={`/${locale}/blog/${post.slug}`}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all group animate-slide-up overflow-hidden block"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {/* Colored top bar */}
                        <div className="h-1 bg-primary-500" />

                        <div className="p-6">
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                            <time dateTime={post.date}>
                              {new Date(post.date).toLocaleDateString(locale === 'lb' ? 'de-LU' : locale, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </time>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>{readTime} {t('readTime')}</span>
                          </div>

                          <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                            {title}
                          </h2>

                          <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                            {excerpt}
                          </p>

                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 group-hover:gap-2.5 transition-all">
                            {t('readMore')}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
