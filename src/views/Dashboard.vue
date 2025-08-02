<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- العنوان الرئيسي -->
    <h1 class="text-2xl sm:text-3xl font-bold mb-8 text-center md:text-right">
      لوحة المعلومات - الرسوم البيانية
    </h1>

    <!-- قسمين رئيسيين -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- لوحة البيانات -->
      <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
        <h2 class="text-lg sm:text-xl font-semibold mb-4">لوحة البيانات</h2>
        <VolunteerChart />
      </div>

      <!-- إحصائيات المواقع والفعاليات -->
      <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
        <h2 class="text-lg sm:text-xl font-semibold mb-4">عدد المتطوعين حسب الموقع</h2>

        <!-- مخططات صغيرة داخل شبكة -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <VolunteerChart :volunteers="volunteers" />
          <EventsChart :events="events" />
        </div>

        <!-- شريط بياني -->
        <BarChart :chart-data="chartData" :chart-options="chartOptions" />
      </div>
    </div>

    <!-- رسم مهارات المتطوعين -->
<div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md w-full overflow-auto">
  <h2 class="text-lg sm:text-xl font-semibold mb-4">عدد المتطوعين حسب الموقع</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div class="w-full h-full">
      <VolunteerChart :volunteers="volunteers" />
    </div>
    <div class="w-full h-full">
      <EventsChart :events="events" />
    </div>
  </div>
</div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import volunteers from '../assets/volunteers.json'
import events from '../assets/events.json'
import EventsChart from '../components/EventChart.vue'
import VolunteerChart from '../components/VolunteerChart.vue'
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