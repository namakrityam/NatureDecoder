import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.jsx',
      name: 'TessareactCompare',
      fileName: 'tessareact-compare',
    },
  },
})