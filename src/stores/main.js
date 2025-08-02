// stores/main.js
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    darkMode: localStorage.getItem('darkMode') === 'true',
    language: localStorage.getItem('language') || 'ar',
  }),
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      localStorage.setItem('darkMode', this.darkMode)
    },
    toggleLanguage() {
      this.language = this.language === 'ar' ? 'en' : 'ar'
      localStorage.setItem('language', this.language)
    }
  }
})
