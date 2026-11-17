import type { ReactNode } from 'react'
import type { IconName } from '../types'

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    activity: (
      <>
        <path d="M4 12h3l2.2-6 4.2 12 2.1-6H20" />
        <path d="M5 5.5a9 9 0 1 1-1 11" opacity=".35" />
      </>
    ),
    bike: (
      <>
        <circle cx="5.5" cy="16.5" r="3.5" />
        <circle cx="18.5" cy="16.5" r="3.5" />
        <path d="m5.5 16.5 4-7h4l5 7M9.5 9.5l4 7h-8M8 6h3M15 7h2" />
      </>
    ),
    calculator: (
      <>
        <rect x="4" y="2.5" width="16" height="19" rx="2.5" />
        <path d="M8 6.5h8v3H8zM8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    distance: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h5a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h5" />
      </>
    ),
    flame: (
      <path d="M13.5 3.2c.6 3.1-.8 4.4-2 5.4-1.2-1-1.7-2.1-1.4-3.7C7.4 6.7 5 9.5 5 13a7 7 0 0 0 14 0c0-3.8-2.2-7.3-5.5-9.8ZM12 20a3.5 3.5 0 0 1-3.5-3.5c0-1.6.9-3 2.3-4 .1 1 .6 1.8 1.3 2.4 1-.8 1.6-1.8 1.6-3.3a5.7 5.7 0 0 1 1.8 4.1A3.5 3.5 0 0 1 12 20Z" />
    ),
    heart: (
      <path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 22l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
      </>
    ),
    logout: (
      <>
        <path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5M14 8l4 4-4 4M18 12H8" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    rfid: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M7 9h4M7 12h2M15 9.5a3.5 3.5 0 0 1 0 5M17.5 7.5a6.3 6.3 0 0 1 0 9" />
      </>
    ),
    score: (
      <>
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      </>
    ),
    time: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    weight: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="3" />
        <path d="M8 9a4 4 0 0 1 8 0M12 9l2-2" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        {paths[name]}
      </g>
    </svg>
  )
}

export function IconButton({
  label,
  icon,
  onClick,
  className = '',
}: {
  label: string
  icon: IconName
  onClick: () => void
  className?: string
}) {
  return (
    <button aria-label={label} className={`icon-button ${className}`} onClick={onClick} type="button">
      <Icon name={icon} size={22} />
    </button>
  )
}