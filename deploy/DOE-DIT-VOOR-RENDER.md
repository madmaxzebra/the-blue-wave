# Doe dit – Blue Wave op Render (24/7, computer uit)

**Je username:** madmax

---

## Stap 1: Git installeren (eenmalig)

1. Ga naar **https://git-scm.com/download/win**
2. Klik op de groene downloadknop
3. Installeer (alle standaardinstellingen zijn goed)
4. Klik overal op Next/Finish
5. **Herstart Cursor** daarna

---

## Stap 2: Repository op GitHub aanmaken

1. Ga naar **https://github.com** en log in (als madmax)
2. Klik rechtsboven op het **+** icoon → **New repository**
3. **Repository name:** `bluewave`
4. Kies **Private**
5. Klik **Create repository**
6. Je ziet een lege repo – dat is goed, ga naar stap 3

---

## Stap 3: Code naar GitHub pushen

1. Open de map `g:\projects-2026\wk-magazine\bluewave` in Verkenner
2. Dubbelklik op **`GITHUB-PUSH.bat`**
3. Lees het scherm, druk op een toets om door te gaan
4. Wacht tot het klaar is
5. Als je om je GitHub-wachtwoord wordt gevraagd: gebruik je **normale wachtwoord** of een **Personal Access Token** (GitHub legt dat uit als het nodig is)

---

## Stap 4: Render.com

1. Ga naar **https://render.com** en maak een gratis account (kan met GitHub)
2. Klik **New** → **Web Service**
3. Koppel GitHub als dat nog niet is gedaan
4. Kies de repo **bluewave**
5. Vul in:
   - **Name:** bluewave
   - **Runtime:** Docker
   - **Instance Type:** Free
6. Onder **Environment Variables**:
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USER` = `madmax.zebra@gmail.com`
   - `SMTP_PASS` = (Gmail App Password – zie myaccount.google.com/apppasswords)
   - `ADMIN_EMAIL` = madmax.zebra@gmail.com
   - `SITE_URL` = `https://bluewave.onrender.com` (pas aan naar jouw Render-URL)
7. Klik **Create Web Service**
8. Wacht 5–10 minuten
9. Je krijgt een link – die werkt 24/7

---

## Mail: Gmail of Resend

**Gmail (aanbevolen – werkt al lokaal):** gebruik SMTP_* hierboven met een App Password van myaccount.google.com/apppasswords

**Resend (alternatief):** voeg `RESEND_API_KEY` toe als je Resend wilt gebruiken i.p.v. Gmail.

---

**Als iets niet lukt:** typ `resume` in een nieuwe chat en vraag om hulp.
