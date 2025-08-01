<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">قائمة المتطوعين</h1>
    <div v-if="volunteers.length === 0" class="text-gray-500">لا يوجد متطوعون مسجلون حالياً</div>
    <div v-for="vol in volunteers" :key="vol.id" class="bg-white dark:bg-gray-800 p-4 mb-4 rounded shadow">
      <div class="flex justify-between items-center mb-2">
        <h2 class="font-semibold">{{ vol.name }}</h2>
        <div class="space-x-2">
          <button @click="editVolunteer(vol)" class="text-blue-500">تعديل</button>
          <button @click="deleteVolunteer(vol.id)" class="text-red-500">حذف</button>
        </div>
      </div>
      <p>العمر: {{ vol.age }}</p>
      <p>الموقع: {{ vol.location }}</p>
      <p>الوقت المتاح: {{ vol.availability }}</p>
      <p>المهارات: {{ vol.skills.join(', ') }}</p>
    </div>

    <!-- Edit Form -->
    <div v-if="editing" class="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded shadow max-w-xl">
      <h3 class="text-lg font-bold mb-2">تعديل المتطوع</h3>
      <form @submit.prevent="saveEdit" class="space-y-3">
        <input v-model="editForm.name" class="w-full p-2 rounded border" placeholder="الاسم" />
        <input v-model="editForm.age" type="number" class="w-full p-2 rounded border" placeholder="العمر" />
        <input v-model="editForm.location" class="w-full p-2 rounded border" placeholder="الموقع" />
        <input v-model="editForm.availability" class="w-full p-2 rounded border" placeholder="الوقت المتاح" />
        <input v-model="editForm.skillsText" class="w-full p-2 rounded border" placeholder="المهارات (بفواصل)" />
        <button class="bg-green-600 text-white px-4 py-2 rounded">حفظ</button>
        <button type="button" @click="cancelEdit" class="text-sm text-gray-500 ml-4">إلغاء</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const volunteers = ref([])
const editing = ref(false)
const editForm = ref({})

onMounted(() => {
  const stored = JSON.parse(localStorage.getItem('volunteers') || '[]')
  volunteers.value = stored
})

const deleteVolunteer = (id) => {
  volunteers.value = volunteers.value.filter(v => v.id !== id)
  localStorage.setItem('volunteers', JSON.stringify(volunteers.value))
}

const editVolunteer = (vol) => {
  editing.value = true
  editForm.value = { ...vol, skillsText: vol.skills.join(', ') }
}

const cancelEdit = () => {
  editing.value = false
  editForm.value = {}
}

const saveEdit = () => {
  const index = volunteers.value.findIndex(v => v.id === editForm.value.id)
  if (index !== -1) {
    volunteers.value[index] = {
      ...editForm.value,
      skills: editForm.value.skillsText.split(',').map(s => s.trim())
    }
    localStorage.setItem('volunteers', JSON.stringify(volunteers.value))
    cancelEdit()
  }
}
</script>