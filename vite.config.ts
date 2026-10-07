import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // em dev a API (api/, NestJS) roda na 3000; em produção o nginx faz o mesmo papel
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/media': 'http://localhost:3000',
    },
  },
})
