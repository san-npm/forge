import { NextRequest, NextResponse } from 'next/server'
import { safeCompare } from '@/lib/safeCompare'
import { rateLimit } from '@/lib/rateLimit'
import { promises as fs } from 'fs'
import path from 'path'

const CONTACTS_FILE = path.join(process.cwd(), 'data', 'contacts.json')
const NEWSLETTER_FILE = path.join(process.cwd(), 'data', 'newsletter.json')

const ADMIN_TOKEN = process.env.ADMIN_TOKEN

async function readJson<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const { ok } = rateLimit(ip, { limit: 10, windowMs: 60_000 })
  if (!ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!ADMIN_TOKEN || !token || !safeCompare(token, ADMIN_TOKEN)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [contacts, subscribers] = await Promise.all([
    readJson<{ name: string; email: string; phone?: string; message?: string; submittedAt: string }>(CONTACTS_FILE),
    readJson<{ email: string; subscribedAt: string }>(NEWSLETTER_FILE),
  ])

  // Sort both by date descending (most recent first)
  contacts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  subscribers.sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime())

  return NextResponse.json({
    contacts,
    subscribers,
    summary: {
      totalContacts: contacts.length,
      totalSubscribers: subscribers.length,
    },
  })
}
