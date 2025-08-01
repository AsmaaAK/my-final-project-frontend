<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">تسجيل متطوع جديد</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <input v-model="form.name" class="w-full p-2 rounded border" placeholder="الاسم الكامل" required />
      <input v-model="form.age" class="w-full p-2 rounded border" placeholder="العمر" type="number" required />
      <input v-model="form.location" class="w-full p-2 rounded border" placeholder="الموقع" required />
      <input v-model="form.availability" class="w-full p-2 rounded border" placeholder="الوقت المتاح" required />
      <input v-model="form.skills" class="w-full p-2 rounded border" placeholder="المهارات (مفصولة بفواصل)" required />

      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">تسجيل</button>
    </form>

    <div class="mt-6" v-if="saved">
      <p class="text-green-600">✅ تم حفظ بيانات المتطوع في المتصفح!</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  age: '',
  location: '',
  availability: '',
  skills: ''
})

const saved = ref(false)

const handleSubmit = () => {
  const volunteer = {
    id: Date.now(),
    ...form.value,
    skills: form.value.skills.split(',').map(skill => skill.trim())
  }

  const existing = JSON.parse(localStorage.getItem('volunteers') || '[]')
  existing.push(volunteer)
  localStorage.setItem('volunteers', JSON.stringify(existing))
  saved.value = true
}
</script>