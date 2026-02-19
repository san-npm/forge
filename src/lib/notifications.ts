const WEBHOOK_URL = process.env.NOTIFICATION_WEBHOOK_URL

interface NotificationPayload {
  type: 'new_contact' | 'new_subscriber'
  email: string
  name?: string
  phone?: string
  message?: string
  timestamp: string
}

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  if (!WEBHOOK_URL) return

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: formatMessage(payload),
        ...payload,
      }),
    })
  } catch {
    // Notification delivery is best-effort; don't break the main flow
    console.error('Failed to send notification webhook')
  }
}

function formatMessage(payload: NotificationPayload): string {
  if (payload.type === 'new_contact') {
    return `New contact from ${payload.name} (${payload.email})${payload.message ? `: ${payload.message}` : ''}`
  }
  return `New newsletter subscriber: ${payload.email}`
}
