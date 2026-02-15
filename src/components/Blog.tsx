'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface BlogPostData {
  slug: string
  title: Record<string, string>
  excerpt: Record<string, string>
  date: string
  content: string
}

interface BlogProps {
  onBack: () => void
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function renderMarkdown(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let inList = false
  let listItems: React.ReactNode[] = []

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-2 mb-6 ml-1">
          {listItems}
        </ul>
      )
      listItems = []
      inList = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Headings
    if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3">
          {line.replace('### ', '')}
        </h3>
      )
      continue
    }
    if (line.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">
          {line.replace('## ', '')}
        </h2>
      )
      continue
    }

    // Bullet list
    if (line.startsWith('- ')) {
      inList = true
      const text = line.replace(/^- /, '')
      const boldMatch = text.match(/^\*\*(.+?)\*\*\s*[:：]\s*(.+)$/)
      if (boldMatch) {
        listItems.push(
          <li key={i} className="flex gap-3 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 flex-shrink-0" />
            <span className="text-gray-600 leading-relaxed">
              <strong className="text-gray-900 font-semibold">{boldMatch[1]}</strong> — {boldMatch[2]}
            </span>
          </li>
        )
      } else {
        listItems.push(
          <li key={i} className="flex gap-3 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 flex-shrink-0" />
            <span className="text-gray-600 leading-relaxed">
              {text.replace(/\*\*(.+?)\*\*/g, '$1')}
            </span>
          </li>
        )
      }
      continue
    }

    // Numbered list
    if (line.match(/^\d+\.\s/)) {
      flushList()
      const num = line.match(/^(\d+)\./)?.[1]
      const text = line.replace(/^\d+\.\s/, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[(.+?)\]\(.+?\)/g, '$1')
      elements.push(
        <div key={i} className="flex gap-3 items-start mb-3 ml-1">
          <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
            {num}
          </span>
          <span className="text-gray-600 leading-relaxed pt-1">{text}</span>
        </div>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      flushList()
      continue
    }

    // Regular paragraph
    flushList()
    elements.push(
      <p key={i} className="text-gray-600 leading-relaxed mb-4">
        {line}
      </p>
    )
  }

  flushList()
  return elements
}

export default function Blog({ onBack }: BlogProps) {
  const { lang, t } = useLanguage()
  const [posts, setPosts] = useState<BlogPostData[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPostData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Article view
  if (selectedPost) {
    const readTime = estimateReadTime(selectedPost.content)

    return (
      <div className="min-h-screen pt-20 pb-16">
        {/* Article header with gradient background */}
        <div className="bg-gray-50 pb-12">
          <div className="max-w-3xl mx-auto px-4 pt-8">
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-8 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('blog.backToBlog')}
            </button>

            <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
              <time>
                {new Date(selectedPost.date).toLocaleDateString(lang === 'lb' ? 'de-LU' : lang, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{readTime} {t('blog.readTime')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {selectedPost.title[lang] || selectedPost.title.fr}
            </h1>
          </div>
        </div>

        {/* Article body */}
        <div className="max-w-3xl mx-auto px-4 -mt-2">
          <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10">
            {renderMarkdown(selectedPost.content)}
          </article>

          {/* Back to blog CTA at bottom */}
          <div className="text-center mt-10">
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 px-6 py-3 text-primary-600 font-medium hover:bg-primary-50 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('blog.backToBlog')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Blog listing view
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Blog header */}
      <div className="bg-gray-50 pb-16">
        <div className="max-w-5xl mx-auto px-4 pt-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-8 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('blog.backToHome')}
          </button>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            {t('blog.title')}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl animate-fade-in">
            {t('blog.subtitle')}
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-5xl mx-auto px-4 -mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400 py-20">{t('blog.empty')}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
              const readTime = estimateReadTime(post.content)
              return (
                <article
                  key={post.slug}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all cursor-pointer group animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Colored top bar */}
                  <div className="h-1 bg-primary-500" />

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <time>
                        {new Date(post.date).toLocaleDateString(lang === 'lb' ? 'de-LU' : lang, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{readTime} {t('blog.readTime')}</span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                      {post.title[lang] || post.title.fr}
                    </h2>

                    <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt[lang] || post.excerpt.fr}
                    </p>

                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 group-hover:gap-2.5 transition-all">
                      {t('blog.readMore')}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
