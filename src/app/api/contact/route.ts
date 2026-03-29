import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { sendNotification } from '@/lib/notifications'
import { rateLimit } from '@/lib/rateLimit'

const DATA_FILE = path.join(process.cwd(), 'data', 'contacts.json')

const MAX_FIELD = 500
const MAX_MESSAGE = 2000

function sanitize(val: unknown, max: number): string | undefined {
  if (typeof val !== 'string') return undefined
  return val.trim().slice(0, max) || undefined
}

interface ContactEntry {
  name: string
  email: string
  phone?: string
  message?: string
  submittedAt: string
}

async function readContacts(): Promise<ContactEntry[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const { ok } = rateLimit(ip, { limit: 5, windowMs: 60_000 })
  if (!ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json()
  const name = sanitize(body.name, MAX_FIELD)
  const email = sanitize(body.email, MAX_FIELD)
  const phone = sanitize(body.phone, MAX_FIELD)
  const message = sanitize(body.message, MAX_MESSAGE)

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
  }

  const entry: ContactEntry = {
    name,
    email,
    phone,
    message,
    submittedAt: new Date().toISOString(),
  }

  const contacts = await readContacts()
  contacts.push(entry)

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(contacts, null, 2))

  sendNotification({
    type: 'new_contact',
    email,
    name,
    phone,
    message,
    timestamp: entry.submittedAt,
  })

  return NextResponse.json({ success: true })
}
