<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">إدارة الفعاليات</h1>
    <div v-if="events.length === 0" class="text-gray-500">لا توجد فعاليات مسجلة حالياً</div>
    <div v-for="event in events" :key="event.id" class="bg-white dark:bg-gray-800 p-4 mb-4 rounded shadow">
      <div class="flex justify-between items-center mb-2">
        <h2 class="font-semibold">{{ event.title }}</h2>
        <div class="space-x-2">
          <button @click="editEvent(event)" class="text-blue-500">تعديل</button>
          <button @click="deleteEvent(event.id)" class="text-red-500">حذف</button>
        </div>
      </div>
      <p>الوصف: {{ event.description }}</p>
      <p>التاريخ: {{ event.date }}</p>
      <p>الموقع: {{ event.location }}</p>
      <p>المهارات المطلوبة: {{ event.requiredSkills.join(', ') }}</p>
    </div>

    <!-- Edit Form -->
    <div v-if="editing" class="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded shadow max-w-xl">
      <h3 class="text-lg font-bold mb-2">تعديل الفعالية</h3>
      <form @submit.prevent="saveEdit" class="space-y-3">
        <input v-model="editForm.title" class="w-full p-2 rounded border" placeholder="عنوان الفعالية" />
        <input v-model="editForm.description" class="w-full p-2 rounded border" placeholder="الوصف" />
        <input v-model="editForm.date" type="date" class="w-full p-2 rounded border" />
        <input v-model="editForm.location" class="w-full p-2 rounded border" placeholder="الموقع" />
        <input v-model="editForm.skillsText" class="w-full p-2 rounded border" placeholder="المهارات المطلوبة (بفواصل)" />
        <button class="bg-green-600 text-white px-4 py-2 rounded">حفظ</button>
        <button type="button" @click="cancelEdit" class="text-sm text-gray-500 ml-4">إلغاء</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const events = ref([])
const editing = ref(false)
const editForm = ref({})

onMounted(() => {
  const stored = JSON.parse(localStorage.getItem('events') || '[]')
  events.value = stored
})

const deleteEvent = (id) => {
  events.value = events.value.filter(e => e.id !== id)
  localStorage.setItem('events', JSON.stringify(events.value))
}

const editEvent = (event) => {
  editing.value = true
  editForm.value = { ...event, skillsText: event.requiredSkills.join(', ') }
}

const cancelEdit = () => {
  editing.value = false
  editForm.value = {}
}

const saveEdit = () => {
  const index = events.value.findIndex(e => e.id === editForm.value.id)
  if (index !== -1) {
    events.value[index] = {
      ...editForm.value,
      requiredSkills: editForm.value.skillsText.split(',').map(s => s.trim())
    }
    localStorage.setItem('events', JSON.stringify(events.value))
    cancelEdit()
  }
}
</script>