import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '', // For development, we can use the default base path
  base: '/EnergyUnits/',
  build: {
    outDir: "build/",
  },
})
