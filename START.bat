@echo off
cd /d "%~dp0"
echo.
echo === Blue Wave - Backend + Frontend + Tunnel ===
echo.

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)
if not exist "frontend\node_modules" (
  cd frontend
  call npm install
  cd ..
)
if not exist "backend\node_modules" (
  cd backend
  call npm install
  cd ..
)

REM Kill any process on 3081 and 4001 so we start clean
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3081" ^| findstr "LISTENING"') do (
  taskkill /F /PID %%a 2>nul
  echo Freed port 3081
)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":4001" ^| findstr "LISTENING"') do (
  taskkill /F /PID %%a 2>nul
  echo Freed port 4001
)

echo.
echo Waiting for ports to release...
timeout /t 3 /nobreak >nul
echo.
echo Building and starting tunnel...
echo Your public URL will appear below. Keep this window open.
echo.
call npm run tunnel
pause
