import { createRouter, createWebHistory } from 'vue-router'
import LandingComponent from '@/packages/landing/views/LandingComponent.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.VUE_APP_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingComponent
    },
    {
      path: '/categories',
      name: 'categories',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/packages/categories/views/CategoriesComponent.vue')
    }
  ]
})

export default router
