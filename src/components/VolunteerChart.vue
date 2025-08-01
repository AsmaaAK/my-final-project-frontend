<script setup>
import { computed } from 'vue';
import { ref, onMounted } from 'vue'
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

const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

// افتراضياً: لو عندك خاصية تاريخ التسجيل سجلتها في volunteers[i].registeredDate
// هنا فقط مثال وهمي يحسب عدد المتطوعين حسب الشهر الحالي
const monthlyCounts = computed(() => {
  // إذا ما عندك تواريخ فعلية، ممكن تحط بيانات ثابتة أو تحسب حسب شهر معين
  const counts = Array(12).fill(0)
  props.volunteers.forEach(vol => {
    // مثال: لو عندك تاريخ التسجيل في vol.registeredDate
    // const date = new Date(vol.registeredDate)
    // counts[date.getMonth()]++
    
    // هنا زيادة عشوائية للتوضيح فقط
    counts[Math.floor(Math.random() * 12)]++
  })
  return counts
})

const chartData = computed(() => ({
  labels: months,
  datasets: [
    {
      label: 'عدد المتطوعين شهرياً',
      data: monthlyCounts.value,
      backgroundColor: '#3b82f6',
      borderRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true, stepSize: 1 },
  },
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded shadow p-4 h-[350px]">
    <h2 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
      عدد المتطوعين شهرياً
    </h2>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
