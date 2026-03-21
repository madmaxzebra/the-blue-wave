@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo === Brief naar Hosting2Go voorbereiden ===
echo.

REM Copy brief to clipboard via PowerShell
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$brief = Get-Content -Path 'BRIEF-AAN-HOSTING2GO.md' -Raw -Encoding UTF8; $brief | Set-Clipboard -Encoding UTF8; Write-Host 'Brief gekopieerd naar klembord.'"

echo.
echo De brief is gekopieerd naar je klembord.
echo.
echo Stappen:
echo 1. Het Hosting2Go helpdesk opent nu in je browser
echo 2. Log in (als je al klant bent) op klant.hosting2go.nl
echo 3. Maak een nieuw ticket aan
echo 4. Onderwerp: Vraag om ondersteuning bij het live zetten van een Node.js webapplicatie
echo 5. Plak de brief (Ctrl+V) in het berichtveld
echo 6. Vul [Uw naam] en [Uw klantnummer/e-mail] in
echo 7. Voeg de PDF als bijlage toe: BRIEF-AAN-HOSTING2GO.pdf (in deze map)
echo 8. Verstuur het ticket
echo.
echo De PDF wordt nu geopend zodat je hem kunt bijvoegen.
echo.
pause

start "" "BRIEF-AAN-HOSTING2GO.pdf"
timeout /t 2 /nobreak >nul
start "" "https://klant.hosting2go.nl/helpdesk"
