# Manus 24/7 bijwerken met jouw laatste versie

**Je 24/7 link:** https://bluewave-ygrtexhd.manus.space/  
Deze werkt altijd, ook als je PC uit staat. Manus host de app op hun servers.

---

## Voor Cursor-beginners: wat Cursor al deed

- Git is geïnstalleerd en geconfigureerd
- Code is gecommit (lokaal opgeslagen)
- Nu nog: naar GitHub pushen (jij doet dit met één dubbelklik)

---

## Stap 1: Code naar GitHub pushen

1. **Maak eerst op GitHub een repo aan** (eenmalig):
   - Ga naar https://github.com/new
   - Repository name: **bluewave**
   - Kies **Private**
   - Klik **Create repository**

2. **Dubbelklik** op **`DOE-DIT-VOOR-24-7.bat`** (in de bluewave-map)
   - Of in wk-2026-app: **`BLUE-WAVE-PUSH-NAAR-GITHUB.bat`**
3. Druk op een toets als het script daarom vraagt
4. Als een venster opent om in te loggen: log in met je **GitHub-account**
5. Wacht tot "GELUKT!" verschijnt

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
