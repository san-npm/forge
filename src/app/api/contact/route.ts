import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { sendNotification } from '@/lib/notifications'
import { rateLimit } from '@/lib/rateLimit'
import { ContactPayloadSchema } from '@/lib/schema'

const DATA_FILE = path.join(process.cwd(), 'data', 'contacts.json')

interface ContactEntry {
  name: string
  email: string
  phone?: string
  company?: string
  companySize?: string
  pillar?: string
  budget?: string
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

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const parsed = ContactPayloadSchema.safeParse(body)
  if (!parsed.success) {
    // Provide the same error messages as the salvaged route for parity.
    const issues = parsed.error.issues
    const hasName = issues.some((i) => i.path.includes('name'))
    const hasEmail = issues.some((i) => i.path.includes('email'))
    if (hasName || hasEmail) {
      // Check which field is the problem for the right message
      const emailIssue = issues.find((i) => i.path.includes('email'))
      if (emailIssue && emailIssue.code === 'invalid_string') {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { name, email, phone, company, companySize, pillar, budget, message } = parsed.data

  const entry: ContactEntry = {
    name,
    email,
    ...(phone !== undefined && { phone }),
    ...(company !== undefined && { company }),
    ...(companySize !== undefined && { companySize }),
    ...(pillar !== undefined && { pillar }),
    ...(budget !== undefined && { budget }),
    ...(message !== undefined && { message }),
    submittedAt: new Date().toISOString(),
  }

  const contacts = await readContacts()
  contacts.push(entry)

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(contacts, null, 2))

  // Build notification message context including new qualifying fields.
  const contextLines: string[] = []
  if (companySize) contextLines.push(`Company size: ${companySize}`)
  if (pillar) contextLines.push(`Pillar: ${pillar}`)
  if (budget) contextLines.push(`Budget: ${budget}`)
  if (company) contextLines.push(`Company: ${company}`)
  const fullMessage = [message, contextLines.join(' | ')].filter(Boolean).join('\n') || undefined

  sendNotification({
    type: 'new_contact',
    email,
    name,
    phone,
    message: fullMessage,
    timestamp: entry.submittedAt,
  })

  return NextResponse.json({ success: true })
}
