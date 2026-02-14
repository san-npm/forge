import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'newsletter.json')

interface NewsletterEntry {
  email: string
  subscribedAt: string
}

async function readSubscribers(): Promise<NewsletterEntry[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email } = body

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const subscribers = await readSubscribers()

  // Prevent duplicate subscriptions
  if (subscribers.some((s) => s.email === email)) {
    return NextResponse.json({ success: true, alreadySubscribed: true })
  }

  subscribers.push({
    email,
    subscribedAt: new Date().toISOString(),
  })

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2))

  return NextResponse.json({ success: true })
}
