<template>
  <div class="fixed right-0 top-0 bottom-0 z-100">
    <button 
      @click="toggleSidebar"
      class="fixed z-50 top-4 right-4 p-2 rounded-md text-white dark:text-white md:hidden"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- اللوحة الجانبية -->
    <aside 
      class="w-64 bg-white dark:bg-gray-800 shadow-md p-4 h-full transition-all duration-300 z-40 fixed md:static"
      :class="[
        isSidebarOpen ? 'right-0' : '-right-64',
        'md:translate-x-0'
      ]"
    >
      <div class="flex items-center gap-3 pb-7 border-b border-gray-300 dark:border-gray-600">
        <span class="text-lg font-semibold text-gray-800 dark:text-white">
          المنظمة الإلكترونية للإعلام الإنساني
        </span>
      </div>
      <nav class="space-y-2 pt-6">
        <router-link to="/" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700" @click="closeSidebarOnMobile">
          <font-awesome-icon class="text-blue-800 dark:text-white" icon="tachometer-alt" />
          <span>لوحة التحكم</span>
        </router-link>
        <router-link to="/volunteers" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700" @click="closeSidebarOnMobile">
          <font-awesome-icon class="text-blue-800 dark:text-white" icon="users" />
          <span>المتطوعين</span>
        </router-link>
        <router-link to="/events" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700" @click="closeSidebarOnMobile">
          <font-awesome-icon class="text-blue-800 dark:text-white" icon="calendar-alt" />
          <span>الفعاليات</span>
        </router-link>
        <router-link to="/matching" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700" @click="closeSidebarOnMobile">
          <font-awesome-icon class="text-blue-800 dark:text-white" icon="balance-scale" />
          <span>المطابقة</span>
        </router-link>
        <router-link to="/reports" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700" @click="closeSidebarOnMobile">
          <font-awesome-icon class="text-blue-800 dark:text-white" icon="chart-bar" />
          <span>التقارير</span>
        </router-link>
      </nav>
    </aside>

    <!-- طبقة شفافة عند فتح القائمة -->
    <div 
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false
  }
}
</script>


