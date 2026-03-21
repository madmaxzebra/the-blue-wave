@echo off
cd /d "%~dp0"
title Blue Wave - 24/7 Deploy
echo.
echo  =======================================================
echo   BLUE WAVE - Live 24/7 (ook als PC uitstaat)
echo  =======================================================
echo.
echo  Een tunnel werkt alleen als je PC aan staat.
echo  Voor 24/7: deploy naar Render.com (gratis).
echo.
echo  Je hebt al een 24/7 link: https://bluewave-ygrtexhd.manus.space
echo.
echo  Om je NIEUWSTE code daar te krijgen:
echo  1. GITHUB-PUSH.bat - code naar GitHub
echo  2. Manus dashboard - Sync/Redeploy (zie deploy\MANUS-24-7-UPDATE.md)
echo.
echo  Of kies Render voor een NIEUWE link:
echo  - Volg deploy\DOE-DIT-VOOR-RENDER.md
echo.
echo  Druk op een toets om de instructies te openen...
pause >nul
start "" "%~dp0deploy\MANUS-24-7-UPDATE.md"
echo.
echo  Instructies geopend. Succes!
pause
