@echo off
cd /d "%~dp0"
echo.
echo  FIX WELCOME EMAIL SPAM — push backend to Render
echo  ================================================
echo.
echo  This updates the mail server so signup welcome emails
echo  use Gmail instead of EmailJS (which lands in spam).
echo.
pause

git add backend/src/mail.ts backend/src/server.ts backend/dist/mail.js backend/dist/server.js
git status -sb
echo.
echo  Committing...
git commit -m "Fix welcome email spam: Gmail SMTP via /api/welcome instead of EmailJS"
if errorlevel 1 (
  echo  Nothing to commit or commit failed.
  goto push
)

:push
echo.
echo  Pushing to GitHub (Render will redeploy automatically)...
git push origin main
if errorlevel 1 (
  echo.
  echo  Push failed — run PUSH-NU.bat and paste your GitHub token.
  pause
  exit /b 1
)

echo.
echo  DONE. Render will rebuild in ~5 minutes.
echo  URL: https://the-blue-wave.onrender.com/api/health
echo.
echo  Also upload the landing page zip — see wk-2026-app folder:
echo    BUILD-LANDING-UPLOAD.bat  then upload index.html to thebluewavefans.com
echo.
pause
