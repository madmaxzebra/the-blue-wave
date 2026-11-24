import { spawnSync } from 'node:child_process'

const env = { ...process.env, CAP_BUILD: '1' }
const build = spawnSync('npx', ['vite', 'build'], {
  stdio: 'inherit',
  shell: true,
  env,
})
if (build.status !== 0) process.exit(build.status ?? 1)

const sync = spawnSync('npx', ['cap', 'sync'], {
  stdio: 'inherit',
  shell: true,
  env,
})
process.exit(sync.status ?? 1)
