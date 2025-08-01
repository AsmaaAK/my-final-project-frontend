<template>
  <div class="bg-white dark:bg-gray-800 rounded shadow p-4">
    <h2 class="text-lg font-semibold mb-2">عدد الفعاليات حسب الموقع</h2>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { computed } from 'vue'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props= defineProps({
  events: {
    type: Array,
    required: true
  }
})

// const props = defineProps(['events'])

// استخراج عدد الفعاليات لكل موقع
const chartData = computed(() => {
  const locationCount = {}

  props.events.forEach(event => {
    const location = event.location
    locationCount[location] = (locationCount[location] || 0) + 1
  })

  return {
    labels: Object.keys(locationCount),
    datasets: [
      {
        label: 'عدد الفعاليات',
        data: Object.values(locationCount),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<style scoped>
div {
  height: 300px;
}
</style>
