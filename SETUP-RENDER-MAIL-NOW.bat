@echo off
title Blue Wave — Fix welcome email on Render
color 0B
cd /d "%~dp0"

echo.
echo  FIX WELCOME EMAIL — 5 minutes on Render
echo  ========================================
echo.
echo  Problem: Render has NO mail set up, so welcome emails fail.
echo.
echo  WHAT YOU NEED:
echo  1. A NEW Gmail App Password (old one may have expired)
echo     Open: https://myaccount.google.com/apppasswords
echo     Create password for "Mail" - copy the 16-character code.
echo.
echo  2. Add these in Render dashboard (service: the-blue-wave):
echo.
echo     SMTP_HOST     = smtp.gmail.com
echo     SMTP_PORT     = 587
echo     SMTP_USER     = madmax.zebra@gmail.com
echo     SMTP_PASS     = (paste NEW app password - no spaces)
echo     ADMIN_EMAIL   = madmax.zebra@gmail.com
echo     SITE_URL      = https://www.thebluewavefans.com
echo     RESEND_API_KEY = (optional backup - copy from backend\.env)
echo.
echo  3. Click Save - Render redeploys in ~5 minutes.
echo.
echo  Opening Render dashboard and mail check page...
timeout /t 3 /nobreak >nul
start https://dashboard.render.com
start https://the-blue-wave.onrender.com/api/mail-status
echo.
echo  After Render redeploys, double-click: CHECK-MAIL-WORKS.bat
echo.
pause
