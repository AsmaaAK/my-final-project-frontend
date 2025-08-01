<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">إدارة المتطوعين</h1>

    <!-- نموذج التسجيل / التعديل -->
    <form @submit.prevent="handleSubmit" class="mb-6 bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
      <h2 class="text-xl font-semibold">{{ editing ? 'تعديل متطوع' : 'إضافة متطوع جديد' }}</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="form.name" placeholder="الاسم" required class="p-2 border rounded" />
        <input v-model.number="form.age" type="number" min="1" placeholder="العمر" required class="p-2 border rounded" />
        <input v-model="form.location" placeholder="الموقع" required class="p-2 border rounded" />
        <input v-model="form.availability" placeholder="الوقت المتاح" required class="p-2 border rounded" />
        <input
          v-model="form.skills"
          placeholder="المهارات (مفصولة بفواصل)"
          required
          class="p-2 border rounded col-span-full"
        />
      </div>

      <div class="flex space-x-4">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          {{ editing ? 'حفظ التعديلات' : 'إضافة' }}
        </button>
        <button v-if="editing" type="button" @click="cancelEdit" class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded">
          إلغاء
        </button>
      </div>
    </form>

    <!-- مدخلات الفلترة -->
    <div class="mb-4 flex flex-wrap gap-4">
      <input
        v-model="filters.location"
        placeholder="فلترة حسب الموقع"
        class="p-2 border rounded flex-1 min-w-[150px]"
      />
      <input
        v-model="filters.availability"
        placeholder="فلترة حسب الوقت المتاح"
        class="p-2 border rounded flex-1 min-w-[150px]"
      />
      <button @click="clearFilters" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">مسح الفلاتر</button>
    </div>

    <!-- أزرار التصدير -->
    <div class="flex justify-end space-x-4 mb-4">
      <button @click="exportCSV" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">تصدير CSV</button>
      <button @click="exportJSON" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">تصدير JSON</button>
    </div>

    <!-- جدول المتطوعين (استخدمنا filteredVolunteers) -->
    <table class="min-w-full bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
        <tr>
          <th class="p-3 text-right">#</th>
          <th class="p-3 text-right">الاسم</th>
          <th class="p-3 text-right">العمر</th>
          <th class="p-3 text-right">الموقع</th>
          <th class="p-3 text-right">الوقت المتاح</th>
          <th class="p-3 text-right">المهارات</th>
          <th class="p-3 text-right">إجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(vol, index) in filteredVolunteers"
          :key="vol.id"
          class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          @click="showDetails(vol)"
        >
          <td class="p-3">{{ index + 1 }}</td>
          <td class="p-3">{{ vol.name }}</td>
          <td class="p-3">{{ vol.age }}</td>
          <td class="p-3">{{ vol.location }}</td>
          <td class="p-3">{{ vol.availability }}</td>
          <td class="p-3">{{ vol.skills.join(', ') }}</td>
          <td class="p-3 space-x-2" @click.stop>
            <button @click="startEdit(vol)" class="text-blue-600 hover:underline">تعديل</button>
            <button @click="deleteVolunteer(vol.id)" class="text-red-600 hover:underline">حذف</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- مودال التفاصيل (كما في الكود السابق) -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        @click.self="closeModal"
      >
        <div class="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md w-full">
          <h3 class="text-xl font-bold mb-4">{{ selectedVolunteer.name }}</h3>
          <p><strong>العمر:</strong> {{ selectedVolunteer.age }}</p>
          <p><strong>الموقع:</strong> {{ selectedVolunteer.location }}</p>
          <p><strong>الوقت المتاح:</strong> {{ selectedVolunteer.availability }}</p>
          <p><strong>المهارات:</strong> {{ selectedVolunteer.skills.join(', ') }}</p>
          <button @click="closeModal" class="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            إغلاق
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const volunteers = ref([])
const editing = ref(false)
const selectedVolunteer = ref(null)
const showModal = ref(false)

const form = ref({
  id: null,
  name: '',
  age: '',
  location: '',
  availability: '',
  skills: ''
})

// فلترات الموقع والوقت
const filters = ref({
  location: '',
  availability: ''
})

onMounted(() => {
  volunteers.value = JSON.parse(localStorage.getItem('volunteers') || '[]')
})

// حفظ أو تعديل متطوع
function handleSubmit() {
  const skillsArr = form.value.skills.split(',').map(s => s.trim()).filter(Boolean)

  if (editing.value) {
    const index = volunteers.value.findIndex(v => v.id === form.value.id)
    if (index !== -1) {
      volunteers.value[index] = { ...form.value, skills: skillsArr }
    }
  } else {
    const newVolunteer = {
      id: Date.now(),
      name: form.value.name,
      age: form.value.age,
      location: form.value.location,
      availability: form.value.availability,
      skills: skillsArr
    }
    volunteers.value.push(newVolunteer)
  }

  localStorage.setItem('volunteers', JSON.stringify(volunteers.value))
  resetForm()
}

function startEdit(vol) {
  form.value = {
    id: vol.id,
    name: vol.name,
    age: vol.age,
    location: vol.location,
    availability: vol.availability,
    skills: vol.skills.join(', ')
  }
  editing.value = true
}

function deleteVolunteer(id) {
  if (!confirm('هل أنت متأكد من حذف المتطوع؟')) return
  volunteers.value = volunteers.value.filter(v => v.id !== id)
  localStorage.setItem('volunteers', JSON.stringify(volunteers.value))
  if (selectedVolunteer.value && selectedVolunteer.value.id === id) {
    closeModal()
  }
  if (editing.value && form.value.id === id) resetForm()
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  form.value = {
    id: null,
    name: '',
    age: '',
    location: '',
    availability: '',
    skills: ''
  }
  editing.value = false
}

function showDetails(vol) {
  selectedVolunteer.value = vol
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

// ** هنا الفلترة: قائمة المتطوعين المفلترة حسب الموقع والوقت المتاح **
const filteredVolunteers = computed(() => {
  return volunteers.value.filter(vol => {
    const locationMatch = filters.value.location
      ? vol.location.toLowerCase().includes(filters.value.location.toLowerCase())
      : true
    const availabilityMatch = filters.value.availability
      ? vol.availability.toLowerCase().includes(filters.value.availability.toLowerCase())
      : true
    return locationMatch && availabilityMatch
  })
})

// وظائف التصدير تبقى كما هي (CSV, JSON)

function exportCSV() {
  if (volunteers.value.length === 0) {
    alert('لا توجد بيانات لتصديرها')
    return
  }
  const headers = ['ID', 'الاسم', 'العمر', 'الموقع', 'الوقت المتاح', 'المهارات']
  const rows = volunteers.value.map(v => [
    v.id,
    `"${v.name.replace(/"/g, '""')}"`,
    v.age,
    `"${v.location.replace(/"/g, '""')}"`,
    `"${v.availability.replace(/"/g, '""')}"`,
    `"${v.skills.join(', ').replace(/"/g, '""')}"`
  ])
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'volunteers_export.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function exportJSON() {
  if (volunteers.value.length === 0) {
    alert('لا توجد بيانات لتصديرها')
    return
  }
  const jsonStr = JSON.stringify(volunteers.value, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'volunteers_export.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
