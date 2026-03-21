@echo off
cd /d "%~dp0"
title Blue Wave - 24/7 klaar maken
color 0A
echo.
echo  =======================================================
echo   BLUE WAVE - Code naar GitHub (voor 24/7)
echo  =======================================================
echo.
echo  Stap 1 van 2: Code is al gecommit.
echo.
echo  Stap 2: Push naar GitHub.
echo  - Als om inloggen wordt gevraagd: log in met GitHub
echo  - Maak eerst op github.com een repo "bluewave" (Private)
echo    als die nog niet bestaat.
echo.
pause
echo.
git branch -M main 2>nul
git remote add origin https://github.com/madmax/bluewave.git 2>nul
git remote set-url origin https://github.com/madmax/bluewave.git 2>nul
echo  Pussen naar GitHub...
git push -u origin main
echo.
if errorlevel 1 (
  echo  Push mislukt. Controleer:
  echo  - Bestaat github.com/madmax/bluewave ?
  echo  - Is je GitHub-username "madmax"? Zo niet, pas dit
  echo    bestand aan (regel met git remote).
  echo  - Heb je ingelogd met GitHub?
) else (
  echo  =======================================================
  echo   GELUKT! Code staat op GitHub.
  echo  =======================================================
  echo.
  echo  Volgende: Manus of Render bijwerken.
  echo  - Manus: log in op Manus dashboard, Sync/Pull van GitHub
  echo  - Render: render.com, New Web Service, kies bluewave repo
  echo.
  echo  Zie deploy\MANUS-24-7-UPDATE.md voor details.
)
echo.
pause
