import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are the Forge AI assistant, a helpful expert on Luxembourg government funding programs for digital transformation and AI innovation. You help SMEs (small and medium enterprises) understand their eligibility and next steps.

Key programs you know about:
1. SME Package Digital — Up to €5,000 (50% coverage). For SMEs with low digital maturity. Includes digital assessment, action plan, and implementation support.
2. SME Package AI — Up to €17,500 (70% coverage). For all SMEs. AI assessment and implementation.
3. Fit 4 Digital — Up to €12,000 (60% coverage). Intensive digital transformation: full audit + roadmap + implementation.
4. Fit 4 AI — Up to €25,000 (70% coverage). Advanced AI support: from use case identification to AI solution deployment.
5. Fit 4 Innovation — Up to €15,000 (50% coverage). Innovation strategy, R&D, new products and services.

Eligibility requirements:
- Company headquarters must be in Luxembourg
- Must have a business permit (autorisation d'établissement)
- Most programs require SME status (< 250 employees)
- Fit 4 Innovation is also open to larger companies

These programs are managed by Luxinnovation, Luxembourg's national innovation agency.

Typical timelines:
- SME Package: 2-3 months from assessment to implementation
- Fit 4 programs: 4-6 months
- Initial application processing: 2-4 weeks

Rules:
- Respond in the same language the user writes in. You support French, English, Luxembourgish, German, Italian, and Portuguese.
- Be concise but informative. Keep answers under 200 words.
- If you don't know something specific, recommend the user fill out the contact form to speak with an expert.
- Never invent program details or grant amounts that aren't listed above.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured. Add it to your .env.local file.' },
      { status: 500 }
    )
  }

  const { message, history } = await req.json()
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const client = new Anthropic({ apiKey })

  const messages: Anthropic.MessageParam[] = [
    ...(history || []).map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: message },
  ]

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages,
  })

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')

  return NextResponse.json({ response: text })
}
