import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

if ('serviceWorker' in navigator && import.meta.env.BASE_URL === '/holidayseason/') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={base === '' || base === '.' ? undefined : base}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
