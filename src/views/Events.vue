<template>
  <div class="p-6 max-w-3xl mx-auto">
    <!-- نموذج الإضافة/التعديل -->
    <h1 class="text-2xl font-bold mb-6">
      {{ editing ? 'تعديل الفعالية' : 'إضافة فعالية جديدة' }}
    </h1>
    <form @submit.prevent="handleSubmit" class="space-y-4 mb=6 bg-white dark:bg-gray-800 p-6 rounded shadow mb-8">
      <input v-model="form.title" class="w-full p-2 rounded border" placeholder="اسم الفعالية" required />
      <input v-model="form.description" class="w-full p-2 rounded border" placeholder="الوصف" required />
      <input v-model="form.date" type="date" class="w-full p-2 rounded border" required />
      <input v-model="form.location" class="w-full p-2 rounded border" placeholder="الموقع" required />
      <input v-model="form.skills" class="w-full p-2 rounded border" placeholder="المهارات المطلوبة (بفواصل)" required />
      
      <div class="flex space-x-4">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {{ editing ? 'حفظ التعديلات' : 'إضافة' }}
        </button>
        <button v-if="editing" type="button" @click="cancelEdit" class="text-gray-500">إلغاء</button>
      </div>
    </form>

    <!-- فلترة + أزرار التصدير -->
    <div
      class="mb-6 bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-wrap md:flex-nowrap md:space-x-4 space-y-4 md:space-y-0 items-center"
    >
      <input
        v-model="filters.location"
        type="text"
        placeholder="فلترة حسب الموقع"
        class="flex-1 p-2 rounded border"
      />
      <input
        v-model="filters.fromDate"
        type="date"
        placeholder="فلترة حسب التاريخ من"
        class="flex-1 p-2 rounded border"
      />
      <button @click="clearFilters" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
        مسح الفلاتر
      </button>

      <!-- أزرار التصدير -->
      <button
        @click="exportCSV"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded whitespace-nowrap"
      >
        تصدير CSV
      </button>
      <button
        @click="exportJSON"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded whitespace-nowrap"
      >
        تصدير JSON
      </button>
    </div>

    <!-- عرض الفعاليات -->
 <div v-if="filteredEvents.length === 0" class="text-gray-500 text-center">لا توجد فعاليات تطابق الفلاتر</div>

<!-- عرض الفعاليات كجدول -->
<div v-if="filteredEvents.length === 0" class="text-gray-500 text-center">
  لا توجد فعاليات تطابق الفلاتر
</div>

<table v-else class="min-w-full table-auto bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
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
        @click="openEventModal(event)">

      <td class="p-3">{{ index + 1 }}</td>
      <td class="p-3">{{ event.title }}</td>
      <td class="p-3">{{ event.description }}</td>
      <td class="p-3">{{ event.date }}</td>
      <td class="p-3">{{ event.location }}</td>
      <td class="p-3">{{ event.requiredSkills.join(', ') }}</td>
      <td class="p-3 space-x-2">
        <button @click.stop="startEdit(event)" class="text-blue-600 hover:underline">تعديل</button>
        <button @click.stop="deleteEvent(event.id)" class="text-red-600 hover:underline">حذف</button>
      </td>
    </tr>
  </tbody>
</table>
<EventCard :event="selectedEvent" :visible="showModal" @close="showModal = false" />
</div>
</template>

<script setup>
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
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

// فلترات البحث
const filters = ref({
  location: '',
  fromDate: ''
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
    const matchDate = filters.value.fromDate
      ? event.date >= filters.value.fromDate
      : true
    return matchLocation && matchDate
  })
})

// مسح الفلاتر
const clearFilters = () => {
  filters.value.location = ''
  filters.value.fromDate = ''
}
// عرض بطاقة معلومات الفعالية
const selectedEvent = ref(null)
const showModal = ref(false)

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
