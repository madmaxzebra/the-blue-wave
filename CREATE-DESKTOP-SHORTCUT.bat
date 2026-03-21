@echo off
cd /d "%~dp0"
echo Creating Blue Wave desktop shortcut...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0CREATE-DESKTOP-SHORTCUT.ps1"
if errorlevel 1 (
  echo PowerShell failed, copying START.bat instead...
  copy "%~dp0START.bat" "%USERPROFILE%\Desktop\Blue Wave.bat"
  echo Done. "Blue Wave.bat" is on your Desktop.
) else (
  echo.
)
pause
