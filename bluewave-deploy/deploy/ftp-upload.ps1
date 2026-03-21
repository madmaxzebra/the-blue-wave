# FTP upload for Blue Wave - run from bluewave folder
# Usage: .\deploy\ftp-upload.ps1
# Set variables below (or use env vars - never commit real passwords!)

$FtpHost = "server75.hosting2go.nl"
$FtpUser = $env:FTP_USER  # Or set: $FtpUser = "your-ftp-username"
$FtpPass = $env:FTP_PASS  # Or set: $FtpPass = "your-ftp-password"
$RemotePath = if ($env:FTP_REMOTE_PATH) { $env:FTP_REMOTE_PATH } else { "/bluewave" }  # Or e.g. /domains/zebra-onlinedesign.com/public_html/bluewave

if (-not $FtpUser -or -not $FtpPass) {
    Write-Host "Set FTP_USER and FTP_PASS env vars, or edit this script." -ForegroundColor Yellow
    Write-Host "Example: `$env:FTP_USER='youruser'; `$env:FTP_PASS='yourpass'; .\deploy\ftp-upload.ps1"
    exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

Write-Host "Uploading Blue Wave to $FtpHost$RemotePath" -ForegroundColor Cyan

# Build first
Push-Location $projectRoot
npm run build 2>$null
if ($LASTEXITCODE -ne 0) { npm run build }
Pop-Location

# Create temp upload folder
$uploadDir = Join-Path $env:TEMP "bluewave-upload"
if (Test-Path $uploadDir) { Remove-Item $uploadDir -Recurse -Force }
New-Item -ItemType Directory -Path $uploadDir -Force | Out-Null

Copy-Item (Join-Path $projectRoot "frontend\dist") (Join-Path $uploadDir "frontend\dist") -Recurse
Copy-Item (Join-Path $projectRoot "backend\dist") (Join-Path $uploadDir "backend\dist") -Recurse
Copy-Item (Join-Path $projectRoot "backend\package.json") (Join-Path $uploadDir "backend\")
Copy-Item (Join-Path $projectRoot "backend\package-lock.json") (Join-Path $uploadDir "backend\") -ErrorAction SilentlyContinue
Copy-Item (Join-Path $projectRoot "backend\.env") (Join-Path $uploadDir "backend\") -ErrorAction SilentlyContinue
Get-ChildItem (Join-Path $projectRoot "backend\*.db") -ErrorAction SilentlyContinue | Copy-Item -Destination (Join-Path $uploadDir "backend\")

function Upload-FtpDir {
    param($localPath, $remotePath)
    $items = Get-ChildItem $localPath -Force
    foreach ($item in $items) {
        $remoteItem = "$remotePath/$($item.Name)"
        if ($item.PSIsContainer) {
            try {
                $req = [System.Net.FtpWebRequest]::Create("ftp://$FtpHost$remoteItem")
                $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
                $req.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPass)
                $req.GetResponse() | Out-Null
            } catch {}
            Upload-FtpDir $item.FullName $remoteItem
        } else {
            $req = [System.Net.FtpWebRequest]::Create("ftp://$FtpHost$remoteItem")
            $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
            $req.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPass)
            $req.UseBinary = $true
            $fs = [System.IO.File]::OpenRead($item.FullName)
            $req.ContentLength = $fs.Length
            $rs = $req.GetRequestStream()
            $fs.CopyTo($rs)
            $rs.Close(); $fs.Close()
            Write-Host "  $($item.FullName.Replace($uploadDir, ''))"
        }
    }
}

Upload-FtpDir $uploadDir $RemotePath
Remove-Item $uploadDir -Recurse -Force
Write-Host "Done. On server: cd backend && npm install --omit=dev && node dist/server.js" -ForegroundColor Green
