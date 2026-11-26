# The Blue Holiday Wave

Holiday-season app in the clean style of The Blue Wave.
**Launch:** 10 December 2026  
**Live path:** https://www.thebluewavefans.com/holidayseason/

## Topics
- Fashion & Lifestyle
- Real Estate
- Culinaire (Taste)

## Tabs
Home · Fashion · Homes · Taste · Magazine · More

## Local
```bash
npm install
npm run dev
```
Open http://localhost:5195/holidayseason/

## Deploy (Bluehost)
```bash
npm run build:upload
```
Upload `holidayseason-upload.zip` to `public_html/holidayseason/`, extract, Ctrl+F5.

The zip contains the Vite build plus `api/` (from `server/api/`). Claims, reviews, and
owner data are stored in `storage/community/` on the server (outside `public_html`), not
under a web URL.

Copy `server/api/config.sample.php` to `config.php` on the host and set `ADMIN_KEY`.
