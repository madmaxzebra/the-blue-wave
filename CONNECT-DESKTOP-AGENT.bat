@echo off
echo ============================================
echo   Connect this PC to Agent Hub
echo ============================================
echo.
set /p HUBURL=Paste the Agent Hub address (starts with https): 
set /p HUBKEY=Type the hub key: 
if "%HUBURL:~-1%"=="/" set "HUBURL=%HUBURL:~0,-1%"
setx AGENT_HUB_URL "%HUBURL%" >nul
setx AGENT_HUB_TOKEN "%HUBKEY%" >nul
echo.
echo Done. Now CLOSE Cursor completely and open it again.
echo Then paste the text from DESKTOP-AGENT-MESSAGE.txt into your desktop agent.
echo.
pause
