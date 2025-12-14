<template>
  <v-app>
    <SidebarComponent v-if="showSidebar" />
    
    <v-main>
      <div class="d-flex flex-column fill-height">
        <HeaderComponent v-if="showHeader" />
        
        <div class="flex-grow-1">
          <router-view v-slot="{ Component, route }">
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </div>

        <FooterComponents v-if="showFooter" />
      </div>
    </v-main>

    <DynamicDialog />
    <LoaderComponent v-if="loading" />
  </v-app>
</template>

<script setup>
import { computed, onMounted, defineAsyncComponent } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuth, useCartStore, useGlobalStore, useSetupStore } from './store';
import AuthService from './packages/auth/AuthService';

// ASYNC COMPONENTS
const HeaderComponent = defineAsyncComponent(() => import('@/components/HeaderComponent.vue'));
const FooterComponents = defineAsyncComponent(() => import('./components/FooterComponents.vue'));
const DynamicDialog = defineAsyncComponent(() => import("@/components/DynamicDialog.vue"));
const LoaderComponent = defineAsyncComponent(() => import('./components/LoaderComponent.vue'));
const SidebarComponent = defineAsyncComponent(() => import('./components/SidebarComponent.vue'));

// ROUTER
const route = useRoute();

// STORES
const globalStore = useGlobalStore();
const setupStore = useSetupStore();
const cartStore = useCartStore();
const authStore = useAuth();

// STATE
const { loading } = storeToRefs(globalStore);
const { isAuthenticated } = storeToRefs(authStore);

// COMPUTED PROPERTIES
const showHeader = computed(() => !route.matched.some((record) => record.meta.headerless));

// Configuration for routes where sidebar should be hidden (Scalable & Extensible)
const sidebarlessRoutes = [
  'auth',
  'verifyAccount',
  'completeProfile',
  'userCredentials',
  'adminAuth',
  // Future: Add 'cart' or 'checkout' here to hide sidebar on those pages
];

const showSidebar = computed(() => {
  // 1. Check explicit route meta (decentralized control)
  const isMetaSidebarless = route.matched.some((record) => record.meta.sidebarless || record.meta.headerless);
  if (isMetaSidebarless) return false;

  // 2. Check centralized configuration array
  return !sidebarlessRoutes.includes(route.name);
});

const showFooter = computed(() => !route.matched.some((record) => record.meta.footerless));

const reactiveMenus = computed(() => [
  {
    name: 'Orders',
    path: '/account/orders',
    icon: 'mdi-hoop-house',
    enabled: isAuthenticated.value
  },
  {
    name: 'Saved Items',
    path: '/saved-items',
    icon: 'mdi-bookmark-outline',
    enabled: isAuthenticated.value
  },
  {
    name: 'More',
    path: '/more',
    icon: 'mdi-unfold-more-vertical',
    enabled: true
  }
]);

// LIFECYCLE HOOKS
onMounted(() => {
  // Set reactive menus in the global store
  globalStore.setMenu(reactiveMenus.value);

  // Initialize user state from AuthService
  const user = AuthService.getUser();
  if (user) {
    authStore.setUser(user);
  }

  // Initial data fetching
  if (user?.type !== 'admin') {
    cartStore.getCart();
  }
  setupStore.getCategories();
});

</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>