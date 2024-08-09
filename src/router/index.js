import { createRouter, createWebHistory } from 'vue-router'
import LandingComponent from '@/packages/landing/views/LandingComponent.vue'
import { useGlobalStore } from '@/store';
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
      redirect: { name: 'category'},
      children: [
        {
          path: ':category',
          name: 'category',
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
      path: '/auth',
      component: () => import('@/packages/auth/views/AuthComponent.vue'),
      name: 'auth',
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
    },
    {
      path: '/search',
      component: () => import('@/components/SearchComponent.vue'),
      name: 'search',
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('@/components/NotFoundComponent.vue'),
      name: 'notFound',
      title: 'Not Found'
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: {name: 'adminAuth'},
      title: 'Admin',
      children:[
        {
          path: 'auth',
          name: 'adminAuth',
          component: () => import('@/packages/admin/auth/views/AdminAuth.vue'),
          title: 'Admin Login',
        },
        // {
        //   path: 'products',
        //   name: 'adminProducts',
        //   component: () => import('@/packages/admin/views/ProductsComponent.vue'),
        // },
        // {
        //   path: 'categories',
        //   name: 'adminCategories',
        //   component: () => import('@/packages/admin/views/CategoriesComponent.vue'),
        // },
        // {
        //   path: 'orders',
        //   name: 'adminOrders',
        //   component: () => import('@/packages/admin/views/OrdersComponent.vue'),
        // },
        // {
        //   path: 'users',
        //   name: 'adminUsers',
        //   component: () => import('@/packages/admin/views/UsersComponent.vue'),
        // },
        // {
        //   path: 'settings',
        //   name: 'adminSettings',
        //   component: () => import('@/packages/'),
        // },
      ],
      // beforeEnter: (to, from, next) => {
      //   const user = useGlobalStore().getUser();
      //   if (user && user.role === 'admin') {
      //     next();
      //   } else {
      //     next({ name: 'landing' });
      //   }
      // },
    }
  ]
});

router.beforeEach((to, from, next) => {
  useGlobalStore().toggleSidebarNavigation(false);
  if(to.name === from.name) {
    useGlobalStore().toggleSidebarNavigation(false);
  }
  next();
})

export default router
