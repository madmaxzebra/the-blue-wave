import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const dist = join(root, 'dist')
const bundle = join(root, 'publish-bundle')

if (!existsSync(dist)) {
  console.error('Missing dist/ — run npm run build first')
  process.exit(1)
}

for (const name of readdirSync(bundle)) {
  if (name === '.gitkeep') continue
  rmSync(join(bundle, name), { recursive: true, force: true })
}

mkdirSync(bundle, { recursive: true })

for (const name of readdirSync(dist)) {
  cpSync(join(dist, name), join(bundle, name), { recursive: true })
}

console.log('Cursor publish bundle ready:', bundle)