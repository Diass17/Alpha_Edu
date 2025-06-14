import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'static', // 👉 перемещаем все публичные статичные файлы сюда
  build: {
    outDir: 'dist',     // 👉 теперь сборка идёт в dist
    emptyOutDir: true,
  },
})