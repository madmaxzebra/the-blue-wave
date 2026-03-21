# Brief aan Hosting2Go – Blue Wave op zebra-onlinedesign.com

**Onderwerp:** Vraag om ondersteuning bij het live zetten van een Node.js webapplicatie

---

Beste Hosting2Go,

Ik heb een webapplicatie genaamd **“The Blue Wave”** – een landingpagina voor het FIFA World Cup 2026-initiatief op Curaçao. De applicatie is voor het domein **zebra-onlinedesign.com**.

Omdat ik niet veel ervaring heb met servers en hosting, vraag ik jullie hulp om deze applicatie werkend te maken op mijn hosting bij Hosting2Go.

---

## Wat ik wil bereiken

- De Blue Wave-landingpagina live op **zebra-onlinedesign.com**
- Bezoekers kunnen zich inschrijven via een formulier
- Na inschrijving krijgen ze automatisch een bedankmail (met afbeelding)
- Ik ontvang een melding bij elke nieuwe inschrijving

---

## Wat er technisch nodig is

De Blue Wave is een **Node.js** applicatie. Hij heeft het volgende nodig:

1. **Node.js versie 20 of hoger** op de server  
   - Of **Docker** om de applicatie in een container te draaien

2. **Een poort** waar de applicatie op kan luisteren (bijv. poort 4000)

3. **DNS / domein** zodat zebra-onlinedesign.com naar deze applicatie wijst

---

## Wat ik aanlever

Ik heb een **deploy-pakket** klaar met:

- De gebouwde frontend (HTML, CSS, JavaScript)
- De backend (Node.js API)
- De e-mailbanner
- Een `Dockerfile` en `docker-compose.yml` (als Docker beschikbaar is)
- Instructies voor de omgevingsvariabelen

Ik kan dit pakket via FTP uploaden of op een andere manier aanleveren als jullie dat prefereren.

---

## Wat ik van Hosting2Go vraag

1. **Bevestiging**  
   Ondersteunt mijn huidige hosting (server75.hosting2go.nl) Node.js of Docker?  
   - Zo niet: kunnen jullie mij helpen om over te stappen naar een pakket dat dat wel ondersteunt (bijv. VPS)?

2. **Als Node.js of Docker wél mogelijk is:**  
   - Waar kan ik de applicatie het beste plaatsen (welke map, welk pad)?  
   - Welke stappen moet ik uitvoeren om de applicatie te starten en draaiende te houden?  
   - Moet er nginx, Apache of een andere webserver worden geconfigureerd om zebra-onlinedesign.com naar deze app te laten wijzen?

3. **SSL/HTTPS**  
   Kunnen jullie HTTPS (SSL-certificaat) voor zebra-onlinedesign.com instellen of uitleggen hoe ik dat doe?

---

## Technische details (voor jullie support)

- **Runtime:** Node.js 20+ of Docker
- **Poort:** 4000
- **Domein:** zebra-onlinedesign.com (eventueel met www)
- **E-mail:** Ik heb **twee opties**:
  1. **Voorkeur:** Gebruik van **jullie mailserver (SMTP)** – kan ik SMTP-gegevens krijgen voor een adres zoals hello@zebra-onlinedesign.com? Dan sturen we de bedankmails via jullie server.
  2. **Alternatief:** Via de externe Resend API (resend.com) over HTTPS – geen mailconfiguratie op de server. Is uitgaand HTTPS-verkeer naar resend.com dan toegestaan?

---

## Omgevingsvariabelen

De applicatie heeft een bestand `backend/.env` nodig met o.a.:

- **Bij gebruik van jullie SMTP:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- **Of bij Resend:** `RESEND_API_KEY`
- `SITE_URL` – de live URL (bijv. https://zebra-onlinedesign.com)  
- `ADMIN_EMAIL` – e-mailadres voor meldingen bij nieuwe inschrijvingen  

Ik vul deze waarden zelf in. Alleen de technische installatie op de server heb ik hulp bij nodig.

---

Graag hoor ik van jullie wat de mogelijkheden zijn en welke stappen ik moet nemen.

Met vriendelijke groet,

[Uw naam]  
[Uw klantnummer / e-mail]
