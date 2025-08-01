<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">تسجيل الدخول</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 mb-2">اسم المستخدم</label>
          <input v-model="username" class="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white" type="text" required />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 dark:text-gray-300 mb-2">كلمة المرور</label>
          <input v-model="password" class="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white" type="password" required />
        </div>
        <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">دخول</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = () => {
  if (username.value === 'admin' && password.value === 'admin') {
    localStorage.setItem('session', JSON.stringify({ username: username.value }));
    router.push('/')
  } else {
    alert('بيانات الدخول غير صحيحة')
  }
}
</script>