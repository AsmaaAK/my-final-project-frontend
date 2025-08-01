<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center dark:text-white">
      صفحة المطابقة بين المتطوعين والفعاليات
    </h1>

    <!-- هنا نعرض مكون MatchResult -->
    <MatchResult />
  </div>
</template>

<script setup>
// استيراد مكون MatchResult
import MatchResult from '@/components/MatchResult.vue'
</script>

<style scoped>
/* يمكن إضافة تنسيقات خاصة هنا */
</style>
