@echo off
title Update EmailJS welcome template
color 0B
echo.
echo  The old welcome email is in EmailJS online — not on Bluehost.
echo  Open the instructions and EmailJS in your browser.
echo.
start https://www.emailjs.com
notepad "%~dp0UPDATE-EMAILJS-WELCOME.txt"
echo.
pause
