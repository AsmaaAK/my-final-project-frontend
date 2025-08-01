<template>
  <nav>
    <ul class="flex space-x-4">
      <li>{{ $t('dashboard') }}</li>
      <li>{{ $t('volunteers') }}</li>
      <li>{{ $t('events') }}</li>
    </ul>
  </nav>
  <header class="bg-blue-800 dark:bg-gray-800 shadow p-4 flex items-center justify-between">
    <div class="flex items-center space-x-4 rtl:space-x-reverse">
      <!-- يمكن إضافة شعار أو روابط هنا -->
    </div>
    <div class="flex items-center space-x-4 rtl:space-x-reverse">
      <button @click="toggleDark" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">🌓</button>
      <button @click="toggleLang" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">🌐</button>
      <!-- <img src="/images/admin.jpg" alt="Admin" class="w-10 h-10 rounded-full border-2 border-gray-300" /> -->
      <button @click="logout" class="text-red-500 font-semibold">تسجيل الخروج</button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { locale } = useI18n()

// تحميل اللغة المخزنة عند بدء التطبيق أو استخدام الافتراضية
const savedLang = localStorage.getItem('lang') || 'ar'
locale.value = savedLang

function toggleDark() {
  document.documentElement.classList.toggle('dark')
}

function toggleLang() {
  const newLang = locale.value === 'ar' ? 'en' : 'ar'
  locale.value = newLang
  localStorage.setItem('lang', newLang)

  // ضبط اتجاه النص بناءً على اللغة
  if (newLang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl')
  } else {
    document.documentElement.setAttribute('dir', 'ltr')
  }
}

function logout() {
  localStorage.removeItem('auth')
  router.push('/login')
}
</script>
