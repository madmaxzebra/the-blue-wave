import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// /holidayseason/ only when deploying to Bluehost (BLUEHOST_BUILD=1).
// Cursor hosting and mobile builds both use /.
const mobile = process.env.CAP_BUILD === '1'
const bluehost = process.env.BLUEHOST_BUILD === '1'

export default defineConfig({
  plugins: [react()],
  base: bluehost && !mobile ? '/holidayseason/' : '/',
  server: {
    port: 5195,
    strictPort: true,
  },
})
