@echo off
title Blue Wave — Check mail is working
color 0B
cd /d "%~dp0"

echo.
echo  Checking Render mail status...
echo.

powershell -NoProfile -Command ^
  "$s = Invoke-RestMethod 'https://the-blue-wave.onrender.com/api/mail-status'; ^
   Write-Host ''; ^
   if ($s.mailConfigured) { ^
     Write-Host '  MAIL: WORKING' -ForegroundColor Green; ^
     Write-Host ('  Method: ' + $s.method); ^
   } else { ^
     Write-Host '  MAIL: NOT CONFIGURED' -ForegroundColor Red; ^
     Write-Host '  Run SETUP-RENDER-MAIL-NOW.bat and add env vars on Render.'; ^
   }; ^
   Write-Host ''"

echo.
echo  When mail shows WORKING, test signup on thebluewavefans.com
echo  with a NEW email address (check inbox + spam).
echo.
start https://the-blue-wave.onrender.com/api/mail-check
pause
