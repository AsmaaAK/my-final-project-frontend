<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">الملف الشخصي</h1>
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md">
      <p><strong>اسم المستخدم:</strong> {{ username }}</p>
      <p class="mt-2"><strong>الحالة:</strong> {{ loggedIn ? 'مسجل الدخول' : 'غير مسجل' }}</p>
      <button v-if="loggedIn" @click="logout" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">تسجيل الخروج</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const loggedIn = ref(false)
const router = useRouter()

onMounted(() => {
  const session = JSON.parse(localStorage.getItem('session'))
  if (session?.username) {
    username.value = session.username
    loggedIn.value = true
  }
})

const logout = () => {
  localStorage.removeItem('session')
  router.push('/login')
}
</script>