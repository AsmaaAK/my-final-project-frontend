<template>
  <div class="p-4 md:p-6 max-w-7xl mx-auto">
    <h1 class="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center dark:text-white">
      صفحة المطابقة بين المتطوعين والفعاليات
    </h1>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
      <MatchResult />
    </div>
  </div>
</template>

<script setup>
import MatchResult from '@/components/MatchResult.vue'
</script>

<style scoped>
/* تحسينات للعرض على الجوال */
@media (max-width: 640px) {
  .max-w-7xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>