@echo off
cd /d "%~dp0"
set TARGET=%~dp0ACCEPT-EN-START.bat
set DESKTOP=%USERPROFILE%\Desktop

powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\Blue Wave - Accept en Start.lnk'); $s.TargetPath = '%TARGET%'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Blue Wave - updates toepassen en starten'; $s.Save()"
echo.
echo  Snelkoppeling gemaakt op Bureaublad: "Blue Wave - Accept en Start"
echo.
pause
