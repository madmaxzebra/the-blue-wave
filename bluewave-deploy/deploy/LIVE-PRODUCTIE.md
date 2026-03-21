# Blue Wave – Live op jouw server (zebra-onlinedesign.com)

## Overzicht

Wanneer Blue Wave live staat op jouw server:

1. **E‑mails** → verstuurd via Resend (zelfde type service als Manus)
2. **Banner** in thank you mail → werkt automatisch als SITE_URL goed staat
3. **Geen Manus** → jouw server doet alles zelf

---

## Stap 1: Resend – domein verifiëren

Om professioneel te mailen vanaf `@zebra-onlinedesign.com`:

1. Ga naar [resend.com/domains](https://resend.com/domains)
2. Voeg domein toe: **zebra-onlinedesign.com**
3. Voeg de DNS-records toe bij je hosting (Resend toont ze)
4. Wacht tot verificatie geslaagd is (meestal binnen 24 uur)

---

## Stap 2: `.env` op de server

Maak of bewerk `backend/.env` op je server:

```env
# Resend – gebruik je API key
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM="The Blue Wave <hello@zebra-onlinedesign.com>"

# Admin krijgt kopie van elke inschrijving
ADMIN_EMAIL=madmax.zebra@gmail.com

# Belangrijk: URL van je live site (voor banner in e-mail)
SITE_URL=https://zebra-onlinedesign.com

# Manus uit – we sturen zelf
# MANUS_API_URL=...
```

**Let op:** `SITE_URL` moet je echte domein zijn (met of zonder www, consistent met wat je gebruikt).

---

## Stap 3: Upload & starten

Volg `UPLOAD-BLUEWAVE.md`:

- Upload `frontend/dist`, `backend/dist`, `backend/package.json`
- Upload `backend/assets/` (bevat `email-banner.png`)
- Zet `backend/.env` op de server met bovenstaande waarden
- Start de backend (bijv. met PM2)

---

## Checklist voor productie

- [ ] Domein zebra-onlinedesign.com geverifieerd in Resend
- [ ] `RESEND_FROM` ingesteld met jouw domein
- [ ] `SITE_URL` ingesteld naar live URL
- [ ] `ADMIN_EMAIL` ingesteld
- [ ] `backend/assets/email-banner.png` meegestuurd bij deploy

---

## Alternatief: Geen Resend domein

Als je domein nog niet geverifieerd is, kun je tijdelijk mailen vanaf `onboarding@resend.dev`.  
Zet dan **géén** `RESEND_FROM`; Resend gebruikt dan het standaard adres.  
Levering werkt, maar de afzender is minder professioneel.
