// Vue Router Configuration
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import Volunteers from '@/views/Volunteers.vue';
import Events from '@/views/Events.vue';
import Matching from '@/views/Matching.vue';
import Reports from '@/views/Reports.vue';
import ExportEvents from '@/views/ExportEvents.vue';
import Login from '@/views/Login.vue';

const routes = [
  { path: '/', component: Dashboard},
  { path: '/Volunteers' ,component: Volunteers  },
  { path: '/events', component: Events },
  { path: '/matching', component: Matching },
  { path: '/reports', component: Reports },
  { path: '/login' ,component: () => import('@/views/Login.vue') },
  { path: '/profile', component: () => import('@/views/UserProfile.vue') },
  { path: '/register-volunteer', component: () => import('@/views/RegisterVolunteer.vue') },
  { path: '/manage-volunteers', component: () => import('@/views/ManageVolunteers.vue') },
  { path: '/manage-events', component: () => import('@/views/ManageEvents.vue') },
  { path: '/register-event', component: () => import('@/views/RegisterEvent.vue') },
  { path: '/export-volunteers', component: () => import('@/views/ExportVolunteers.vue') },
  { path: '/export-events', component: () => import('@/views/ExportEvents.vue') },
  { path: '/notifications', component: () => import('@/views/Notifications.vue') },
  { path: '/skills', component: () => import('@/views/SkillChart.vue') },
  { path: '/required-skills', component: () => import('@/views/RequiredSkillChart.vue') },
  {path: '/export',name: 'Export', component: ExportEvents},
  {path: '/match-result', name: 'Matching',component: () => import('@/views/Matching.vue')},
  { path: '/reports', name: 'Reports', component: ()=> import('@/views/Reports.vue')}
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
