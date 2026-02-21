// vite.config.js - CORRECT VERSION
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // This is for Tailwind CSS v4

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // This should be here for Tailwind v4
  ],
})




