import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import i18n from './i18n'; 
import { createPinia } from 'pinia';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTachometerAlt, faUsers, faCalendarAlt, faBalanceScale, faChartBar, faCog, faDownload } from '@fortawesome/free-solid-svg-icons'

library.add(faTachometerAlt, faUsers, faCalendarAlt, faBalanceScale, faChartBar, faCog, faDownload)

const lang = localStorage.getItem('lang') || 'ar'
document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.use(i18n); 
app.use(createPinia());
app.mount('#app');
