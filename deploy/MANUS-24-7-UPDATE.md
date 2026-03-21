# Manus 24/7 bijwerken met jouw laatste versie

**Je 24/7 link:** https://bluewave-ygrtexhd.manus.space/  
Deze werkt altijd, ook als je PC uit staat. Manus host de app op hun servers.

---

## Wat je wilt

De nieuwste versie (geen testlinks, Gmail mail) live op Manus.

---

## Stap 1: Code naar GitHub pushen

1. Open de map `g:\projects-2026\wk-magazine\bluewave` in Verkenner
2. Dubbelklik **`GITHUB-PUSH.bat`**
3. Volg de stappen (maak eventueel eerst repo `bluewave` op github.com)
4. Wacht tot de push klaar is

---

## Stap 2: Manus bijwerken

1. Log in op het **Manus-dashboard** (waar bluewave-ygrtexhd.manus.space is aangemaakt)
2. Ga naar **Settings** (of vergelijkbare optie) → **GitHub** / **Deploy**
3. Klik op **Sync** of **Pull** om de nieuwste code op te halen
4. **Redeploy** de service als dat nodig is

---

## Stap 3: Mail op Manus instellen

Manus moet mail kunnen versturen. Stel in het Manus-dashboard Environment Variables in:

- `SMTP_HOST` = `smtp.gmail.com`
- `SMTP_PORT` = `587`
- `SMTP_USER` = `madmax.zebra@gmail.com`
- `SMTP_PASS` = (je Gmail App Password)
- `ADMIN_EMAIL` = `madmax.zebra@gmail.com`
- `SITE_URL` = `https://bluewave-ygrtexhd.manus.space`

(Als Manus Resend ondersteunt: `RESEND_API_KEY` kan ook.)

---

## Geen Manus-dashboard?

Als je geen toegang hebt tot het Manus-dashboard, kies voor **Render.com**:

- Volg `DOE-DIT-VOOR-RENDER.md`
- Je krijgt een nieuwe 24/7-link zoals `https://bluewave-xxxx.onrender.com`

---

## Samenvatting

| Link | Wanneer actief |
|------|----------------|
| https://bluewave-ygrtexhd.manus.space/ | 24/7 (Manus-servers) |
| https://xxx.trycloudflare.com | Alleen als je PC aan staat en Blue Wave draait |

Gebruik de Manus-link als je je PC uitzet. Update Manus via GitHub + dashboard om je laatste wijzigingen live te zetten.
