<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">الإعدادات</h1>
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-semibold mb-2">الوضع الليلي</h2>
        <button @click="toggleDark" class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
          {{ isDark ? 'تعطيل الوضع الليلي' : 'تفعيل الوضع الليلي ' }}
        </button>
      </div>
      <div>
        <h2 class="text-lg font-semibold mb-2">اللغة</h2>
        <button @click="toggleLang" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
          {{ lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '../stores/main'
import { useI18n } from 'vue-i18n'

const store = useMainStore()
const { locale } = useI18n()

const isDark = computed(() => store.darkMode)
const lang = computed(() => store.language)

const toggleDark = () => {
  store.toggleDarkMode()
  document.documentElement.classList.toggle('dark', store.darkMode)
}

const toggleLang = () => {
  store.toggleLanguage()
  locale.value = store.language
}
</script>