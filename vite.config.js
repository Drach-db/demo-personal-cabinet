import { defineConfig } from 'vite'
import { resolve } from 'path'
import handlebars from 'vite-plugin-handlebars'

export default defineConfig({
  root: 'src',
  plugins: [
    handlebars({
      // Путь к компонентам (partials)
      partialDirectory: resolve(__dirname, 'src/components'),
      
      // Контекст для всех страниц
      context: {
        title: 'MarkeTel',
        // Можно добавить глобальные переменные
      },
      
      // Помощники для определения активной страницы
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
        // Добавьте другие страницы
      }
    }
  },
  server: {
    port: 3000,
    open: '/pages/team/'
  }
})