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
  const { slug, title, excerpt, content, date } = body

  // Validate required fields
  if (!slug || !title || !content) {
    return NextResponse.json(
      { error: 'slug, title, and content are required. title and excerpt should be Record<lang, string>.' },
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

  // Serialize YAML-like frontmatter
  function serializeValue(val: unknown, indent: number): string {
    if (typeof val === 'string') return `"${val.replace(/"/g, '\\"')}"`
    if (typeof val === 'number' || typeof val === 'boolean') return String(val)
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

export async function PUT(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = process.env.BLOG_SECRET

  if (!token) {
    return NextResponse.json({ error: 'BLOG_SECRET is not configured on the server.' }, { status: 500 })
  }
  if (authHeader !== `Bearer ${token}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { slug, title, excerpt, content, date } = body

  if (!slug) {
    return NextResponse.json({ error: 'slug is required to identify the article to update.' }, { status: 400 })
  }

  const safeSlug = slug.replace(/[^a-z0-9-]/g, '')
  const filePath = path.join(BLOG_DIR, `${safeSlug}.mdx`)

  // Check file exists
  try {
    await fs.access(filePath)
  } catch {
    return NextResponse.json({ error: `Article "${safeSlug}" not found.` }, { status: 404 })
  }

  // Read existing post to merge with updates
  const existing = await fs.readFile(filePath, 'utf-8')
  const matter = await import('gray-matter')
  const parsed = matter.default(existing)

  const updatedFrontmatter: Record<string, unknown> = {
    ...parsed.data,
    ...(title && { title }),
    ...(excerpt && { excerpt }),
    ...(date && { date }),
  }

  function serializeValue(val: unknown, indent: number): string {
    if (typeof val === 'string') return `"${val.replace(/"/g, '\\"')}"`
    if (typeof val === 'number' || typeof val === 'boolean') return String(val)
    if (typeof val === 'object' && val !== null) {
      const pad = '  '.repeat(indent)
      return '\n' + Object.entries(val as Record<string, unknown>)
        .map(([k, v]) => `${pad}${k}: ${serializeValue(v, indent + 1)}`)
        .join('\n')
    }
    return String(val)
  }

  const yamlLines = Object.entries(updatedFrontmatter)
    .map(([key, val]) => `${key}: ${serializeValue(val, 1)}`)
    .join('\n')

  const updatedContent = content !== undefined ? content : parsed.content.trim()
  const mdxContent = `---\n${yamlLines}\n---\n\n${updatedContent}\n`

  await fs.writeFile(filePath, mdxContent, 'utf-8')

  return NextResponse.json({ success: true, slug: safeSlug })
}

export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = process.env.BLOG_SECRET

  if (!token) {
    return NextResponse.json({ error: 'BLOG_SECRET is not configured on the server.' }, { status: 500 })
  }
  if (authHeader !== `Bearer ${token}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await req.json()

  if (!slug) {
    return NextResponse.json({ error: 'slug is required.' }, { status: 400 })
  }

  const safeSlug = slug.replace(/[^a-z0-9-]/g, '')
  const filePath = path.join(BLOG_DIR, `${safeSlug}.mdx`)

  try {
    await fs.access(filePath)
  } catch {
    return NextResponse.json({ error: `Article "${safeSlug}" not found.` }, { status: 404 })
  }

  await fs.unlink(filePath)

  return NextResponse.json({ success: true, slug: safeSlug })
}
