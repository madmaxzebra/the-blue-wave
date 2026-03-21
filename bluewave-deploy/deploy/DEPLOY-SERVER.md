# Deploy The Blue Wave to your server

Yes, The Blue Wave landing page can run on your server. Options:

---

## Option A: Same server as WK Magazine (different subdomain)

If zebra-onlinedesign.com is your main domain, you could use:
- **bluewave.zebra-onlinedesign.com** or
- **thebluewave.zebra-onlinedesign.com**

### 1. Build locally

```bash
cd g:\projects-2026\wk-magazine\bluewave
npm run build
cd backend && npm run build
```

### 2. Upload to server

Copy these to your server:

- `frontend/dist/` (entire folder)
- `backend/dist/` (entire folder)
- `backend/package.json`
- `backend/package-lock.json` (or run `npm install` on server)
- `backend/.env` (create with RESEND_API_KEY, ADMIN_EMAIL, etc.)
- `backend/*.db` (SQLite database files, if any)

### 3. On the server

```bash
cd bluewave/backend
npm install --omit=dev
PORT=4001 node dist/server.js
```

Use **PM2** or **systemd** to keep it running. Example with PM2:
```bash
pm2 start dist/server.js --name bluewave -- -PORT 4001
pm2 save && pm2 startup
```

### 4. nginx config (new subdomain)

Create `/etc/nginx/sites-available/bluewave`:

```nginx
server {
    listen 80;
    server_name bluewave.zebra-onlinedesign.com;   # or your chosen subdomain

    location / {
        proxy_pass http://127.0.0.1:4001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:
```bash
sudo ln -s /etc/nginx/sites-available/bluewave /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d bluewave.zebra-onlinedesign.com
```

### 5. DNS

Add an **A record** for your subdomain → your server IP.

---

## Option B: Docker (like WK Magazine)

```bash
cd g:\projects-2026\wk-magazine\bluewave
# Create backend/.env with RESEND_API_KEY, ADMIN_EMAIL, etc.
docker compose up -d --build
```

The app runs on port 4001. Point nginx to it (see Option A step 4).

---

## Option C: Separate domain

If you have a different domain (e.g. thebluewave.com), follow the same steps but use that domain in nginx and DNS.

---

## Environment variables (.env)

On the server, create `backend/.env` with:

- `PORT=4001` (or whatever port you use)
- `RESEND_API_KEY` – for sending emails (or SMTP settings)
- `ADMIN_EMAIL` – for admin notifications
- `MAGAZINE_URL` – URL of WK Magazine if you want to link to it
