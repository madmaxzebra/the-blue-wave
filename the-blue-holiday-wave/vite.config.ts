import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Website lives at /holidayseason/. The store app is built with CAP_BUILD=1 and base /.
const mobile = process.env.CAP_BUILD === '1'

export default defineConfig({
  plugins: [react()],
  base: mobile ? '/' : '/holidayseason/',
  server: {
    port: 5195,
    strictPort: true,
  },
})
