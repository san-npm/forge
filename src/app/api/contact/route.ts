import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, company, rcs, role, companySize, sector, subject, phone, message, preferredContact } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase.from('contacts').insert({
    name,
    email,
    company: company || null,
    rcs: rcs || null,
    role: role || null,
    company_size: companySize || null,
    sector: sector || null,
    subject: subject || null,
    phone: phone || null,
    message: message || null,
    preferred_contact: preferredContact || null,
  })

  if (error) {
    console.error('Supabase insert error (contacts):', error)
    return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
