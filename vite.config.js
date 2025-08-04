import { defineConfig } from 'vite'
import { resolve } from 'path'
import handlebars from 'vite-plugin-handlebars'

export default defineConfig({
  root: 'src',
  plugins: [
    handlebars({
      // Изменяем на массив путей для поиска partials
      partialDirectory: [
        resolve(__dirname, 'src/components'),
        resolve(__dirname, 'src/components/navbar'),
        resolve(__dirname, 'src/components/header'),
        resolve(__dirname, 'src/components/layout')
      ],
      
      // Или используем glob pattern для всех подпапок
      // partialDirectory: resolve(__dirname, 'src/components/**'),
      
      context: {
        title: 'MarkeTel',
      },
      
      helpers: {
        isActive: (currentPage, pageName) => {
          return currentPage === pageName ? 'active' : '';
        }
      }
    })
  ],
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        team: resolve(__dirname, 'src/pages/team/index.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
      }
    }
  },
  server: {
    port: 3000,
    open: '/pages/team/'
  }
})