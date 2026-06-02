import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Hotel Brain',
        short_name: 'HotelBrain',
        description: 'Gestor de Mantenimiento y Averías',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/2809/2809663.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
