<template>
  <div class="p-4 md:p-6 max-w-5xl mx-auto"> 
    <!-- نموذج الإضافة/التعديل -->
    <h1 class="text-xl md:text-2xl font-bold mb-4 md:mb-6">
      ادارة الفعاليات 
    </h1>
    <form @submit.prevent="handleSubmit" class="mb-4 md:mb-6 bg-white dark:bg-gray-800 p-4 md:p-6 rounded shadow space-y-3 md:space-y-4">
      <h2 class="text-lg md:text-xl font-semibold">{{ editing ? 'تعديل الفعالية' : 'إضافة فعالية جديدة' }}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <input v-model="form.title" placeholder="اسم الفعالية" required class="p-2 border rounded w-full" />
        <input v-model="form.description" placeholder="الوصف" required class="p-2 border rounded w-full" />
        <input v-model="form.date" placeholder="وقت الفعالية" required class="p-2 border rounded w-full" />
        <input v-model="form.location" placeholder="الموقع" required class="p-2 border rounded w-full" />
        <input v-model="form.skills" placeholder="المهارات المطلوبة (مفصولة بفواصل)" required class="p-2 border rounded sm:col-span-2 lg:col-span-3 w-full" />
      </div>

      <div class="flex flex-wrap gap-2 md:gap-4">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm md:text-base">
          {{ editing ? 'حفظ التعديلات' : 'إضافة' }}
        </button>
        <button v-if="editing" type="button" @click="cancelEdit" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm md:text-base">
          إلغاء
        </button>
      </div>
    </form>

    <!-- فلترة + أزرار التصدير -->
    <div class=" bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col sm:flex-row justify-end gap-2 md:gap-4 mb-4 items-center">
      <input
        v-model="filters.location" 
        type="text"
        placeholder="فلترة حسب الموقع"
        class="flex-1 min-w-[150px] p-2 rounded border"
      />
      <input
        v-model="filters.availability"
        placeholder="فلترة حسب الوقت "
        class="flex-1 min-w-[150px] p-2 rounded border"
      />
      <div class="flex gap-3 w-full sm:w-auto">
        <button @click="clearFilters" class="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500 text-sm md:text-base whitespace-nowrap">
          مسح الفلاتر
        </button>
        <button
          @click="exportCSV"
          class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded whitespace-nowrap text-sm md:text-base"
        >
          تصدير CSV
        </button>
        <button
          @click="exportJSON"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded whitespace-nowrap text-sm md:text-base"
        >
          تصدير JSON
        </button>
      </div>
    </div>

    <!-- عرض الفعاليات -->
    <div v-if="filteredEvents.length === 0" class="text-gray-500 text-center p-4 bg-white dark:bg-gray-800 rounded shadow">
      لا توجد فعاليات تطابق الفلاتر
    </div>

    <!-- جدول الفعاليات للشاشات الكبيرة -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
          <tr>
            <th class="p-3 text-right">#</th>
            <th class="p-3 text-right">العنوان</th>
            <th class="p-3 text-right">الوصف</th>
            <th class="p-3 text-right">التاريخ</th>
            <th class="p-3 text-right">الموقع</th>
            <th class="p-3 text-right">المهارات</th>
            <th class="p-3 text-right">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(event, index) in filteredEvents"
            :key="event.id"
            class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            @click="openEventModal(event)"
          >
            <td class="p-3">{{ index + 1 }}</td>
            <td class="p-3">{{ event.title }}</td>
            <td class="p-3">{{ event.description }}</td>
            <td class="p-3">{{ event.date }}</td>
            <td class="p-3">{{ event.location }}</td>
            <td class="p-3">{{ event.requiredSkills.join(', ') }}</td>
            <td class="p-3 space-x-2" @click.stop>
              <button @click.stop="startEdit(event)" class="text-blue-600 hover:underline">تعديل</button>
              <button @click.stop="deleteEvent(event.id)" class="text-red-600 hover:underline">حذف</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- عرض بطاقات الفعاليات للشاشات الصغيرة -->
    <div class="md:hidden space-y-4">
      <div 
        v-for="(event, index) in filteredEvents"
        :key="event.id"
        class="bg-white dark:bg-gray-800 p-4 rounded shadow cursor-pointer"
        @click="openEventModal(event)"
      >
        <div class="flex justify-between items-start">
          <h3 class="font-bold text-lg">{{ event.title }}</h3>
          <span class="text-gray-500">{{ index + 1 }}</span>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mt-2">{{ event.description }}</p>
        <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span class="font-medium">التاريخ:</span>
            <span>{{ event.date }}</span>
          </div>
          <div>
            <span class="font-medium">الموقع:</span>
            <span>{{ event.location }}</span>
          </div>
          <div class="col-span-2">
            <span class="font-medium">المهارات:</span>
            <span>{{ event.requiredSkills.join(', ') }}</span>
          </div>
        </div>
        <div class="mt-3 flex space-x-3" @click.stop>
          <button @click.stop="startEdit(event)" class="text-blue-600 hover:underline text-sm">تعديل</button>
          <button @click.stop="deleteEvent(event.id)" class="text-red-600 hover:underline text-sm">حذف</button>
        </div>
      </div>
    </div>

    <!-- مودال عرض الفعالية -->
    <EventCard :event="selectedEvent" :visible="showModal" @close="showModal = false" />
  </div>
</template>

<script setup>
import EventCard from '../components/EventCard.vue'
import { ref, computed, onMounted } from 'vue'

// البيانات
const form = ref({
  title: '',
  description: '',
  date: '',
  location: '',
  skills: ''
})

const events = ref([])
const editing = ref(false)
const editId = ref(null)
const selectedEvent = ref(null)
const showModal = ref(false)

// فلترات البحث
const filters = ref({
  location: '',
  availability: ''
})

// تحميل البيانات من localStorage
onMounted(() => {
  const stored = JSON.parse(localStorage.getItem('events') || '[]')
  events.value = stored
})

// إضافة أو تعديل فعالية
const handleSubmit = () => {
  const formattedSkills = form.value.skills.split(',').map(s => s.trim())

  if (editing.value && editId.value !== null) {
    // تعديل موجود
    const index = events.value.findIndex(e => e.id === editId.value)
    if (index !== -1) {
      events.value[index] = {
        id: editId.value,
        title: form.value.title,
        description: form.value.description,
        date: form.value.date,
        location: form.value.location,
        requiredSkills: formattedSkills
      }
    }
  } else {
    // إضافة جديد
    const newEvent = {
      id: Date.now(),
      title: form.value.title,
      description: form.value.description,
      date: form.value.date,
      location: form.value.location,
      requiredSkills: formattedSkills
    }
    events.value.push(newEvent)
  }

  localStorage.setItem('events', JSON.stringify(events.value))
  resetForm()
}

// تعبئة النموذج عند التعديل
const startEdit = (event) => {
  form.value = {
    title: event.title,
    description: event.description,
    date: event.date,
    location: event.location,
    skills: event.requiredSkills.join(', ')
  }
  editing.value = true
  editId.value = event.id
}

// حذف فعالية
const deleteEvent = (id) => {
  events.value = events.value.filter(e => e.id !== id)
  localStorage.setItem('events', JSON.stringify(events.value))

  if (editing.value && editId.value === id) {
    resetForm()
  }
}

// إلغاء التعديل
const cancelEdit = () => {
  resetForm()
}

// إعادة تعيين النموذج
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    date: '',
    location: '',
    skills: ''
  }
  editing.value = false
  editId.value = null
}

// فلترة قائمة الفعاليات حسب الموقع والتاريخ
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchLocation = filters.value.location
      ? event.location.toLowerCase().includes(filters.value.location.toLowerCase())
      : true
    const matchDate = filters.value.availability
      ? event.date >= filters.value.availability
      : true
    return matchLocation && matchDate
  })
})

// مسح الفلاتر
const clearFilters = () => {
  filters.value.location = ''
  filters.value.availability = ''
}

// عرض بطاقة معلومات الفعالية
const openEventModal = (event) => {
  selectedEvent.value = event
  showModal.value = true
}

// تصدير CSV
const exportCSV = () => {
  if (events.value.length === 0) {
    alert('لا توجد فعاليات لتصديرها')
    return
  }

  const headers = ['ID', 'العنوان', 'الوصف', 'التاريخ', 'الموقع', 'المهارات المطلوبة']
  const rows = events.value.map(ev => [
    ev.id,
    `"${ev.title.replace(/"/g, '""')}"`,
    `"${ev.description.replace(/"/g, '""')}"`,
    ev.date,
    `"${ev.location.replace(/"/g, '""')}"`,
    `"${ev.requiredSkills.join(', ').replace(/"/g, '""')}"`
  ])

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'events_export.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// تصدير JSON
const exportJSON = () => {
  if (events.value.length === 0) {
    alert('لا توجد فعاليات لتصديرها')
    return
  }

  const jsonStr = JSON.stringify(events.value, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'events_export.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<style>

@media (max-width: 767px) {
  table {
    display: none;
  }
}
</style>