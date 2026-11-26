import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const root = join(import.meta.dirname, '..')
const dist = join(root, 'dist')
const apiSrc = join(root, 'server', 'api')
const outDir = join(root, 'holidayseason-upload')
const zipPath = join(root, 'holidayseason-upload.zip')

if (!existsSync(dist)) {
  console.error('Missing dist/ — run npm run build first')
  process.exit(1)
}
if (!existsSync(apiSrc)) {
  console.error('Missing server/api/ — PHP backend not found')
  process.exit(1)
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
cpSync(dist, outDir, { recursive: true })
cpSync(apiSrc, join(outDir, 'api'), { recursive: true })

const ftpDir = join(root, '_ftp-upload')
rmSync(ftpDir, { recursive: true, force: true })
mkdirSync(ftpDir, { recursive: true })
cpSync(outDir, ftpDir, { recursive: true })

if (existsSync(zipPath)) rmSync(zipPath)

try {
  execSync(`cd "${outDir}" && zip -r -q "${zipPath}" .`, { stdio: 'inherit' })
} catch {
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${outDir.replace(/'/g, "''")}\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force"`,
    { stdio: 'inherit' },
  )
}

console.log('Upload package ready:', zipPath)
console.log('Includes dist + server/api as api/ (JSON storage stays outside public_html).')