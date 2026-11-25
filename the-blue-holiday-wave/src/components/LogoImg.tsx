import { useState } from 'react'

type Props = {
  src: string
  alt: string
  label: string
  color: string
  className?: string
}

export function LogoImg({ src, alt, label, color, className }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <span
        className={`logo-badge${className ? ` ${className}` : ''}`}
        style={{
          background: color,
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          minWidth: '48px',
          minHeight: '32px',
        }}
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
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
