import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: './src/setupTests.ts', // Si lo necesitas
    css: true, // importante para que no fallen imports de CSS
  },
})
