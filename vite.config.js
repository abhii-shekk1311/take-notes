import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["/sticky-notes.png", "/delete2.png", "/write.png", "/search.png", "/right-arrow"],
      manifest: {
        name: "Take Notes",
        short_name: "Notes",
        start_url: "/",
        display: 'standalone',
        background_color: "#fff",
        theme_color: "#2196f3",
        icons: [
          {
            src: '/sticky-notes.png',
            sizes: '20x20',
            type: 'image/png',
          },
          {
            src: '/delete2.png',
            sizes: '20x20',
            type: 'image/png',
          },
          {
            src: '/write.png',
            sizes: '20x20',
            type: 'image/png',
          },
          {
            src: '/search.png',
            sizes: '20x20',
            type: 'image/png',
          },
          {
            src: "/right-arrow",
            sizes: '20x20',
            type: 'image/png',
          }
        ]
      }
    })
  ],
})
