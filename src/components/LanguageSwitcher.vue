<template>
  <div class="flex gap-2 p-4">
    <button
      @click="switchLanguage('ar')"
      :class="locale === 'ar' ? activeClass : baseClass"
    >
      العربية
    </button>
    <button
      @click="switchLanguage('en')"
      :class="locale === 'en' ? activeClass : baseClass"
    >
      English
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';

const { locale } = useI18n();
const activeClass = 'bg-blue-600 text-white px-4 py-2 rounded';
const baseClass = 'bg-gray-200 text-black px-4 py-2 rounded';

const switchLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem('language', lang);
};

// تحميل اللغة من التخزين المحلي عند تشغيل المكون
const savedLang = localStorage.getItem('language');
if (savedLang && savedLang !== locale.value) {
  locale.value = savedLang;
}
</script>
