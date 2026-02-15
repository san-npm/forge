'use client'

import { useState } from 'react'
import { AGENT_VISUALS } from '@/lib/agents'

interface AgentLogoProps {
  slug: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeConfig = {
  sm: { container: 'w-8 h-8 rounded-lg', img: 20, text: 'text-xs' },
  md: { container: 'w-10 h-10 rounded-xl', img: 28, text: 'text-sm' },
  lg: { container: 'w-14 h-14 rounded-2xl', img: 36, text: 'text-base' },
}

export default function AgentLogo({ slug, name, size = 'md', className = '' }: AgentLogoProps) {
  const [imgError, setImgError] = useState(0)
  const visual = AGENT_VISUALS[slug]
  const color = visual?.color || '#6B7280'
  const domain = visual?.domain
  const config = sizeConfig[size]

  const sources = domain
    ? [
        `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        `https://logo.clearbit.com/${domain}`,
      ]
    : []

  if (domain && imgError < sources.length) {
    return (
      <div
        className={`${config.container} flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden bg-white border border-gray-100 ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sources[imgError]}
          alt={name}
          width={config.img}
          height={config.img}
          className="object-contain"
          onError={() => setImgError((prev) => prev + 1)}
        />
      </div>
    )
  }

  return (
    <div
      className={`${config.container} flex items-center justify-center flex-shrink-0 shadow-sm font-bold ${config.text} ${className}`}
      style={{ backgroundColor: color + '18', color }}
    >
      {visual?.icon || name.charAt(0)}
    </div>
  )
}
