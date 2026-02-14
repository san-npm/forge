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

  if (selectedPost) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('blog.backToBlog')}
          </button>

          <article>
            <time className="text-sm text-gray-400 mb-2 block">
              {new Date(selectedPost.date).toLocaleDateString(lang === 'lb' ? 'de-LU' : lang, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              {selectedPost.title[lang] || selectedPost.title.fr}
            </h1>
            <div className="prose prose-gray max-w-none">
              {selectedPost.content.split('\n').map((line, i) => {
                if (line.startsWith('### ')) {
                  return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-3">{line.replace('### ', '')}</h3>
                }
                if (line.startsWith('## ')) {
                  return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-4">{line.replace('## ', '')}</h2>
                }
                if (line.startsWith('- **')) {
                  const match = line.match(/^- \*\*(.+?)\*\*\s*[:：]\s*(.+)$/)
                  if (match) {
                    return (
                      <div key={i} className="flex gap-2 mb-2 ml-4">
                        <span className="text-primary-500 mt-1.5 flex-shrink-0">&#8226;</span>
                        <p className="text-gray-600"><strong className="text-gray-900">{match[1]}</strong> : {match[2]}</p>
                      </div>
                    )
                  }
                }
                if (line.startsWith('- ')) {
                  return (
                    <div key={i} className="flex gap-2 mb-2 ml-4">
                      <span className="text-primary-500 mt-1.5 flex-shrink-0">&#8226;</span>
                      <p className="text-gray-600">{line.replace(/^- /, '').replace(/\*\*(.+?)\*\*/g, '$1')}</p>
                    </div>
                  )
                }
                if (line.match(/^\d+\.\s/)) {
                  return (
                    <div key={i} className="flex gap-3 mb-2 ml-4">
                      <span className="text-primary-600 font-semibold flex-shrink-0">{line.match(/^(\d+)\./)?.[1]}.</span>
                      <p className="text-gray-600">{line.replace(/^\d+\.\s/, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[(.+?)\]\(.+?\)/g, '$1')}</p>
                    </div>
                  )
                }
                if (line.trim() === '') return <div key={i} className="h-3" />
                return <p key={i} className="text-gray-600 mb-3 leading-relaxed">{line}</p>
              })}
            </div>
          </article>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('blog.backToHome')}
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t('blog.title')}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-300 transition-colors cursor-pointer animate-slide-up"
                onClick={() => setSelectedPost(post)}
              >
                <time className="text-sm text-gray-400 mb-2 block">
                  {new Date(post.date).toLocaleDateString(lang === 'lb' ? 'de-LU' : lang, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {post.title[lang] || post.title.fr}
                </h2>
                <p className="text-gray-500 mb-4">
                  {post.excerpt[lang] || post.excerpt.fr}
                </p>
                <span className="text-primary-600 text-sm font-medium hover:text-primary-700">
                  {t('blog.readMore')} &rarr;
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
