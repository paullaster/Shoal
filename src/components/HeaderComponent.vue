<template>
  <header class="bg-white shadow-md sticky top-0 z-40">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left Section: Mobile Menu & Logo -->
        <div class="flex items-center space-x-2">
          <!-- Mobile Menu Button -->
          <button v-if="!lgAndUp" @click="handleMobileMenuClick"
            class="p-2 rounded-md text-gray-600 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            aria-label="Open main menu">
            <v-icon>mdi-menu</v-icon>
          </button>

          <!-- Admin Mobile Menu Button -->
          <button v-if="showAuthMenu && !lgAndUp" @click="toggleAdminNavbar"
            class="p-2 rounded-md text-gray-600 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            aria-label="Open admin dashboard menu">
            <v-icon size="30" :color="ColorHelper.colorsHelper('primary')">mdi-view-module</v-icon>
          </button>

          <!-- Logo -->
          <a @click.prevent="navigateTo('landing')" :href="getRouteUrl('landing')" class="flex-shrink-0">
            <img class="h-8 w-auto" :src="HeaderLogo" alt="Noel Fish Delivery" />
          </a>
        </div>

        <!-- Right Section: Navigation Icons -->
        <div class="flex items-center space-x-3 sm:space-x-4">
          <!-- Search Icon -->
          <button v-if="route.name !== 'landing'" @click="navigateTo('search')"
            class="p-2 rounded-full text-gray-600 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Search products">
            <v-icon>mdi-magnify</v-icon>
          </button>

          <!-- Cart Icon -->
          <button @click="navigateTo('cart')"
            class="relative p-2 rounded-full text-gray-600 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="View shopping cart">
            <v-icon>mdi-cart-outline</v-icon>
            <span v-if="itemsInCart > 0"
              class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-xs font-medium text-white">
              {{ itemsInCart }}
            </span>
            <span v-if="lgAndUp" class="ml-2 text-sm font-medium">Cart</span>
          </button>

          <!-- Account/Login Icon -->
          <button v-if="!isAuthenticated" @click="navigateToLogin"
            class="p-2 rounded-full text-gray-600 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Login to your account">
            <v-icon>mdi-account-outline</v-icon>
            <span v-if="lgAndUp" class="ml-2 text-sm font-medium">Account</span>
          </button>

          <!-- Logout Icon -->
          <button v-else @click="handleLogout"
            class="p-2 rounded-full text-gray-600 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Logout">
            <v-icon>mdi-logout</v-icon>
            <span v-if="lgAndUp" class="ml-2 text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Sidebar Component -->
    <SidebarComponent v-if="showsidebarNavigation || lgAndUp" />
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { storeToRefs } from 'pinia';
import { useAuth, useCartStore, useDashboard, useGlobalStore } from '@/store';
import HeaderLogo from '@/assets/logo/logo-header.png';
import SidebarComponent from './SidebarComponent.vue';
import ColorHelper from '@/util/ColorHelper';

// ROUTER & ROUTE
const router = useRouter();
const route = useRoute();

// VUETIFY DISPLAY
const { lgAndUp } = useDisplay();

// PINIA STORES
const cartStore = useCartStore();
const globalStore = useGlobalStore();
const authStore = useAuth();
const dashboardStore = useDashboard();

// REACTIVE STATE
const { itemsInCart } = storeToRefs(cartStore);
const { showsidebarNavigation } = storeToRefs(globalStore);
const { isAuthenticated } = storeToRefs(authStore);

// COMPUTED PROPERTIES
const showAuthMenu = computed(() =>
  isAuthenticated.value && route.matched.some((record) => record.name === 'accounts')
);

// METHODS
const navigateTo = (routeName) => {
  router.push({ name: routeName });
};

const navigateToLogin = () => {
  router.push({
    name: 'auth',
    query: { redirectTo: route.fullPath }
  });
};

const handleLogout = () => {
  authStore.logout();
};

const handleMobileMenuClick = () => {
  globalStore.toggleSidebarNavigation(true);
};

const toggleAdminNavbar = () => {
  dashboardStore.setToggleNavbar(true);
};

const getRouteUrl = (routeName) => {
  const resolvedRoute = router.resolve({ name: routeName });
  return resolvedRoute.href;
};
</script>

<style scoped>
/* Scoped styles are intentionally removed in favor of Tailwind CSS utility classes. */
/* Any component-specific overrides or complex styles that cannot be achieved */
/* with utilities can be added here if necessary. */
</style>
