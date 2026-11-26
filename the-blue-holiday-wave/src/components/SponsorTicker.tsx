import { useLayoutEffect, useRef } from 'react'

import { SPONSOR_TICKER, type SponsorTickerItem } from '../data/sponsorTicker'
import './SponsorTicker.css'

const base = import.meta.env.BASE_URL

function SponsorChip({ item }: { item: SponsorTickerItem }) {
  const size = item.size ?? 'default'
  const scale = item.scale ?? 1

  return (
    <a
      className={`sponsor-ticker__chip sponsor-ticker__chip--${size}`}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ['--sponsor-scale' as string]: String(scale) }}
      aria-label={item.logoAlt}
    >
      <span className="sponsor-ticker__logo-wrap">
        <img
          className="sponsor-ticker__logo"
          src={`${base}${item.logo}`}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
    </a>
  )
}

export function SponsorTicker() {
  const trackRef = useRef<HTMLDivElement>(null)
  const loop = [...SPONSOR_TICKER, ...SPONSOR_TICKER]

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const setLoop = () => {
      const half = track.scrollWidth / 2
      if (half <= 0) return
      const duration = Math.max(38, half / 42)
      track.style.setProperty('--sponsor-loop', `${half}px`)
      track.style.setProperty('--sponsor-duration', `${duration}s`)
      track.classList.add('sponsor-ticker__track--ready')
    }

    setLoop()
    const imgs = track.querySelectorAll('img')
    let pending = 0
    imgs.forEach((img) => {
      if (!img.complete) {
        pending += 1
        img.addEventListener('load', () => {
          pending -= 1
          if (pending <= 0) setLoop()
        })
      }
    })
    window.addEventListener('resize', setLoop)
    return () => window.removeEventListener('resize', setLoop)
  }, [])

  return (
    <section className="sponsor-ticker" aria-label="Sponsors">
      <p className="sponsor-ticker__label">Sponsors</p>
      <div className="sponsor-ticker__viewport">
        <div className="sponsor-ticker__track" ref={trackRef}>
          {loop.map((item, i) => (
            <SponsorChip key={`${item.logo}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}