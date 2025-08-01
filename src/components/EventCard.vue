<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900">&times;</button>
      <h2 class="text-xl font-bold mb-2">{{ event.title }}</h2>
      <p class="mb-2">{{ event.description }}</p>
      <p class="text-sm text-gray-500 mb-2">الموقع: {{ event.location }}</p>
      <p class="text-sm text-gray-500 mb-4">التاريخ: {{ event.date }}</p>
      <p><strong>المهارات المطلوبة:</strong> {{ event.requiredSkills.join(', ') }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  event: Object,
  visible: Boolean
})
</script>
