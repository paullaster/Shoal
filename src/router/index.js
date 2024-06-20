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
      redirect: { name: 'categories'},
      children: [
        {
          path: '/',
          name: 'categories',
          component: () => import('@/packages/products/views/ProductsComponent.vue'),
        },
        {
          path: ':category/:productId',
          name: 'productDetails',
          component: () => import('@/packages/products/components/ProductDetailPage.vue'),
        },
      ],
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/packages/cart/views/CartComponent.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/packages/cart/components/CheckoutComponent.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/packages/auth/views/LoginComponent.vue'),
    },
    {
      path: '/register',
      name:'register',
      component: () => import('@/packages/auth/views/RegisterComponent.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/packages/auth/components/ProfileComponent.vue'),
    },
    {
      path: '/:user/orders',
      name: 'orders',
      component: () => import('@/packages/orders/views/OrdersComponent.vue'),
    }
  ]
})

export default router
