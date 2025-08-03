<script setup>
import { ref, onMounted } from 'vue'
import SkillChart from '@/components/SkillChart.vue'
import VolunteerChart from '@/components/VolunteerChart.vue'
import LocationChart from '@/components/LocationChart.vue'
import EventChart from '@/components/EventChart.vue'

const volunteers = ref([])
const events = ref([])

onMounted(() => {
  const volunteersData = localStorage.getItem('volunteers')
  volunteers.value = volunteersData ? JSON.parse(volunteersData) : []

  const eventsData = localStorage.getItem('events')
  events.value = eventsData ? JSON.parse(eventsData) : []
})
</script>

<template>
  <div class="p-4 md:p-6 space-y-6 md:space-y-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <h1 class="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-8">
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      <section class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <SkillChart :volunteers="volunteers" />
      </section>

      <section class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow">
        <VolunteerChart :volunteers="volunteers" />
      </section>

      <section class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow lg:col-span-2">
      <LocationChart :volunteers="volunteers" />
      </section>

      <section class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow lg:col-span-2">
        <EventChart :events="events" />
      </section>
    </div>
  </div>
</template>