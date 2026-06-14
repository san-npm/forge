'use client'

import { useState } from 'react'

interface Contact {
  name: string
  email: string
  phone?: string
  message?: string
  submittedAt: string
}

interface Subscriber {
  email: string
  subscribedAt: string
}

interface NotificationsData {
  contacts: Contact[]
  subscribers: Subscriber[]
  summary: {
    totalContacts: number
    totalSubscribers: number
  }
}

export default function AdminNotificationsPage() {
  const [token, setToken] = useState('')
  const [data, setData] = useState<NotificationsData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  async function fetchNotifications() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        setError(res.status === 401 ? 'Invalid token' : 'Failed to fetch notifications')
        return
      }
      const json = await res.json()
      setData(json)
      setAuthenticated(true)
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString()
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="bg-surface border border-hairline rounded-2xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-xl font-bold text-text mb-2">Admin Notifications</h1>
          <p className="text-sm text-text-dim mb-6">Enter your admin token to view notifications.</p>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchNotifications()}
            placeholder="Admin token"
            className="w-full px-4 py-2.5 border border-hairline bg-surface-2 text-text placeholder:text-text-dim rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:border-transparent mb-4"
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            onClick={fetchNotifications}
            disabled={loading || !token}
            className="w-full py-2.5 bg-accent text-[#0A0A0B] rounded-lg text-sm font-medium hover:bg-[var(--accent-dim)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'View Notifications'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-text">Notifications</h1>
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="px-4 py-2 bg-accent text-[#0A0A0B] rounded-lg text-sm font-medium hover:bg-[var(--accent-dim)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Summary cards */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-surface rounded-xl p-6 shadow-sm border border-hairline">
              <p className="text-sm text-text-dim mb-1">Total Contacts</p>
              <p className="text-3xl font-bold text-text">{data.summary.totalContacts}</p>
            </div>
            <div className="bg-surface rounded-xl p-6 shadow-sm border border-hairline">
              <p className="text-sm text-text-dim mb-1">Newsletter Subscribers</p>
              <p className="text-3xl font-bold text-text">{data.summary.totalSubscribers}</p>
            </div>
          </div>
        )}

        {/* Contacts */}
        {data && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-text mb-4">Recent Contacts</h2>
            {data.contacts.length === 0 ? (
              <p className="text-sm text-text-dim bg-surface rounded-xl p-6 shadow-sm border border-hairline">No contacts yet.</p>
            ) : (
              <div className="space-y-3">
                {data.contacts.map((contact, i) => (
                  <div key={i} className="bg-surface rounded-xl p-5 shadow-sm border border-hairline">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-text">{contact.name}</span>
                          <span className="text-sm text-text-dim">{contact.email}</span>
                          {contact.phone && (
                            <span className="text-sm text-text-dim">{contact.phone}</span>
                          )}
                        </div>
                        {contact.message && (
                          <p className="text-sm text-text-dim mt-1">{contact.message}</p>
                        )}
                      </div>
                      <span className="text-xs text-text-dim whitespace-nowrap">{formatDate(contact.submittedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscribers */}
        {data && (
          <div>
            <h2 className="text-lg font-semibold text-text mb-4">Newsletter Subscribers</h2>
            {data.subscribers.length === 0 ? (
              <p className="text-sm text-text-dim bg-surface rounded-xl p-6 shadow-sm border border-hairline">No subscribers yet.</p>
            ) : (
              <div className="bg-surface rounded-xl shadow-sm border border-hairline overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-hairline">
                      <th className="text-left px-5 py-3 text-text-dim font-medium">Email</th>
                      <th className="text-right px-5 py-3 text-text-dim font-medium">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subscribers.map((sub, i) => (
                      <tr key={i} className="border-b border-hairline last:border-0">
                        <td className="px-5 py-3 text-text">{sub.email}</td>
                        <td className="px-5 py-3 text-text-dim text-right">{formatDate(sub.subscribedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
