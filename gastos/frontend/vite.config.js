import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Rutas relativas: imprescindible para el Ingress de HA (se sirve bajo /api/hassio_ingress/<token>/)
  base: './',
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173 },
})
