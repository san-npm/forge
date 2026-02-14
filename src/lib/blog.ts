import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface BlogPost {
  slug: string
  title: Record<string, string>
  excerpt: Record<string, string>
  date: string
  content: string
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)

    return {
      slug: data.slug || filename.replace('.mdx', ''),
      title: data.title as Record<string, string>,
      excerpt: data.excerpt as Record<string, string>,
      date: data.date as string,
      content,
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts()
  return posts.find((p) => p.slug === slug) ?? null
}
