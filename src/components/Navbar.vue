<template>
  <header class="bg-blue-800 dark:bg-gray-800 shadow p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="flex items-center space-x-4 rtl:space-x-reverse">
      <!-- يمكن إضافة شعار أو روابط هنا -->
      <span class="text-white font-bold text-xl">لوحة التحكم</span>
    </div>
    <div class="flex items-center space-x-4 rtl:space-x-reverse">
      <!-- زر الوضع الليلي -->
      <button
        @click="toggleDark"
        class="text-2xl focus:outline-none transition"
        :title="isDark ? 'الوضع النهاري' : 'الوضع الليلي'"
      >
        {{ isDark ? '☀️' : '🌙' }}
      </button>

      <!-- زر تغيير اللغة -->
      <button
        @click="toggleLang"
        class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        title="تغيير اللغة"
      >
        🌐
      </button>

      <!-- زر تسجيل الخروج -->
      <button
        @click="logout"
        class="text-red-100 bg-red-500 hover:bg-red-600 px-4 py-1 rounded transition"
      >
        تسجيل الخروج
      </button>
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

  // تغيير الاتجاه حسب اللغة
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
