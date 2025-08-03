<template>
  <div class="p-6 max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded shadow">
    <h1 class="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-white">
     نتائج المطابقة بين المتطوعين والفعاليات
    </h1>

    <div class="flex justify-center mb-8">
      <button
        @click="runMatch"
        class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
      >
        🔍 ابدأ المطابقة
      </button>
    </div>

    <div v-if="results.length">
      <!--  تغليف الجدول هنا لتحسين ظهوره في الشاشات الصغيرة -->
      <div class="overflow-x-auto">
        <table class="min-w-max w-full text-sm text-center border border-gray-300 dark:border-gray-700 shadow-sm rounded">
          <thead class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-base">
            <tr>
              <th class="py-3 px-4 border"> المتطوع</th>
              <th class="py-3 px-4 border"> الفعالية</th>
              <th class="py-3 px-4 border"> الموقع</th>
              <th class="py-3 px-4 border"> وقت المتطوع</th>
              <th class="py-3 px-4 border"> وقت الفعالية</th>
              <th class="py-3 px-4 border"> المهارات المتطابقة</th>
              <th class="py-3 px-4 border"> مطابقة الموقع</th>
              <th class="py-3 px-4 border"> مطابقة الوقت</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-100 text-sm">
            <tr
              v-for="(res, index) in results"
              :key="index"
              class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <td class="py-3 px-4 font-medium whitespace-nowrap">{{ res.volunteer.name }}</td>
              <td class="py-3 px-4 whitespace-nowrap">{{ res.event.title }}</td>
              <td class="py-3 px-4 whitespace-nowrap">{{ res.event.location }}</td>
              <td class="py-3 px-4 whitespace-nowrap">{{ res.volunteer.availability }}</td>
              <td class="py-3 px-4 whitespace-nowrap">{{ res.event.time }}</td>
              <td class="py-3 px-4 font-semibold text-green-600 whitespace-nowrap">
                <span v-if="res.matchDetails.matchedSkills.length">
                  {{ res.matchDetails.matchedSkills.join(', ') }}
                </span>
                <span v-else class="text-red-500 font-normal">
                  لا توجد مهارات متطابقة
                </span>
              </td>
              <td
                class="py-3 px-4 font-bold whitespace-nowrap"
                :class="res.matchDetails.locationMatch ? 'text-green-600' : 'text-red-500'"
              >
                {{ res.matchDetails.locationMatch ? '✔️ متطابق' : '❌ غير متطابق' }}
              </td>
              <td
                class="py-3 px-4 font-bold whitespace-nowrap"
                :class="res.matchDetails.timeMatch ? 'text-green-600' : 'text-red-500'"
              >
                {{ res.matchDetails.timeMatch ? '✔️ متطابق' : '❌ غير متطابق' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="text-center text-gray-600 dark:text-gray-400 mt-14 text-lg">
      <p class="mb-2">🚫 لا توجد نتائج مطابقة حتى الآن.</p>
      <p>اضغط على زر "<strong>ابدأ المطابقة</strong>" لعرض النتائج.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const results = ref([])

function runMatch() {
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
