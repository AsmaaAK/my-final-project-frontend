<template>
  <div class="space-y-4"> 
    <LanguageSwitcher />
    <Navbar/>
  </div>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">لوحة المعلومات - الرسوم البيانية</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">لوحة البيانات</h1>
      <VolunteerChart />
       </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-4">عدد المتطوعين حسب الموقع</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        
          <VolunteerChart :volunteers="volunteers" />
          
          <EventsChart :events="events" />
        </div>
        <BarChart :chart-data="chartData" :chart-options="chartOptions" />
      </div>
    </div>
  </div>
  <SkillChart :volunteers="volunteerList" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import volunteers from '../assets/volunteers.json'
import events from '../assets/events.json'
import EventsChart from '../components/EventChart.vue'
import VolunteerChart from '../components/volunteerChart.vue'
import SkillChart from '../components/SkillChart.vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const BarChart = Bar

const chartData = ref({
  labels: [],
  datasets: [{
    label: 'عدد المتطوعين',
    backgroundColor: '#3b82f6',
    data: []
  }]
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'إحصائية المتطوعين حسب الموقع' }
  }
})

onMounted(() => {
  const raw = JSON.parse(localStorage.getItem('volunteers') || '[]')
  const grouped = raw.reduce((acc, v) => {
    acc[v.location] = (acc[v.location] || 0) + 1
    return acc
  }, {})

  chartData.value.labels = Object.keys(grouped)
  chartData.value.datasets[0].data = Object.values(grouped)
})
</script>