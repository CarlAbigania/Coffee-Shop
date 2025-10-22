import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API calls during development to your PHP backend
      // Adjust the target to the actual URL where Apache/Nginx serves your PHP files
      '/api': {
        target: 'http://localhost/Abigania/coffeeshop-react',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/backend/api'),
      },
    },
  },
})
