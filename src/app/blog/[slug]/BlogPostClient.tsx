'use client'

import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import PageNavbar from '@/components/PageNavbar'
import Footer from '@/components/Footer'

interface BlogPost {
  slug: string
  title: Record<string, string>
  excerpt: Record<string, string>
  date: string
  content: string
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

    if (line.startsWith('- ') || line.startsWith('* ')) {
      inList = true
      const text = line.replace(/^[-*]\s/, '')
      const parts = text.split(/\*\*(.*?)\*\*/g)
      listItems.push(
        <li key={i} className="flex items-start gap-2 text-gray-700">
          <span className="text-blue-500 mt-1.5 text-xs">●</span>
          <span>
            {parts.map((part, idx) =>
              idx % 2 === 1 ? (
                <strong key={idx} className="font-semibold text-gray-900">{part}</strong>
              ) : (
                part
              )
            )}
          </span>
        </li>
      )
      continue
    }

    if (inList && line.trim() === '') {
      flushList()
      continue
    }

    if (line.trim() === '') {
      flushList()
      continue
    }

    flushList()
    const parts = line.split(/\*\*(.*?)\*\*/g)
    elements.push(
      <p key={i} className="text-gray-700 leading-relaxed mb-4">
        {parts.map((part, idx) =>
          idx % 2 === 1 ? (
            <strong key={idx} className="font-semibold text-gray-900">{part}</strong>
          ) : (
            part
          )
        )}
      </p>
    )
  }

  flushList()
  return elements
}

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const router = useRouter()
  const { lang } = useLanguage()

  const title = post.title[lang] || post.title.fr || Object.values(post.title)[0]
  const readTime = estimateReadTime(post.content)

  const formattedDate = new Date(post.date).toLocaleDateString(
    lang === 'lb' ? 'de-LU' : `${lang}-LU`,
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageNavbar />
      <div className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-16">
          <button
            onClick={() => router.push('/blog')}
            className="mb-8 text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            ← {lang === 'fr' ? 'Retour au blog' : lang === 'de' ? 'Zurück zum Blog' : 'Back to blog'}
          </button>

          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <time dateTime={post.date}>{formattedDate}</time>
              <span>·</span>
              <span>{readTime} min {lang === 'fr' ? 'de lecture' : 'read'}</span>
            </div>
          </header>

          <div className="prose-like">
            {renderMarkdown(post.content)}
          </div>

          <footer className="mt-16 pt-8 border-t border-gray-100">
            <button
              onClick={() => router.push('/blog')}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← {lang === 'fr' ? 'Voir tous les articles' : 'See all articles'}
            </button>
          </footer>
        </article>
      </div>
      <Footer />
    </div>
  )
}
