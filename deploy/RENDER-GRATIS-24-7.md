# Blue Wave gratis 24/7 – Render.com

Render.com heeft een **gratis tier**. Je Blue Wave draait dan 24/7, ook als je computer uit staat. Je krijgt een link zoals: `bluewave-xxxx.onrender.com`.

---

## Wat je nodig hebt

1. Een **GitHub-account** (gratis)
2. Een **Resend-account** (gratis) – voor de e-mails
3. Ongeveer **15 minuten**

---

## Blijft de huidige actief?

**Ja.** Alles blijft werken:
- **Manus** (bluewave-ygrtexhd.manus.space) – blijft actief, draait op hun servers
- **Je tunnel** (lokaal) – blijft werken zolang je computer aan staat
- **Render** – wordt een nieuwe link erbij; allemaal kunnen naast elkaar bestaan

---

## Stap 1: Blue Wave op GitHub zetten

### 1a. Repository maken op GitHub

1. Ga naar [github.com](https://github.com) en log in
2. Klik rechtsboven op het **+** icoon → **New repository**
3. **Repository name:** `bluewave`
4. Kies **Private**
5. Laat "Add a README" uitstaan
6. Klik **Create repository**

### 1b. Code pushen vanuit Cursor / PowerShell

7. Open **Terminal** in Cursor (onderaan), of open **PowerShell**
8. Ga naar de bluewave-map:
   ```
   cd g:\projects-2026\wk-magazine\bluewave
   ```
9. Voer deze commando’s één voor één uit (vervang `JOUW-GITHUB-USERNAME` door je echte GitHub-gebruikersnaam):

   ```
   git init
   ```
   ```
   git add .
   ```
   ```
   git commit -m "Blue Wave landing page"
   ```
   ```
   git branch -M main
   ```
   ```
   git remote add origin https://github.com/JOUW-GITHUB-USERNAME/bluewave.git
   ```
   ```
   git push -u origin main
   ```

10. Bij `git push` wordt mogelijk om je inloggegevens gevraagd. Log in met je GitHub-account.

Er staat al een `.gitignore` in de bluewave-map – `backend/.env` wordt niet meegestuurd (geen wachtwoorden op GitHub).

---

## Stap 2: Render.com

1. Ga naar [render.com](https://render.com) en maak een gratis account
2. Klik **New** → **Web Service**
3. Verbind je GitHub-account als dat nog niet is gedaan
4. Selecteer de repo **bluewave**
5. Vul in:
   - **Name:** bluewave
   - **Region:** Frankfurt (of dichtstbij)
   - **Branch:** main
   - **Runtime:** Docker
   - **Instance Type:** Free

6. Onder **Environment Variables** voeg toe:
   - `RESEND_API_KEY` = je API key van Resend
   - `SITE_URL` = `https://bluewave-xxxx.onrender.com` (vul later in met je echte Render-URL)
   - `ADMIN_EMAIL` = madmax.zebra@gmail.com

7. Klik **Create Web Service**
8. Wacht 5–10 minuten tot de build klaar is
9. Je krijgt een URL zoals `https://bluewave-xxxx.onrender.com`
10. Ga terug naar Environment en pas `SITE_URL` aan naar die URL

---

## Stap 3: Resend

1. [resend.com](https://resend.com) → Account → API Keys
2. Maak een key en kopieer die
3. Vul die in bij Render onder Environment Variables

---

## Klaar

Je link: **https://bluewave-xxxx.onrender.com**

Deze werkt 24/7. Deel hem met bezoekers. Op de gratis tier kan de site na 15 min inactiviteit even slapen; het eerste bezoek start hem dan weer op (duurt ~30 sec).

---

## Eigen domein later

Als Hosting2Go klaar is, kun je overschakelen. Of op Render een custom domein toevoegen (bijv. zebra-onlinedesign.com) – dat kan in de gratis tier.
