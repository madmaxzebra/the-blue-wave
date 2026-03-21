@echo off
cd /d "%~dp0"
set PACKAGE=bluewave-deploy
if exist "%PACKAGE%" rmdir /s /q "%PACKAGE%"
mkdir "%PACKAGE%"

echo Creating Blue Wave deploy package...
xcopy /E /I /Y backend "%PACKAGE%\backend\" >nul
xcopy /E /I /Y frontend "%PACKAGE%\frontend\" >nul
xcopy /E /I /Y deploy "%PACKAGE%\deploy\" >nul

copy Dockerfile "%PACKAGE%\" >nul
copy docker-compose.yml "%PACKAGE%\" >nul
copy package.json "%PACKAGE%\" >nul
copy share-server.js "%PACKAGE%\" >nul
copy run-tunnel.js "%PACKAGE%\" >nul 2>nul

echo Copying production env example...
copy backend\.env.production.example "%PACKAGE%\backend\.env.production.example" >nul 2>nul

echo Ensuring backend/assets (email banner) is included...
if not exist "%PACKAGE%\backend\assets" mkdir "%PACKAGE%\backend\assets"
copy backend\assets\email-banner.png "%PACKAGE%\backend\assets\" >nul 2>nul

echo Removing node_modules and .env from package...
if exist "%PACKAGE%\backend\node_modules" rmdir /s /q "%PACKAGE%\backend\node_modules"
if exist "%PACKAGE%\frontend\node_modules" rmdir /s /q "%PACKAGE%\frontend\node_modules"
if exist "%PACKAGE%\backend\.env" del "%PACKAGE%\backend\.env"

echo Creating RUN-THIS.txt...
echo 1. Maak backend\.env (kopieer van .env.production.example, vul RESEND_API_KEY en SITE_URL in) > "%PACKAGE%\RUN-THIS.txt"
echo 2. Na upload naar server: >> "%PACKAGE%\RUN-THIS.txt"
echo    cd bluewave-deploy >> "%PACKAGE%\RUN-THIS.txt"
echo    docker compose up -d --build >> "%PACKAGE%\RUN-THIS.txt"
echo. >> "%PACKAGE%\RUN-THIS.txt"
echo De Blue Wave draait op poort 4000. >> "%PACKAGE%\RUN-THIS.txt"
echo Zie deploy\LIVE-PRODUCTIE.md voor Resend domein verificatie. >> "%PACKAGE%\RUN-THIS.txt"

echo.
echo.
echo Done. Package is in: %PACKAGE%\
echo.
echo 1. Maak backend\.env op de server (kopieer van .env.production.example)
echo 2. Upload de hele map %PACKAGE% naar je server
echo 3. Op server: cd %PACKAGE% en dan: docker compose up -d --build
echo 4. Zie deploy\LIVE-PRODUCTIE.md voor Resend/domein setup
echo.
pause
