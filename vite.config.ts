import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  // base: '', // For development, we can use the default base path
  base: '/EnergyUnits/',
  build: {
    outDir: "build/",
  },
})
