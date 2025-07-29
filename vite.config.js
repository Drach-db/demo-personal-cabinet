import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        team: resolve(__dirname, 'src/pages/team/index.html')
      }
    }
  },
  server: {
    port: 3000,
    open: '/pages/team/' // Открывает страницу team при запуске
  }
})