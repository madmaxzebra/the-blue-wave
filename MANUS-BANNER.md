# Banner in thank you e-mail (Manus)

Om de Blue Wave banner in de thank you e-mail te tonen, moet de **Manus deployment** (bluewave-ygrtexhd.manus.space) onze code gebruiken.

## Wat Manus nodig heeft

1. **`backend/assets/email-banner.png`** – de bannerafbeelding
2. **`frontend/public/email-banner.png`** –zelfde afbeelding, zodat deze via de site bereikbaar is op `/email-banner.png`
3. **`mail.ts`** – onze versie met bannerlogica (inline of externe URL)
4. **`server.ts`** – die `origin` doorgeeft aan `sendWelcomeEmail`

## Manus bijwerken via GitHub

Als Manus aan een GitHub-repo gekoppeld is:

1. Commit en push deze bluewave-wijzigingen naar de repo
2. In Manus: **Settings** → **GitHub** → sync/pull om de nieuwste code binnen te halen
3. Redeploy indien nodig

## SITE_URL op Manus

Stel in Manus de env-variabele `SITE_URL=https://bluewave-ygrtexhd.manus.space` in. Dan weet de e-mail welke URL te gebruiken voor de banner.

## Testen

Na de update: schrijf je in via de site. De thank you mail zou de banner bovenaan moeten tonen.
