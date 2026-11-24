import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { FashionPage } from './pages/FashionPage'
import { FashionStorePage } from './pages/FashionStorePage'
import { HomesPage } from './pages/HomesPage'
import { HomesPartnerPage } from './pages/HomesPartnerPage'
import { TastePage } from './pages/TastePage'
import { TastePartnerPage } from './pages/TastePartnerPage'
import { MagazinePage } from './pages/MagazinePage'
import { MagazinePartnerPage } from './pages/MagazinePartnerPage'
import { MorePage } from './pages/MorePage'
import { MorePartnerPage } from './pages/MorePartnerPage'
import { PrivacyPage } from './pages/PrivacyPage'
import './holiday.css'
import './holiday-glass.css'

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('is-landing-home')

    // Inject media base path as CSS custom properties so CSS url() values
    // work at both /holidayseason/ (Bluehost) and / (Cursor hosting)
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const root = document.documentElement
    root.style.setProperty('--media-snow', `url("${base}/holiday-media/topic-snow.png")`)
    root.style.setProperty('--media-get-app-snow', `url("${base}/holiday-media/get-app-snow.png")`)
    root.style.setProperty('--media-xmas-bg', `url("${base}/holiday-media/blue-christmas-bg.png")`)

    return () => document.documentElement.classList.remove('is-landing-home')
  }, [])

  return (
    <>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="fashion" element={<FashionPage />} />
          <Route path="fashion/:storeId" element={<FashionStorePage />} />
          <Route path="homes" element={<HomesPage />} />
          <Route path="homes/:partnerId" element={<HomesPartnerPage />} />
          <Route path="taste" element={<TastePage />} />
          <Route path="taste/:partnerId" element={<TastePartnerPage />} />
          <Route path="magazine" element={<MagazinePage />} />
          <Route path="magazine/:partnerId" element={<MagazinePartnerPage />} />
        <Route path="more" element={<MorePage />} />
        <Route path="more/:partnerId" element={<MorePartnerPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}
