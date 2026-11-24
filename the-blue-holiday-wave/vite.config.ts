import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CAP_BUILD=1  → Capacitor mobile app, base /
// BLUEHOST_BUILD=1 → Bluehost subfolder, base /holidayseason/
// default (Cursor hosting, local dev) → base /
const mobile = process.env.CAP_BUILD === '1'
const bluehost = process.env.BLUEHOST_BUILD === '1'

export default defineConfig({
  plugins: [react()],
  base: mobile || !bluehost ? '/' : '/holidayseason/',
  server: {
    port: 5195,
    strictPort: true,
  },
})
