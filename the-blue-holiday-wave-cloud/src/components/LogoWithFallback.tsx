import { useState } from 'react'
import './LogoWithFallback.css'

interface Props {
  src: string
  alt: string
  label: string
  color: string
  className?: string
  onDark?: boolean
}

/** Renders a logo image; if it fails to load, shows a coloured letter badge instead. */
export function LogoWithFallback({ src, alt, label, color, className, onDark }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className="logo-fallback"
        style={{ background: color }}
        aria-label={alt}
      >
        {label}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className ?? ''}${onDark ? ' fashion-logo--on-dark' : ''}`}
      onError={() => setFailed(true)}
    />
  )
}
