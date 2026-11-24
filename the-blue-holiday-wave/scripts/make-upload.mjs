import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const root = process.cwd()
const dist = join(root, 'dist')
const outDir = join(root, 'holidayseason-upload')
const zipPath = join(root, 'holidayseason-upload.zip')

if (!existsSync(dist)) {
  console.error('Missing dist/ — run npm run build first')
  process.exit(1)
}

rmSync(outDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
mkdirSync(outDir, { recursive: true })
cpSync(dist, outDir, { recursive: true })

// Also keep _ftp-upload in sync for Bluehost FTP
const ftpDir = join(root, '_ftp-upload')
rmSync(ftpDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
mkdirSync(ftpDir, { recursive: true })
cpSync(dist, ftpDir, { recursive: true })

if (existsSync(zipPath)) rmSync(zipPath)

execSync(
  `powershell -NoProfile -Command "Compress-Archive -Path '${outDir}\\*' -DestinationPath '${zipPath}' -Force"`,
  { stdio: 'inherit' },
)

console.log('Upload package ready:')
console.log(' ', zipPath)
console.log('Bluehost: public_html/holidayseason/ → upload zip → Extract → Ctrl+F5')
