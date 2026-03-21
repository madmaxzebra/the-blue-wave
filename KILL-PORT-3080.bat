@echo off
echo Killing process on port 3081...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3081 ^| findstr LISTENING') do (
  taskkill /F /PID %%a 2>nul
  echo Killed PID %%a
)
echo Done. You can now run START.bat again.
pause
