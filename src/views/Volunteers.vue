<template>
  <div class="p-4 md:p-6 max-w-5xl mx-auto">
    <h1 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center md:text-right">إدارة المتطوعين</h1>

    <!-- نموذج التسجيل / التعديل -->
    <form @submit.prevent="handleSubmit" class="mb-4 md:mb-6 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow space-y-3 md:space-y-4">
      <h2 class="text-lg md:text-xl font-semibold text-center md:text-right">{{ editing ? 'تعديل متطوع' : 'إضافة متطوع جديد' }}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div>
          <label class="block mb-1 text-sm text-gray-600 dark:text-gray-300">الاسم</label>
          <input v-model="form.name" placeholder="أدخل الاسم" required class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block mb-1 text-sm text-gray-600 dark:text-gray-300">العمر</label>
          <input v-model.number="form.age" type="number" min="1" placeholder="أدخل العمر" required class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block mb-1 text-sm text-gray-600 dark:text-gray-300">الموقع</label>
          <input v-model="form.location" placeholder="أدخل الموقع" required class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label class="block mb-1 text-sm text-gray-600 dark:text-gray-300">الوقت المتاح</label>
          <input v-model="form.availability" placeholder="أدخل الوقت المتاح" required class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        </div>
        
        <div class="sm:col-span-2 lg:col-span-3">
          <label class="block mb-1 text-sm text-gray-600 dark:text-gray-300">البريد الإلكتروني</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="أدخل البريد الإلكتروني"
            @blur="validateEmail"
            required
            class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <p v-if="emailError" class="text-red-600 text-xs md:text-sm mt-1">{{ emailError }}</p>
        </div>
        
        <div class="sm:col-span-2 lg:col-span-3">
          <label class="block mb-1 text-sm text-gray-600 dark:text-gray-300">المهارات</label>
          <input
            v-model="form.skills"
            placeholder="أدخل المهارات (مفصولة بفواصل)"
            required
            class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-2 md:gap-4 justify-center sm:col-span-2 lg:col-span-3 md:justify-start">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm md:text-base transition-colors">
          {{ editing ? 'حفظ التعديلات' : 'إضافة' }}
        </button>
        <button v-if="editing" type="button" @click="cancelEdit" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm md:text-base transition-colors">
          إلغاء
        </button>
      </div>
    </form>

    <!-- فلترة وأزرار التصدير -->
    <div class="mb-4 flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4 items-center">
      <div class="flex-1 min-w-[150px]">
        <label class="block mb-1 text-sm text-gray-600 dark:text-gray-300">فلترة حسب الموقع</label>
        <input
          v-model="filters.location"
          placeholder="ابحث بالموقع"
          class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <div class="flex-1 min-w-[150px]">
        <label class="block mb-1 text-sm text-gray-600 dark:text-gray-300">فلترة حسب الوقت</label>
        <input
          v-model="filters.availability"
          placeholder="ابحث بالوقت المتاح"
          class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <button @click="clearFilters" class="bg-gray-400 sm:col-span-2 lg:col-span-3 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm md:text-base whitespace-nowrap transition-colors mt-2 sm:mt-6">
        مسح الفلاتر
      </button>
      
      <div class="flex gap-2 md:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
        <button @click="exportCSV" class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded sm:col-span-2 lg:col-span-3 text-sm md:text-base whitespace-nowrap transition-colors">
          <i class="fas fa-file-csv mr-1"></i> تصدير CSV
        </button>
        <button @click="exportJSON" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm md:text-base whitespace-nowrap transition-colors">
          <i class="fas fa-file-code mr-1"></i> تصدير JSON
        </button>
      </div>
    </div>

    <!-- عرض المتطوعين -->
    <div v-if="filteredVolunteers.length === 0" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
      <p class="text-gray-500 dark:text-gray-400">لا توجد نتائج مطابقة للبحث</p>
    </div>

    <!-- عرض الجدول للشاشات الكبيرة -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="p-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">#</th>
            <th class="p-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">الاسم</th>
            <th class="p-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">العمر</th>
            <th class="p-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">الموقع</th>
            <th class="p-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">الوقت المتاح</th>
            <th class="p-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">البريد الإلكتروني</th>
            <th class="p-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">المهارات</th>
            <th class="p-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(vol, index) in filteredVolunteers"
            :key="vol.id"
            class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <td class="p-3 text-sm">{{ index + 1 }}</td>
            <td class="p-3 text-sm">{{ vol.name }}</td>
            <td class="p-3 text-sm">{{ vol.age }}</td>
            <td class="p-3 text-sm">{{ vol.location }}</td>
            <td class="p-3 text-sm">{{ vol.availability }}</td>
            <td class="p-3 text-sm">{{ vol.email }}</td>
            <td class="p-3 text-sm">{{ vol.skills.join(', ') }}</td>
            <td class="p-3 text-sm space-x-2">
              <button @click.stop="startEdit(vol)" class="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 transition-colors">
                <i class="fas fa-edit"></i>
              </button>
              <button @click.stop="deleteVolunteer(vol.id)" class="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors">
                <i class="fas fa-trash-alt"></i>
              </button>
              <button @click.stop="showDetails(vol)" class="text-green-600 hover:text-green-800 dark:hover:text-green-400 transition-colors md:hidden">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- عرض البطاقات للجوال -->
    <div class="md:hidden space-y-4">
      <div 
        v-for="(vol, index) in filteredVolunteers"
        :key="vol.id"
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        @click="showDetails(vol)"
      >
        <div class="flex justify-between items-start">
          <h3 class="font-bold text-lg">{{ vol.name }}</h3>
          <span class="text-gray-500 text-sm">#{{ index + 1 }}</span>
        </div>
        
        <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">العمر:</span>
            <span>{{ vol.age }}</span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">الموقع:</span>
            <span>{{ vol.location }}</span>
          </div>
          <div class="col-span-2">
            <span class="text-gray-500 dark:text-gray-400">الوقت المتاح:</span>
            <span>{{ vol.availability }}</span>
          </div>
          <div class="col-span-2">
            <span class="text-gray-500 dark:text-gray-400">المهارات:</span>
            <span class="truncate">{{ vol.skills.join(', ') }}</span>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end space-x-3" @click.stop>
          <button @click.stop="startEdit(vol)" class="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400">
            <i class="fas fa-edit mr-1"></i> تعديل
          </button>
          <button @click.stop="deleteVolunteer(vol.id)" class="text-red-600 hover:text-red-800 dark:hover:text-red-400">
            <i class="fas fa-trash-alt mr-1"></i> حذف
          </button>
        </div>
      </div>
    </div>

    <!-- مودال التفاصيل -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg md:text-xl font-bold">{{ selectedVolunteer.name }}</h3>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between border-b pb-2">
              <span class="text-gray-600 dark:text-gray-300">العمر:</span>
              <span>{{ selectedVolunteer.age }}</span>
            </div>
            <div class="flex justify-between border-b pb-2">
              <span class="text-gray-600 dark:text-gray-300">الموقع:</span>
              <span>{{ selectedVolunteer.location }}</span>
            </div>
            <div class="flex justify-between border-b pb-2">
              <span class="text-gray-600 dark:text-gray-300">الوقت المتاح:</span>
              <span>{{ selectedVolunteer.availability }}</span>
            </div>
            <div class="flex justify-between border-b pb-2">
              <span class="text-gray-600 dark:text-gray-300">البريد الإلكتروني:</span>
              <span>{{ selectedVolunteer.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">المهارات:</span>
              <span class="text-right">{{ selectedVolunteer.skills.join(', ') }}</span>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="closeModal" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm md:text-base transition-colors">
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import { useToast } from 'vue-toastification'

// const toast = useToast()
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
  const savedVolunteers = localStorage.getItem('volunteers')
  volunteers.value = savedVolunteers ? JSON.parse(savedVolunteers) : []
})

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  emailError.value = emailRegex.test(form.value.email) ? '' : 'البريد الإلكتروني غير صالح'
}

function handleSubmit() {
  validateEmail()
  if (emailError.value) {
    toast.error('الرجاء إدخال بريد إلكتروني صالح')
    return
  }

  const skillsArr = form.value.skills.split(',').map(s => s.trim()).filter(Boolean)

  if (editing.value) {
    const index = volunteers.value.findIndex(v => v.id === form.value.id)
    if (index !== -1) {
      volunteers.value[index] = { ...form.value, skills: skillsArr }
      toast.success('تم تحديث بيانات المتطوع بنجاح')
    }
  } else {
    const newVolunteer = {
      id: Date.now(),
      ...form.value,
      skills: skillsArr
    }
    volunteers.value.push(newVolunteer)
    toast.success('تم إضافة متطوع جديد بنجاح')
  }

  localStorage.setItem('volunteers', JSON.stringify(volunteers.value))
  resetForm()
}

function startEdit(vol) {
  form.value = {
    ...vol,
    skills: vol.skills.join(', ')
  }
  editing.value = true
  emailError.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function deleteVolunteer(id) {
  if (!confirm('هل أنت متأكد من حذف المتطوع؟')) return
  
  volunteers.value = volunteers.value.filter(v => v.id !== id)
  localStorage.setItem('volunteers', JSON.stringify(volunteers.value))
  toast.success('تم حذف المتطوع بنجاح')
  
  if (selectedVolunteer.value?.id === id) {
    closeModal()
  }
  if (editing.value && form.value.id === id) {
    resetForm()
  }
}

function cancelEdit() {
  resetForm()
  toast.info('تم إلغاء التعديل')
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
  toast.info('تم مسح جميع الفلاتر')
}

function exportCSV() {
  if (volunteers.value.length === 0) {
    toast.error('لا توجد بيانات لتصديرها')
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
  downloadFile(csvContent, 'volunteers_export.csv', 'text/csv')
  toast.success('تم تصدير الملف بنجاح')
}

function exportJSON() {
  if (volunteers.value.length === 0) {
    toast.error('لا توجد بيانات لتصديرها')
    return
  }
  
  const jsonStr = JSON.stringify(volunteers.value, null, 2)
  downloadFile(jsonStr, 'volunteers_export.json', 'application/json')
  toast.success('تم تصدير الملف بنجاح')
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>