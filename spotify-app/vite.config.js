// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    headers: {
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' https://accounts.spotify.com 'unsafe-inline'",
        "connect-src 'self' https://api.spotify.com https://accounts.spotify.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https://i.scdn.co https://mosaic.scdn.co",
      ].join("; ")
    }
  }
})