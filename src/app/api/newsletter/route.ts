import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email } = body

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const supabase = getSupabase()

  // Check if already subscribed
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ success: true, alreadySubscribed: true })
  }

  const { error } = await supabase.from('newsletter_subscribers').insert({
    email,
  })

  if (error) {
    console.error('Supabase insert error (newsletter):', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
