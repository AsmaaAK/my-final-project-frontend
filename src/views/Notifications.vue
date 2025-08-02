<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">الإشعارات</h1>

    <div class="mb-4 flex gap-4">
      <button @click="clearNotifications" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        🧹 مسح الإشعارات
      </button>
      <button @click="checkNewMatches" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        🔄 تحقق من إشعارات جديدة
      </button>
    </div>

    <div v-if="notifications.length === 0" class="text-gray-500">لا توجد إشعارات حالياً.</div>

    <div
      v-for="(item, index) in notifications"
      :key="index"
      class="bg-white dark:bg-gray-800 p-4 mb-4 rounded shadow"
    >
      <p>
        🔔 تم إيجاد مطابقة بين <strong>{{ item.volunteer.name }}</strong> و
        <strong>{{ item.event.title }}</strong>.
      </p>
      <p class="text-sm text-gray-500 mt-1">
        📍 {{ item.volunteer.location }} | المهارات: {{ item.sharedSkills.join(', ') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const notifications = ref([])

// دالة لمقارنة إذا كانت المطابقة موجودة مسبقاً
function isMatchExist(newMatch, currentMatches) {
  return currentMatches.some(
    (m) =>
      m.volunteer.id === newMatch.volunteer.id &&
      m.event.id === newMatch.event.id
  )
}

const loadData = () => {
  const saved = JSON.parse(localStorage.getItem('notifications') || '[]')
  notifications.value = saved
}

const saveData = () => {
  localStorage.setItem('notifications', JSON.stringify(notifications.value))
}

// 🔁 التحقق من المطابقات الجديدة
const checkNewMatches = () => {
  const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]')
  const events = JSON.parse(localStorage.getItem('events') || '[]')
  const newMatches = []

  events.forEach((event) => {
    volunteers.forEach((vol) => {
      const shared = event.requiredSkills.filter((skill) =>
        vol.skills.includes(skill)
      )
      if (vol.location === event.location && shared.length > 0) {
        const newMatch = { volunteer: vol, event, sharedSkills: shared }
        if (!isMatchExist(newMatch, notifications.value)) {
          newMatches.push(newMatch)
        }
      }
    })
  })

  if (newMatches.length > 0) {
    notifications.value.push(...newMatches)
    saveData()
  }
}

onMounted(() => {
  loadData()
})

const clearNotifications = () => {
  notifications.value = []
  localStorage.removeItem('notifications')
}
</script>
