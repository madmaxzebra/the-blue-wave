# Creates a desktop shortcut for Blue Wave (backend + frontend + tunnel)
$WshShell = New-Object -ComObject WScript.Shell
$Desktop = [Environment]::GetFolderPath('Desktop')
$Shortcut = $WshShell.CreateShortcut("$Desktop\Blue Wave.lnk")

$Shortcut.TargetPath = "cmd.exe"
$Shortcut.Arguments = "/k `"cd /d `"$PSScriptRoot`" && START.bat`""
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.IconLocation = "shell32.dll,13"  # Globe icon
$Shortcut.Description = "Start Blue Wave - backend, frontend + tunnel"

$Shortcut.Save()
Write-Host "Done. 'Blue Wave' shortcut is now on your Desktop."
Write-Host "Double-click it to start backend, frontend and tunnel."
