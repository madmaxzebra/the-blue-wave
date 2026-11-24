import { NavLink, Outlet, useLocation } from 'react-router-dom'
import './AppShell.css'

const FASHION_ICON = `${import.meta.env.BASE_URL}holiday-media/icons/fashion-gold.png`

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
  const onFashion = pathname === '/fashion' || pathname.startsWith('/fashion/')

  return (
    <div className="shell shell--landing">
      <header className={`shell__top${onFashion ? ' shell__top--fashion' : ''}`}>
        <p className="shell__eyebrow">Curaçao · Holiday Season 2026</p>
        <h1 className="shell__brand">
          The Blue <span>Holiday</span> Wave
        </h1>
        {onFashion ? (
          <div className="shell__fashion-mark">
            <img src={FASHION_ICON} alt="Fashion" width={128} height={128} />
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
