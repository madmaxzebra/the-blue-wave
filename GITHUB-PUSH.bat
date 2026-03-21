@echo off
cd /d "%~dp0"
echo.
echo === Blue Wave naar GitHub pushen ===
echo.
echo Stap 1: Maak EERST op github.com een nieuwe repo aan:
echo   - Ga naar https://github.com/new
echo   - Repository name: bluewave
echo   - Kies Private
echo   - Klik Create repository
echo.
echo Stap 2: Druk op een toets als de repo bestaat...
pause >nul

echo.
echo Git wordt nu uitgevoerd...
echo.

git init 2>nul
git add .
git commit -m "Blue Wave landing page"
git branch -M main
REM Pas 'madmax' aan als je GitHub-username anders is
set GITHUB_USER=madmax
git remote add origin https://github.com/%GITHUB_USER%/bluewave.git 2>nul
if errorlevel 1 git remote set-url origin https://github.com/%GITHUB_USER%/bluewave.git
git push -u origin main

echo.
echo Klaar! Als je om inloggen werd gevraagd, volg de instructies.
echo.
pause
