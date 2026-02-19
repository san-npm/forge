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
  const description = post.metaDescription?.fr || post.excerpt?.fr || post.excerpt?.en || ''
  const url = `${SITE_URL}/blog/${slug}`
  const image = post.image || `${SITE_URL}/og-image.png`

  return {
    title,
    description,
    keywords: post.keywords,
    authors: post.author ? [{ name: post.author }] : [{ name: 'OpenLetz' }],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author] : ['OpenLetz'],
      siteName: 'OpenLetz',
      locale: 'fr_LU',
      alternateLocale: ['en_GB', 'de_LU', 'lb_LU'],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      'ICBM': '49.6117, 6.1300',
      'content-language': 'fr',
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
    description: post.metaDescription?.fr || post.excerpt?.fr || post.excerpt?.en || '',
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_URL}/blog/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'OpenLetz',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/openletz-logo.png` },
    },
    author: {
      '@type': 'Organization',
      name: post.author || 'OpenLetz',
      url: SITE_URL,
    },
    inLanguage: 'fr',
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    image: post.image || `${SITE_URL}/og-image.png`,
    keywords: post.keywords?.join(', '),
    spatialCoverage: {
      '@type': 'Place',
      name: 'Luxembourg',
      geo: { '@type': 'GeoCoordinates', latitude: 49.6117, longitude: 6.13 },
    },
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
