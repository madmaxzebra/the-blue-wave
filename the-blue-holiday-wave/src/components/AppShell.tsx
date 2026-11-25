import { NavLink, Outlet, useLocation } from 'react-router-dom'
import './AppShell.css'

const base = import.meta.env.BASE_URL

const SECTION_ICONS: Record<string, { src: string; alt: string }> = {
  fashion:  { src: `${base}holiday-media/icons/fashion-gold.png`,     alt: 'Fashion' },
  homes:    { src: `${base}holiday-media/icons/realestate-gold.png`,  alt: 'Real Estate' },
  taste:    { src: `${base}holiday-media/icons/culinary-gold.png`,    alt: 'Taste' },
  magazine: { src: `${base}holiday-media/icons/magazine-gold.png`,    alt: 'Magazine' },
  more:     { src: `${base}holiday-media/icons/sponsors-gold.png`,    alt: 'More' },
}

const tabs = [
  { to: '/', label: 'Home', end: true },
  { to: '/fashion', label: 'Fashion' },
  { to: '/homes', label: 'Homes' },
  { to: '/taste', label: 'Taste' },
  { to: '/magazine', label: 'Magazine' },
  { to: '/more', label: 'More' },
] as const

export function AppShell() {
  const { pathname } = useLocation()
  const section = pathname === '/' ? null : pathname.split('/').filter(Boolean)[0]
  const sectionIcon = section ? SECTION_ICONS[section] : null

  return (
    <div className="shell shell--landing">
      <header className={`shell__top${sectionIcon ? ' shell__top--fashion' : ''}`}>
        <p className="shell__eyebrow">Curaçao · Holiday Season 2026</p>
        <h1 className="shell__brand">
          The Blue <span>Holiday</span> Wave
        </h1>
        {sectionIcon ? (
          <div className="shell__fashion-mark">
            <img src={sectionIcon.src} alt={sectionIcon.alt} width={128} height={128} />
          </div>
        ) : (
          <div className="shell__garland" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        )}
      </header>

      <main className="shell__main">
        <Outlet />
      </main>

      <nav className="shell__tabs" aria-label="Main">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={'end' in tab ? tab.end : false}
            className={({ isActive }) =>
              `shell__tab${isActive ? ' shell__tab--active' : ''}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
