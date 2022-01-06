import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Welcome from '@/views/Welcome.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome,
  },
  {
    path: '/cartography',
    name: 'Cartography',
    component: () => import('@/views/Cartography.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/callback',
    name: 'Callback',
    component: () => import('@/views/Callback.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
