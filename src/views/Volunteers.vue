<template>
  <div class="p-4 md:p-6 max-w-5xl mx-auto">
    <h1 class="text-xl md:text-2xl font-bold mb-4 md:mb-6">إدارة المتطوعين</h1>

    <!-- نموذج التسجيل / التعديل -->
    <form @submit.prevent="handleSubmit" class="mb-4 md:mb-6 bg-white dark:bg-gray-800 p-4 md:p-6 rounded shadow space-y-3 md:space-y-4">
      <h2 class="text-lg md:text-xl font-semibold">{{ editing ? 'تعديل متطوع' : 'إضافة متطوع جديد' }}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <input v-model="form.name" placeholder="الاسم" required class="p-2 border rounded w-full" />
        <input v-model.number="form.age" type="number" min="1" placeholder="العمر" required class="p-2 border rounded w-full" />
        <input v-model="form.location" placeholder="الموقع" required class="p-2 border rounded w-full" />
        <input v-model="form.availability" placeholder="الوقت المتاح" required class="p-2 border rounded w-full" />
        
        <!-- حقل البريد الإلكتروني -->
        <div class="sm:col-span-2 lg:col-span-3">
          <input
            v-model="form.email"
            type="email"
            placeholder="البريد الإلكتروني"
            @blur="validateEmail"
            required
            class="p-2 border rounded w-full"
          />
          <p v-if="emailError" class="text-red-600 text-xs md:text-sm mt-1">{{ emailError }}</p>
        </div>
        
        <input
          v-model="form.skills"
          placeholder="المهارات (مفصولة بفواصل)"
          required
          class="p-2 border rounded sm:col-span-2 lg:col-span-3 w-full"
        />
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

    <!-- مدخلات الفلترة -->
    <div class="mb-4 flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4">
      <input
        v-model="filters.location"
        placeholder="فلترة حسب الموقع"
        class="p-2 border rounded flex-grow min-w-[150px]"
      />
      <input
        v-model="filters.availability"
        placeholder="فلترة حسب الوقت المتاح"
        class="p-2 border rounded flex-grow min-w-[150px]"
      />
      <button @click="clearFilters" class="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm md:text-base whitespace-nowrap">
        مسح الفلاتر
      </button>
    </div>

    <!-- أزرار التصدير -->
    <div class="flex flex-col sm:flex-row justify-end gap-2 md:gap-4 mb-4">
      <button @click="exportCSV" class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm md:text-base">
        تصدير CSV
      </button>
      <button @click="exportJSON" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm md:text-base">
        تصدير JSON
      </button>
    </div>

    <!-- جدول المتطوعين -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
          <tr>
            <th class="p-2 md:p-3 text-right whitespace-nowrap">#</th>
            <th class="p-2 md:p-3 text-right whitespace-nowrap">الاسم</th>
            <th class="p-2 md:p-3 text-right whitespace-nowrap">العمر</th>
            <th class="p-2 md:p-3 text-right whitespace-nowrap hidden sm:table-cell">الموقع</th>
            <th class="p-2 md:p-3 text-right whitespace-nowrap hidden md:table-cell">الوقت المتاح</th>
            <th class="p-2 md:p-3 text-right whitespace-nowrap hidden lg:table-cell">البريد الإلكتروني</th>
            <th class="p-2 md:p-3 text-right whitespace-nowrap hidden xl:table-cell">المهارات</th>
            <th class="p-2 md:p-3 text-right whitespace-nowrap">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(vol, index) in filteredVolunteers"
            :key="vol.id"
            class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            @click="showDetails(vol)"
          >
            <td class="p-2 md:p-3">{{ index + 1 }}</td>
            <td class="p-2 md:p-3">{{ vol.name }}</td>
            <td class="p-2 md:p-3">{{ vol.age }}</td>
            <td class="p-2 md:p-3 hidden sm:table-cell">{{ vol.location }}</td>
            <td class="p-2 md:p-3 hidden md:table-cell">{{ vol.availability }}</td>
            <td class="p-2 md:p-3 hidden lg:table-cell">{{ vol.email }}</td>
            <td class="p-2 md:p-3 hidden xl:table-cell">{{ vol.skills.join(', ') }}</td>
            <td class="p-2 md:p-3 space-x-1 md:space-x-2" @click.stop>
              <button @click="startEdit(vol)" class="text-blue-600 hover:underline text-sm md:text-base">تعديل</button>
              <button @click="deleteVolunteer(vol.id)" class="text-red-600 hover:underline text-sm md:text-base">حذف</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- مودال التفاصيل -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded shadow w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg md:text-xl font-bold mb-3 md:mb-4">{{ selectedVolunteer.name }}</h3>
          <p class="mb-2 text-center"><strong>العمر:</strong> {{ selectedVolunteer.age }}</p>
          <p class="mb-2 text-cente"><strong>الموقع:</strong> {{ selectedVolunteer.location }}</p>
          <p class="mb-2 text-cente"><strong>الوقت المتاح:</strong> {{ selectedVolunteer.availability }}</p>
          <p class="mb-2 text-cente"><strong>البريد الإلكتروني:</strong> {{ selectedVolunteer.email }}</p>
          <p class="mb-2 text-cente"><strong>المهارات:</strong> {{ selectedVolunteer.skills.join(', ') }}</p>
          <button @click="closeModal" class="mt-4 md:mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm md:text-base">
            إغلاق
          </button>
        </div      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const volunteers = ref([])
const editing = ref(false)
const selectedVolunteer = ref(null)
const showModal = ref(false)
const emailError = ref('')

const form = ref({
  id: null,
  name: '',
  age: '',
  location: '',
  availability: '',
  email: '',
  skills: ''
})

const filters = ref({
  location: '',
  availability: ''
})

onMounted(() => {
  volunteers.value = JSON.parse(localStorage.getItem('volunteers') || '[]')
})

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  emailError.value = emailRegex.test(form.value.email) ? '' : 'البريد الإلكتروني غير صالح'
}

function handleSubmit() {
  validateEmail()
  if (emailError.value) {
    alert('الرجاء إدخال بريد إلكتروني صالح')
    return
  }

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
      email: form.value.email,
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
    email: vol.email,
    skills: vol.skills.join(', ')
  }
  editing.value = true
  emailError.value = ''
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
    email: '',
    skills: ''
  }
  editing.value = false
  emailError.value = ''
}

function showDetails(vol) {
  selectedVolunteer.value = vol
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

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

function clearFilters() {
  filters.value.location = ''
  filters.value.availability = ''
}

function exportCSV() {
  if (volunteers.value.length === 0) {
    alert('لا توجد بيانات لتصديرها')
    return
  }
  const headers = ['ID', 'الاسم', 'العمر', 'الموقع', 'الوقت المتاح', 'البريد الإلكتروني', 'المهارات']
  const rows = volunteers.value.map(v => [
    v.id,
    `"${v.name.replace(/"/g, '""')}"`,
    v.age,
    `"${v.location.replace(/"/g, '""')}"`,
    `"${v.availability.replace(/"/g, '""')}"`,
    `"${v.email.replace(/"/g, '""')}"`,
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

@media (max-width: 640px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>