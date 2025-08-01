<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  volunteers: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const skillCounts = computed(() => {
  const counts = {}
  props.volunteers.forEach(v => {
    v.skills.forEach(skill => {
      counts[skill] = (counts[skill] || 0) + 1
    })
  })
  return counts
})

const colors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#e879f9'
]

const chartData = computed(() => {
  const labels = Object.keys(skillCounts.value)
  const dataValues = Object.values(skillCounts.value)
  const backgroundColors = labels.map((_, idx) => colors[idx % colors.length])
  return {
    labels,
    datasets: [
      {
        label: 'توزيع المهارات',
        data: dataValues,
        backgroundColor: backgroundColors,
        hoverOffset: 30,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' },
  },
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded shadow p-4 h-[350px]">
    <h2 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
      توزيع المهارات بين المتطوعين
    </h2>
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>
