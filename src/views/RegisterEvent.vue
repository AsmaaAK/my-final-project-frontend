<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">إضافة فعالية جديدة</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <input v-model="form.title" class="w-full p-2 rounded border" placeholder="اسم الفعالية" required />
      <input v-model="form.description" class="w-full p-2 rounded border" placeholder="الوصف" required />
      <input v-model="form.date" type="date" class="w-full p-2 rounded border" required />
      <input v-model="form.location" class="w-full p-2 rounded border" placeholder="الموقع" required />
      <input v-model="form.skills" class="w-full p-2 rounded border" placeholder="المهارات المطلوبة (بفواصل)" required />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">حفظ</button>
    </form>

    <div class="mt-6" v-if="saved">
      <p class="text-green-600">✅ تم حفظ الفعالية في المتصفح!</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  title: '',
  description: '',
  date: '',
  location: '',
  skills: ''
})

const saved = ref(false)

const handleSubmit = () => {
  const event = {
    id: Date.now(),
    title: form.value.title,
    description: form.value.description,
    date: form.value.date,
    location: form.value.location,
    requiredSkills: form.value.skills.split(',').map(skill => skill.trim())
  }

  const existing = JSON.parse(localStorage.getItem('events') || '[]')
  existing.push(event)
  localStorage.setItem('events', JSON.stringify(existing))
  saved.value = true
}
</script>