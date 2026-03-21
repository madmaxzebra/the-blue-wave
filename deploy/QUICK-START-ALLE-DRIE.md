# Quick start – alle drie de taken

## 1. Brief naar Hosting2Go

1. Ga naar `bluewave\deploy\`
2. Dubbelklik **`SEND-BRIEF-TO-HOSTING2GO.bat`**
3. De brief wordt gekopieerd, de PDF opent, en het Hosting2Go helpdesk opent
4. Plak de brief, voeg de PDF als bijlage toe, vul je naam/e-mail in, verstuur

---

## 2. Render.com (24/7 zonder computer)

1. **Git** – als je Git nog niet hebt: https://git-scm.com/download/win
2. **GitHub repo** – ga naar https://github.com/new, maak repo `bluewave` (Private)
3. **Push** – dubbelklik `bluewave\GITHUB-PUSH.bat`, volg de stappen
4. **Render** – ga naar https://render.com, New → Web Service, koppel `bluewave` repo
5. **Instellingen:** Runtime: Docker, Plan: Free
6. **Environment variables:** `RESEND_API_KEY`, `SITE_URL` (na deploy), `ADMIN_EMAIL`
7. Create Web Service – wacht 5–10 min, je krijgt een 24/7 URL

Zie `DOE-DIT-VOOR-RENDER.md` voor details.

---

## 3. Live op zebra-onlinedesign.com (Hosting2Go)

**Als Hosting2Go Node.js of Docker ondersteunt:**

1. Build: `cd bluewave` → `npm run build`
2. Deploy-pakket: dubbelklik `deploy\MAKE-DEPLOY-PAKKET.bat`
3. Upload `deploy\bluewave-deploy\` via FTP naar je server
4. Zet `backend/.env` op de server (RESEND_API_KEY, SITE_URL, ADMIN_EMAIL)
5. Start: `cd backend && npm install --omit=dev && node dist/server.js` (of PM2)

**Of wacht op Hosting2Go-antwoord** – de brief vraagt of ze Node.js/Docker ondersteunen.

Zie `LIVE-PRODUCTIE.md` en `UPLOAD-BLUEWAVE.md` voor details.
