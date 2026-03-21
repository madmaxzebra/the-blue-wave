# The Blue Wave – Promo landing page

Promotionele landingspagina die doorlinkt naar het WK Magazine.

## Features
- Countdown tot 15 mei 2026
- E-mail inschrijving met SMTP welcome mail
- Ocean-inspired design (Playfair Display, #0066CC, #FF6B35)
- Responsive layout
- Link naar WK Magazine

## Starten

1. **Backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your SMTP_PASS (required for thank-you emails)
   npm install
   npm run dev
   ```

2. **Frontend** (nieuwe terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open http://localhost:5174

## Assets
- **wave-bg.jpg** – ✅ Aanwezig in `frontend/public/` (ocean wave hero-achtergrond)
- **logo.png** – Zet je logo in `frontend/public/logo.png`; verschijnt dan in nav, hero en footer. Anders: tekst "The Blue Wave"

## Magazine URL
Zet in `backend/.env`: `MAGAZINE_URL=https://jouw-magazine-url.com`
