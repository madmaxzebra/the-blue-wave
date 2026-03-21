@echo off
cd /d "%~dp0"
title Blue Wave - Updates toepassen en starten
color 0B
echo.
echo  =======================================================
echo   BLUE WAVE - Updates toepassen en starten
echo  =======================================================
echo.
echo   Cursor heeft mail-fix en testlink-aanpassingen gedaan.
echo   Druk op een toets om te accepteren en Blue Wave te starten.
echo.
pause
echo.
echo  [1/2] Backend en frontend bouwen...
call npm run build
if errorlevel 1 (
  echo.
  echo  ERROR bij bouwen. Controleer of npm geinstalleerd is.
  pause
  exit /b 1
)
echo.
echo  Poorten vrijmaken (3081, 4001, 3001)...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3081" ^| findstr "LISTENING"') do (taskkill /F /PID %%a 2>nul & echo    Port 3081 vrij)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":4001" ^| findstr "LISTENING"') do (taskkill /F /PID %%a 2>nul & echo    Port 4001 vrij)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3001" ^| findstr "LISTENING"') do (taskkill /F /PID %%a 2>nul & echo    Port 3001 vrij)
timeout /t 2 /nobreak >nul
echo.
echo  [2/2] Blue Wave starten (tunnel)...
echo.
echo  Je publieke URL verschijnt hieronder. Laat dit venster open.
echo.
call npm run tunnel
pause
