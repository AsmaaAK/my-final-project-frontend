<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">الإشعارات</h1>

    <div class="mb-4">
      <button @click="clearNotifications" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        🧹 مسح الإشعارات
      </button>
    </div>

    <div v-if="notifications.length === 0" class="text-gray-500">لا توجد إشعارات حالياً.</div>

    <div v-for="(item, index) in notifications" :key="index" class="bg-white dark:bg-gray-800 p-4 mb-4 rounded shadow">
      <p>🔔 تم إيجاد مطابقة بين <strong>{{ item.volunteer.name }}</strong> و <strong>{{ item.event.title }}</strong>.</p>
      <p class="text-sm text-gray-500 mt-1">📍 {{ item.volunteer.location }} | المهارات: {{ item.sharedSkills.join(', ') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const notifications = ref([])

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('notifications') || '[]')
  if (saved.length) {
    notifications.value = saved
    return
  }

  const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]')
  const events = JSON.parse(localStorage.getItem('events') || '[]')
  const matches = []

  events.forEach(event => {
    volunteers.forEach(vol => {
      const shared = event.requiredSkills.filter(skill => vol.skills.includes(skill))
      if (vol.location === event.location && shared.length > 0) {
        matches.push({ volunteer: vol, event, sharedSkills: shared })
      }
    })
  })

  notifications.value = matches
  localStorage.setItem('notifications', JSON.stringify(matches))
})

const clearNotifications = () => {
  notifications.value = []
  localStorage.removeItem('notifications')
}
</script>