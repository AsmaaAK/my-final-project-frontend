<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  volunteers: {
    type: Array,
    required: true,
    default: () => [],
  },
})

// حساب عدد المتطوعين حسب الموقع
const locationCounts = computed(() => {
  const counts = {}
  props.volunteers.forEach(v => {
    counts[v.location] = (counts[v.location] || 0) + 1
  })
  return counts
})

// ألوان مميزة وقابلة للتكرار حسب عدد المواقع
const colors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#e879f9'
]

// تجهيز بيانات المخطط مع عرض النسب بجانب العدد
const totalVolunteers = computed(() =>
  Object.values(locationCounts.value).reduce((sum, val) => sum + val, 0)
)

const chartData = computed(() => {
  const labels = Object.keys(locationCounts.value)
  const dataValues = Object.values(locationCounts.value)
  const backgroundColors = labels.map((_, idx) => colors[idx % colors.length])

  return {
    labels,
    datasets: [
      {
        label: 'عدد المتطوعين',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderRadius: 6,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        label: context => {
          const value = context.parsed.y || 0
          const percent = ((value / totalVolunteers.value) * 100).toFixed(1)
          return `${value} (${percent}%)`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
}
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded shadow p-4 h-[350px] flex flex-col"
  >
    <h2
      class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200"
    >
      عدد المتطوعين حسب الموقع
    </h2>
    <div class="flex-1 relative">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
