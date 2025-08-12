import { defineConfig } from 'vite'
import { resolve } from 'path'
import handlebars from 'vite-plugin-handlebars'

export default defineConfig({
  // Корневая папка проекта (где искать файлы)
  root: 'src',
  
  // Плагины - дополнительные возможности
  plugins: [
    handlebars({
      // Где искать компоненты Handlebars (navbar, header и т.д.)
      partialDirectory: [
        resolve(__dirname, 'src/components'),
        resolve(__dirname, 'src/components/navbar'),
        resolve(__dirname, 'src/components/header'),
        resolve(__dirname, 'src/components/layout')
      ],
      
      // Глобальные переменные для всех страниц
      context: {
        title: 'MarkeTel',
      },
      
      // Вспомогательные функции для шаблонов
      helpers: {
        isActive: (currentPage, pageName) => {
          return currentPage === pageName ? 'active' : '';
        }
      }
    })
  ],
  
  // Настройки для production сборки
  build: {
    // Куда складывать готовые файлы
    outDir: '../dist',
    
    rollupOptions: {
      // ВАЖНО: Здесь перечисляем ВСЕ страницы проекта
      input: {
        main: resolve(__dirname, 'src/index.html'),
        team: resolve(__dirname, 'src/pages/team/index.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
        onboarding: resolve(__dirname, 'src/pages/onboarding/index.html')  // ← ДОБАВИЛИ НОВУЮ СТРАНИЦУ
      }
    }
  },
  
  // Настройки локального сервера для разработки
  server: {
    port: 3000,  // На каком порту запускать (localhost:3000)
    open: '/pages/team/'  // Какую страницу открыть при запуске
  }
})