<template>
  <div class="p-6 max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded shadow">
    <h1 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
      نتائج المطابقة بين المتطوعين والفعاليات
    </h1>

    <button
      @click="runMatch"
      class="mb-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
    >
      ابدأ المطابقة
    </button>

    <div v-if="results.length" class="overflow-x-auto">
      <table class="min-w-full border border-gray-300 dark:border-gray-700 text-sm text-center">
        <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            <th class="py-2 px-4 border">المتطوع</th>
            <th class="py-2 px-4 border">الفعالية</th>
            <th class="py-2 px-4 border">الموقع</th>
            <th class="py-2 px-4 border">وقت المتطوع</th>
            <th class="py-2 px-4 border">وقت الفعالية</th>
            <th class="py-2 px-4 border">المهارات المتطابقة</th>
            <th class="py-2 px-4 border">مطابقة الموقع</th>
            <th class="py-2 px-4 border">مطابقة الوقت</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(res, index) in results"
            :key="index"
            class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td class="py-2 px-4">{{ res.volunteer.name }}</td>
            <td class="py-2 px-4">{{ res.event.title }}</td>
            <td class="py-2 px-4">{{ res.event.location }}</td>
            <td class="py-2 px-4">{{ res.volunteer.availability }}</td>
            <td class="py-2 px-4">{{ res.event.time }}</td>
            <td class="py-2 px-4 text-green-600 font-semibold">
              {{ res.matchDetails.matchedSkills.length
                ? res.matchDetails.matchedSkills.join(', ')
                : 'لا توجد مهارات متطابقة' }}
            </td>
            <td
              class="py-2 px-4"
              :class="res.matchDetails.locationMatch ? 'text-green-600' : 'text-red-600'"
            >
              {{ res.matchDetails.locationMatch ? '✔️' : '❌' }}
            </td>
            <td
              class="py-2 px-4"
              :class="res.matchDetails.timeMatch ? 'text-green-600' : 'text-red-600'"
            >
              {{ res.matchDetails.timeMatch ? '✔️' : '❌' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
      لا توجد نتائج مطابقة بعد.
      </br> اضغط على زر "ابدأ المطابقة".
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const results = ref([])

function runMatch() {
  // جلب البيانات من localStorage
  const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]')
  const events = JSON.parse(localStorage.getItem('events') || '[]')

  results.value = []

  volunteers.forEach((volunteer) => {
    events.forEach((event) => {
      const locationMatch = volunteer.location === event.location
      const timeMatch = volunteer.availability === event.time
      const matchedSkills = event.requiredSkills.filter((skill) =>
        volunteer.skills.includes(skill)
      )

      results.value.push({
        volunteer,
        event,
        matchDetails: {
          locationMatch,
          timeMatch,
          matchedSkills,
        },
      })
    })
  })
}
</script>

<style scoped>
/* لا حاجة لتنسيقات إضافية */
</style>
