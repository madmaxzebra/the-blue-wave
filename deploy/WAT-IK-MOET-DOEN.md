# Wat jij moet doen – overzicht

## 1. Wat we hebben gebouwd (samenvatting)

De Blue Wave is een landingpagina voor FIFA World Cup 2026 (Curaçao). De applicatie bevat:

- **Website** – homepage met inschrijfformulier
- **E-mail** – na inschrijving: bedankmail mét bannerafbeelding, verstuurd via Resend
- **Admin-melding** – jij krijgt een e-mail bij elke nieuwe inschrijving

De applicatie draait lokaal via een tunnel en werkt. Nu moet hij live op jouw server (Hosting2Go).

---

## 2. Jouw stappen vóór je Hosting2Go contacteert

### Stap A: Deploy-pakket maken

1. Open de map `g:\projects-2026\wk-magazine\bluewave`
2. Dubbelklik op **`CREATE-DEPLOY-PACKAGE.bat`**
3. Wacht tot je ziet: "Done. Package is in: bluewave-deploy"
4. Er wordt nu een map **`bluewave-deploy`** aangemaakt

### Stap B: Resend-account (voor e-mail)

1. Ga naar [resend.com](https://resend.com) en maak een (gratis) account
2. Maak een API key aan
3. (Optioneel) Verifieer je domein zebra-onlinedesign.com op resend.com/domains – dan kun je mailen vanaf hello@zebra-onlinedesign.com

### Stap C: Brief naar Hosting2Go

1. Open het bestand **`bluewave/deploy/BRIEF-AAN-HOSTING2GO.md`**
2. Kopieer de inhoud (of gebruik het bestand als bijlage)
3. Voeg jouw naam en klantnummer toe onderaan
4. Stuur het naar Hosting2Go support (e-mail of ticket)

---

## 3. Nadat Hosting2Go heeft geantwoord

Als Hosting2Go bevestigt dat Node.js of Docker mogelijk is:

1. Maak het bestand **`backend/.env`** in de map bluewave-deploy (kopieer van `.env.production.example`)
2. Vul in:
   - `RESEND_API_KEY` = je API key van Resend
   - `RESEND_FROM` = "The Blue Wave <hello@zebra-onlinedesign.com>"
   - `SITE_URL` = https://zebra-onlinedesign.com
   - `ADMIN_EMAIL` = madmax.zebra@gmail.com

3. Upload de map **bluewave-deploy** volgens de instructies van Hosting2Go
4. Volg hun stappen om de app te starten

---

## 4. Bestanden die Hosting2Go nodig heeft

- **BRIEF-AAN-HOSTING2GO.md** – de brief die je naar ze stuurt
- **bluewave-deploy/** – het deploy-pakket (na het runnen van CREATE-DEPLOY-PACKAGE.bat)
