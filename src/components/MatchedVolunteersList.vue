<template>
  <div v-if="results.length > 0" class="overflow-auto">
    <table class="min-w-full table-auto border border-gray-300 dark:border-gray-600 text-sm">
      <thead class="bg-gray-100 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-2">المنظمة</th>
          <th class="px-4 py-2">المشروع</th>
          <th class="px-4 py-2">المتطوع</th>
          <th class="px-4 py-2">الفعالية</th>
          <th class="px-4 py-2">المهارات المطلوبة</th>
          <th class="px-4 py-2">الموقع</th>
          <th class="px-4 py-2">الوقت المتاح</th>
          <th class="px-4 py-2">وقت الفعالية</th>
          <th class="px-4 py-2">حالة المطابقة</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in results" :key="index" class="border-t dark:border-gray-700">
          <td class="px-4 py-2">{{ result.organization }}</td>
          <td class="px-4 py-2">{{ result.project }}</td>
          <td class="px-4 py-2">{{ result.volunteerName }}</td>
          <td class="px-4 py-2">{{ result.eventName }}</td>
          <td class="px-4 py-2">{{ result.requiredSkills.join(', ') }}</td>
          <td class="px-4 py-2">{{ result.location }}</td>
          <td class="px-4 py-2">{{ result.availableTime }}</td>
          <td class="px-4 py-2">{{ result.eventTime }}</td>
          <td class="px-4 py-2 text-green-600 font-bold">{{ result.matchStatus }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="text-gray-500 dark:text-gray-400 mt-4">
    لا توجد نتائج مطابقة بعد. اضغط على "ابدأ المطابقة".
  </div>
</template>

<script setup>
defineProps({
  results: Array
})
</script>
