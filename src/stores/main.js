import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    volunteers: [],
    events: [],
    language: 'ar',
    darkMode: false
  }),
  actions: {
    setVolunteers(data) { this.volunteers = data },
    setEvents(data) { this.events = data },
    toggleLanguage() { this.language = this.language === 'ar' ? 'en' : 'ar' },
    toggleDarkMode() { this.darkMode = !this.darkMode }
  }
});