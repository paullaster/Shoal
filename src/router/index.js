import { createRouter, createWebHistory } from 'vue-router'
import LandingComponent from '@/packages/landing/views/LandingComponent.vue'
import { useGlobalStore, useSearch } from '@/store';
import AuthService from '@/packages/auth/AuthService';
import stringToBase64AndReverse from '@/util/stringToBase64AndReverse';
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
      redirect: { name: 'category' },
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
      meta: {
        requiresAuth: true,
        title: 'Checkout'
      }
    },
    {
      path: '/auth',
      component: () => import('@/packages/auth/views/AuthComponent.vue'),
      name: 'auth',
      query: {
        redirectTo: '/',
      },
      meta: {
        title: 'Login/Register',
        requiresGuest: true,
        headerless: true,
      }
    },
    {
      path: '/auth/verify-account/:uniquCode',
      name: 'verifyAccount',
      component: () => import('@/packages/auth/components/OTPComponent.vue'),
      meta: {
        title: 'Verify Account',
        headerless: true,
        requiresGuest: true,
      },
    },
    {
      path: '/auth/complete-profile/:uniquCode',
      name: 'completeProfile',
      component: () => import('@/packages/auth/components/ProfileComponent.vue'),
      meta: {
        title: 'Complete Profile',
        headerless: true,
        requiresGuest: true,
      },
    },
    {
      path: '/auth/credentials/:uniquCode',
      name: 'userCredentials',
      component: () => import('@/packages/auth/components/ProfileComponent.vue'),
      meta: {
        title: 'User credentials',
        headerless: true,
        requiresGuest: true,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/packages/auth/components/ProfileComponent.vue'),
    },
    {
      path: '/search',
      component: () => import('@/components/SearchComponent.vue'),
      name: 'search',
      meta: {
        title: 'Search',
        headerless: true,
      }
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('@/components/NotFoundComponent.vue'),
      name: 'notFound',
      meta: {
        title: 'Not Found'
      }
    },
    {
      path: '/account',
      component: () => import('@/layouts/UserNDALayout.vue'),
      name: "accounts",
      meta: {
        title: 'Accounts',
        requiresAuth: true,
      },
      redirect: { name: 'userProfile' },
      children: [
        {
          path: 'dashboard',
          name: 'userProfile',
          component: () => import('@/packages/profile/views/MyProfile.vue'),
          meta: {
            title: 'Dashboard'
          }
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/packages/orders/views/OrdersComponent.vue'),
          meta: {
            title: 'Orders',
          }
        },
        {
          path: 'orders/:orderId',
          name: 'orderDetails',
          component: () => import('@/packages/orders/components/OrderDetails.vue'),
          meta: {
            title: 'Order details',
          }
        },
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: { name: 'adminAuth' },
      meta: {
        title: 'Admin',
        headerless: true,
      },
      children: [
        {
          path: 'auth',
          name: 'adminAuth',
          component: () => import('@/packages/admin/auth/views/AdminAuth.vue'),
          meta: {
            title: 'Admin Login',
          }
        },
        {
          path: ':adminId',
          name: 'adminUserLayout',
          component: () => import('@/layouts/AdminDashboardLayout.vue'),
          redirect: { name: 'adminDashboard' },
          children: [
            {
              path: 'dashboard',
              name: 'adminDashboard',
              component: () => import('@/packages/admin/dashboard/views/AdminDashboard.vue'),
              meta: {
                title: 'Admin Dashboard'
              }
            },
            {
              path: 'products',
              name: 'manageProducts',
              component: () => import('@/packages/admin/products/views/ManageProducts.vue'),
              meta: {
                title: 'Manage Products'
              }
            },
            {
              path: 'products/create',
              name: 'createProduct',
              component: () => import('@/packages/admin/products/components/AddProduct.vue'),
              meta: {
                title: 'Create Product'
              }
            },
            {
              path: 'discounts',
              name: 'AdminDiscounts',
              component: () => import('@/packages/admin/discounts/views/DiscountManagement.vue')
            },
            // {
            //   path: 'orders',
            //   name: 'adminOrders',
            //   component: () => import('@/packages/admin/views/OrdersComponent.vue'),
            // },
          ],
          meta: {
            requiresAuth: true,
            isAdmin: true,
            title: 'Admin Dashboard Layout'
          }
        },
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
  if (to.name === from.name) {
    useGlobalStore().toggleSidebarNavigation(false);
  }
  if (from.name === 'search') {
    useSearch().$reset();
  }
  useGlobalStore().setLoading(true);
  const { requiresAuth } = to.meta;
  if (requiresAuth && !AuthService.isAuthenticated()) {
    if (to.path.includes('admin')) {
      next({ name: 'adminAuth' });
    } else {
      next({ name: 'auth', query: { redirectTo: stringToBase64AndReverse.toBase64String(to.fullPath) } });
    }
  } else {
    next();
  }
})
router.beforeResolve(async (to) => {
  if (to.meta.requiresGuest) {
    return !AuthService.isAuthenticated();
  }
  if (to.matched.some((record) => record.meta.isAdmin)) {
    return AuthService.isAuthenticated() && AuthService.getUser().type === 'admin';
  }

  if (!to.path.includes('/admin')) {
    return AuthService.isAuthenticated() && AuthService.getUser().type !== 'admin';
  }
  return true;
})

router.afterEach((to) => {
  useGlobalStore().setLoading(false);
  const title = to.meta.title;
  document.title = 'Noels | ' + title;
  scroll({
    top: 0,
    behavior: 'smooth'
  })
})

export default router
