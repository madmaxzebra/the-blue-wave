# Deploy Blue Wave to zebra-onlinedesign.com

**Important:** Hosting2Go shared hosting may not support Node.js. If you only have FTP and PHP, you'll need a VPS or Node.js–capable hosting. Check your control panel for "Node.js" or "Application" options.

---

## Step 1: Build locally

On your computer:

```powershell
cd g:\projects-2026\wk-magazine\bluewave
npm run build
```

This creates `frontend/dist` and `backend/dist`.

---

## Step 2: Upload via FTP

**FTP details** (use your own – never share these in code):

- **Host:** server75.hosting2go.nl
- **User:** (your FTP username)
- **Password:** (your FTP password)

**What to upload:**

1. Create folder `bluewave` on the server
2. Upload these files/folders:
   - `frontend/dist/` → whole folder
   - `backend/dist/` → whole folder
   - `backend/assets/` → whole folder (email-banner.png voor e-mail)
   - `backend/package.json`
   - `backend/package-lock.json` (or omit and run `npm install` on server)
   - `backend/.env` (create with your RESEND_API_KEY, ADMIN_EMAIL)
   - `backend/*.db` (SQLite files if present)

---

## Step 3: If your host supports Node.js

Via SSH (if available):

```bash
cd bluewave/backend
npm install --omit=dev
PORT=4001 node dist/server.js
```

Use PM2 to keep it running:

```bash
npm install -g pm2
pm2 start dist/server.js --name bluewave -- --PORT 4001
pm2 save && pm2 startup
```

---

## Step 4: If your host does NOT support Node.js

You’ll need hosting that supports Node.js, for example:

- **Railway.app** – free tier, Node.js
- **Render.com** – free tier, Node.js  
- **Fly.io** – free tier
- **VPS** (DigitalOcean, Contabo, etc.) – full control

I can prepare a Railway or Render deployment guide if you want to use one of these.

---

## Subdomain

If Node.js is available, you can use:

- **bluewave.zebra-onlinedesign.com**
- **thebluewave.zebra-onlinedesign.com**

Add an A record in DNS pointing to your server IP, then configure nginx or the control panel to proxy to port 4001.
