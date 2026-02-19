import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog'
import { promises as fs } from 'fs'
import path from 'path'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export async function GET() {
  const posts = getAllPosts()
  return NextResponse.json({ posts })
}

export async function POST(req: NextRequest) {
  // Authenticate with secret token
  const authHeader = req.headers.get('authorization')
  const token = process.env.BLOG_SECRET

  if (!token) {
    return NextResponse.json(
      { error: 'BLOG_SECRET is not configured on the server.' },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${token}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { slug, title, excerpt, content, date, metaDescription, keywords, image, author } = body

  // Validate required fields
  if (!slug || !title || !content) {
    return NextResponse.json(
      { error: 'slug, title, and content are required. title and excerpt should be Record<lang, string>. Optional SEO fields: metaDescription (Record<lang, string>), keywords (string[]), image (string URL), author (string).' },
      { status: 400 }
    )
  }

  // Build MDX frontmatter
  const frontmatter: Record<string, unknown> = {
    title,
    slug,
    date: date || new Date().toISOString().split('T')[0],
  }
  if (excerpt) {
    frontmatter.excerpt = excerpt
  }
  if (metaDescription) {
    frontmatter.metaDescription = metaDescription
  }
  if (keywords && Array.isArray(keywords)) {
    frontmatter.keywords = keywords
  }
  if (image) {
    frontmatter.image = image
  }
  if (author) {
    frontmatter.author = author
  }

  // Serialize YAML-like frontmatter
  function serializeValue(val: unknown, indent: number): string {
    if (typeof val === 'string') return `"${val.replace(/"/g, '\\"')}"`
    if (typeof val === 'number' || typeof val === 'boolean') return String(val)
    if (Array.isArray(val)) {
      const pad = '  '.repeat(indent)
      return '\n' + val.map((item) => `${pad}- ${serializeValue(item, indent + 1)}`).join('\n')
    }
    if (typeof val === 'object' && val !== null) {
      const pad = '  '.repeat(indent)
      return '\n' + Object.entries(val as Record<string, unknown>)
        .map(([k, v]) => `${pad}${k}: ${serializeValue(v, indent + 1)}`)
        .join('\n')
    }
    return String(val)
  }

  const yamlLines = Object.entries(frontmatter)
    .map(([key, val]) => `${key}: ${serializeValue(val, 1)}`)
    .join('\n')

  const mdxContent = `---\n${yamlLines}\n---\n\n${content}\n`

  // Write file
  const safeSlug = slug.replace(/[^a-z0-9-]/g, '')
  const filePath = path.join(BLOG_DIR, `${safeSlug}.mdx`)

  await fs.mkdir(BLOG_DIR, { recursive: true })
  await fs.writeFile(filePath, mdxContent, 'utf-8')

  return NextResponse.json({ success: true, slug: safeSlug, path: filePath })
}
