<script setup>
import { ref, onMounted } from 'vue'
import SkillChart from '@/components/SkillChart.vue'
import VolunteerChart from '@/components/volunteerChart.vue'
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
  <div class="p-6 space-y-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">{{ $t('reports.title') }}</h1>

    <section>
      <SkillChart :volunteers="volunteers" />
    </section>

    <section>
      <VolunteerChart :volunteers="volunteers" />
    </section>

    <section>
      <LocationChart :volunteers="volunteers" />
    </section>

    <section>
      <EventChart :events="events" />
    </section>
  </div>
</template>
