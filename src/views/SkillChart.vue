<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">تحليل المهارات الشائعة</h1>
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-4">أكثر المهارات تكرارًا بين المتطوعين</h2>
      <BarChart :chart-data="chartData" :chart-options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const BarChart = Bar

const chartData = ref({ labels: [], datasets: [] })
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'توزيع المهارات بين المتطوعين' }
  }
})

onMounted(() => {
  const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]')
  const skillsCount = {}

  volunteers.forEach(vol => {
    vol.skills.forEach(skill => {
      const key = skill.trim()
      skillsCount[key] = (skillsCount[key] || 0) + 1
    })
  })

  const labels = Object.keys(skillsCount)
  const data = Object.values(skillsCount)

  chartData.value = {
    labels,
    datasets: [
      {
        label: 'عدد المتطوعين',
        backgroundColor: '#10b981',
        data
      }
    ]
  }
})
</script>