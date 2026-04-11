/**
 * Lead notification dispatcher.
 *
 * Every contact / newsletter submission is fanned out to multiple sinks so a
 * single misconfiguration cannot lose leads:
 *
 *   1. console.log (always)        — captured by Vercel/host stdout logs forever.
 *   2. NOTIFICATION_WEBHOOK_URL    — generic JSON POST (Slack, Discord, Make, Zapier, …).
 *   3. Telegram (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID) — instant ping to Clément.
 *
 * Filesystem persistence (data/contacts.json) is unreliable on serverless
 * platforms because the FS is ephemeral. The console.log + Telegram path is
 * the durable lead trail.
 */

const WEBHOOK_URL = process.env.NOTIFICATION_WEBHOOK_URL
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

interface NotificationPayload {
  type: 'new_contact' | 'new_subscriber'
  email: string
  name?: string
  phone?: string
  message?: string
  timestamp: string
}

const FETCH_TIMEOUT_MS = 4000

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  // 1. Always log to stdout — durable on every host (Vercel, Netlify, self-hosted).
  // Use a stable, greppable prefix so logs can be queried.
  console.log(
    `[lead] ${payload.type} ${JSON.stringify({
      email: payload.email,
      name: payload.name,
      phone: payload.phone,
      message: payload.message?.slice(0, 500),
      timestamp: payload.timestamp,
    })}`,
  )

  // 2 + 3. Fan-out delivery — any failures are swallowed so the API stays 200.
  await Promise.allSettled([sendToWebhook(payload), sendToTelegram(payload)])
}

async function sendToWebhook(payload: NotificationPayload): Promise<void> {
  if (!WEBHOOK_URL) return
  try {
    await fetchWithTimeout(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: formatMessage(payload),
        ...payload,
      }),
    })
  } catch {
    console.error('[lead] webhook delivery failed')
  }
}

async function sendToTelegram(payload: NotificationPayload): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return
  try {
    await fetchWithTimeout(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: formatTelegram(payload),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
  } catch {
    console.error('[lead] telegram delivery failed')
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function formatMessage(payload: NotificationPayload): string {
  if (payload.type === 'new_contact') {
    return `New contact from ${payload.name} (${payload.email})${payload.message ? `: ${payload.message}` : ''}`
  }
  return `New newsletter subscriber: ${payload.email}`
}

function formatTelegram(payload: NotificationPayload): string {
  if (payload.type === 'new_contact') {
    const name = escapeHtml(payload.name || 'Unknown')
    const email = escapeHtml(payload.email)
    const phone = payload.phone ? `\n📞 ${escapeHtml(payload.phone)}` : ''
    const message = payload.message ? `\n💬 ${escapeHtml(payload.message)}` : ''
    return `<b>🔥 OpenLetz — New contact</b>\n👤 ${name}\n✉️ ${email}${phone}${message}`
  }
  return `<b>📬 OpenLetz — New newsletter subscriber</b>\n✉️ ${escapeHtml(payload.email)}`
}
