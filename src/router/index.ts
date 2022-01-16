import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Welcome from '@/views/landing/index.vue';

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
    component: () => import('@/views/cartography/index.vue'),
  },
  {
    path: '/callback',
    name: 'Callback',
    component: () => import('@/views/callback/index.vue'),
  },
  {
    path: '/exploring',
    name: 'Exploring',
    component: () => import('@/views/exploring/index.vue'),
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('@/views/menu/index.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
