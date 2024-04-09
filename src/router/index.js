import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../pages/MainPage.vue';
import ErrorPage from '../pages/ErrorPage.vue';


const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: ErrorPage
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
