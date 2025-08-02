<template>
  <header class="bg-blue-800 dark:bg-gray-800 shadow p-4">
    <div class="container mx-auto flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 sm:gap-6">
      <!-- العناصر الرئيسية -->
      <div class="flex items-center gap-4 sm:gap-6 order-2 sm:order-1">
        <!-- زر الوضع الليلي -->
        <button
          @click="toggleDark"
          class="text-xl focus:outline-none transition p-2 rounded-full hover:bg-blue-700 dark:hover:bg-gray-700"
          :title="isDark ? 'الوضع النهاري' : 'الوضع الليلي'"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <!-- زر تسجيل الخروج -->
        <button
          @click="logout"
          class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition text-sm sm:text-base"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { locale } = useI18n()

// اللغة الحالية
const savedLang = localStorage.getItem('lang') || 'ar'
locale.value = savedLang

// تغيير اللغة
function toggleLang() {
  const newLang = locale.value === 'ar' ? 'en' : 'ar'
  locale.value = newLang
  localStorage.setItem('lang', newLang)
  document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
}

// الوضع الليلي
const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})

// تسجيل الخروج
function logout() {
  localStorage.removeItem('auth')
  router.push('/login')
}
</script>

<style scoped>
/* تحسينات للعرض على الجوال */
@media (max-width: 640px) {
  header {
    padding: 0.75rem;
  }
  
  button {
    min-width: 40px;
    display: flex;
    align-items: left;
    justify-content: left;
  }
}
</style>