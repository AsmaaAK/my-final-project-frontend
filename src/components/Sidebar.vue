<template>
  <aside class="w-64 bg-white dark:bg-gray-800 shadow-md p-4">
    <div class="flex items-center bg-blue-800 gap-3 pb-7 border-b border-gray-300 dark:border-gray-600">
      <!-- <img src="/admin-avatar.png" alt="Admin" class="w-10 h-10 rounded-full object-cover"> -->
      <span class="text-lg font-semibold text-gray-800 dark:text-white">لوحة التحكم</span>
    </div>
    <nav class="space-y-2 p-2">
      <RouterLink to="/" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <font-awesome-icon icon="tachometer-alt" />
        لوحة التحكم
      </RouterLink>
      <RouterLink to="/volunteers" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <font-awesome-icon icon="users" />
        المتطوعين
      </RouterLink>
      <RouterLink to="/events" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <font-awesome-icon icon="calendar-alt" />
        الفعاليات
      </RouterLink>
      <RouterLink to="/matching" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <font-awesome-icon icon="balance-scale" />
        المطابقة
      </RouterLink>
      <RouterLink to="/reports" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <font-awesome-icon icon="chart-bar" />
        التقارير
      </RouterLink>
      <RouterLink to="/settings" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <font-awesome-icon icon="cog" />
        الإعدادات
      </RouterLink>
      <RouterLink to="/export" class="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <font-awesome-icon icon="download" />
        تصدير البيانات
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
