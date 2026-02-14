import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'contacts.json')

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
  const body = await req.json()
  const { name, email, phone, message } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const entry: ContactEntry = {
    name,
    email,
    phone: phone || undefined,
    message: message || undefined,
    submittedAt: new Date().toISOString(),
  }

  const contacts = await readContacts()
  contacts.push(entry)

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(contacts, null, 2))

  return NextResponse.json({ success: true })
}
