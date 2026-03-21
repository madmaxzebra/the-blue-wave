# The Blue Wave – Project Status

## ✅ What Works

### Design & Frontend
- **Landing page** – English, ocean-inspired theme (#0066CC, #FF6B35)
- **Hero section** – Wave background, large centered logo, tagline in two lines, countdown to 15 May 2026
- **Sections** – About (Our Vision), Why The Blue Wave?, Stay Updated, Footer
- **Logo** – Your transparent logo in nav, hero (large, centered), and footer
- **CTAs** – Get Notified and Learn More buttons
- **Responsive layout** – Works on mobile
- **Smooth scroll** – When clicking nav links

### Backend & Data
- **Database** – Subscribers saved to SQLite (`backend/subscribers.db`)
- **API** – `/api/subscribe` accepts email, stores it, returns success
- **SMTP config** – `.env` loads correctly, shows "SMTP configured: yes"
- **Duplicate emails** – No error shown; form always shows success message
- **Test endpoint** – `/api/test-email` for debugging SMTP

### Email (Partial)
- **Welcome email template** – HTML with The Blue Wave banner image
- **Email text** – English thank-you message
- **Form feedback** – Shows "Thanks! Check your inbox for the confirmation."

---

## ❌ What Still Needs Fixing

### 1. Welcome Emails – Use Resend (Recommended)
**Problem:** SMTP (Hosting2GO) fails with `ETIMEDOUT` or auth errors – many ISPs/firewalls block ports 465/587.

**Solution – Resend (HTTP API, no blocked ports):**
1. Sign up at [resend.com](https://resend.com)
2. Create an API key in the dashboard
3. Add to `backend/.env`: `RESEND_API_KEY=re_xxxx`
4. For quick testing, leave `RESEND_FROM` unset – it will use `onboarding@resend.dev`
5. Restart backend – you should see `[Blue Wave] Mail: Resend (HTTP API)`
6. Test: `Invoke-RestMethod -Uri "http://localhost:4001/api/test-email" -Method POST -ContentType "application/json" -Body '{"email":"your@email.com"}'`

For production, verify your domain at resend.com/domains and set `RESEND_FROM="The Blue Wave" <hello@yourdomain.com>`.

### 2. Magazine Link (Optional)
- Magazine link was removed from the site per your request
- When the magazine is ready, add it back to nav, hero, and footer if needed

### 3. Social Links (Optional)
- Instagram, Twitter, Facebook in the footer point to `#`
- Replace with real URLs when you have them

### 4. SITE_URL for Production
- In `.env`, `SITE_URL` is localhost – works for dev
- When deployed, set `SITE_URL=https://your-bluewave-domain.com` so the email banner image loads correctly

---

## How to Run

1. **Backend:** `cd g:\projects-2026\wk-magazine\bluewave\backend` → `npm run dev`
2. **Frontend:** `cd g:\projects-2026\wk-magazine\bluewave\frontend` → `npm run dev`
3. **Open:** http://localhost:5174 (or the port Vite shows)

---

*Last updated: March 2026*
