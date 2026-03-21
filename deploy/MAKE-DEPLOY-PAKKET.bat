@echo off
chcp 65001 >nul
cd /d "%~dp0\.."

echo.
echo === Blue Wave – Deploy-pakket maken ===
echo.

echo Stap 1: Build...
call npm run build
if errorlevel 1 (
  echo Build mislukt.
  pause
  exit /b 1
)

echo.
echo Stap 2: Pakket samenstellen...
set OUT=deploy\bluewave-deploy
if exist "%OUT%" rmdir /s /q "%OUT%"
mkdir "%OUT%"

xcopy /E /I /Y frontend\dist "%OUT%\frontend\dist" >nul
xcopy /E /I /Y backend\dist "%OUT%\backend\dist" >nul
xcopy /E /I /Y backend\assets "%OUT%\backend\assets" >nul
copy backend\package.json "%OUT%\backend\" >nul
copy backend\package-lock.json "%OUT%\backend\" >nul
copy Dockerfile "%OUT%\" >nul
copy docker-compose.yml "%OUT%\" >nul
copy share-server.js "%OUT%\" >nul
copy deploy\BRIEF-AAN-HOSTING2GO.pdf "%OUT%\" >nul
copy deploy\UPLOAD-BLUEWAVE.md "%OUT%\INSTRUCTIES.md" >nul

echo.
echo Stap 3: .env voorbeeld...
(
echo # Vul deze waarden in op de server
echo RESEND_API_KEY=re_xxxx
echo SITE_URL=https://zebra-onlinedesign.com
echo ADMIN_EMAIL=madmax.zebra@gmail.com
) > "%OUT%\.env.example"

echo.
echo Klaar! Deploy-pakket staat in: %OUT%
echo.
echo Voor Hosting2Go: upload de inhoud van %OUT% of stuur het zip-bestand mee.
echo.
pause
