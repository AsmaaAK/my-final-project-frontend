import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from  'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base:"/my-final-project-frontend/",
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),

  ],  
  server: {
    open: '/Login'  // <-- يفتح هذا المسار عند التشغيل
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
