import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import BlogPostClient from './BlogPostClient'

const SITE_URL = 'https://www.openletz.com'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Article introuvable' }

  const title = post.title.fr || Object.values(post.title)[0] || slug
  const description = post.excerpt?.fr || post.excerpt?.en || ''
  const url = `${SITE_URL}/blog/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.date,
      siteName: 'OpenLetz',
      locale: 'fr_LU',
      alternateLocale: ['en_GB', 'de_LU', 'lb_LU'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title.fr || Object.values(post.title)[0],
    description: post.excerpt?.fr || post.excerpt?.en || '',
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_URL}/blog/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'OpenLetz',
      url: SITE_URL,
    },
    author: {
      '@type': 'Organization',
      name: 'OpenLetz',
      url: SITE_URL,
    },
    inLanguage: 'fr',
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} />
    </>
  )
}
