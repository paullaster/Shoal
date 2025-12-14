<template>
  <header class="bg-white/95 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100 transition-all duration-300">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Left Section: Mobile Menu & Logo -->
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Button -->
          <button v-if="!lgAndUp" @click="handleMobileMenuClick"
            class="p-2 -ml-2 rounded-full text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-100"
            aria-label="Open main menu">
            <v-icon size="28">mdi-menu</v-icon>
          </button>

          <!-- Admin Mobile Menu Button -->
          <button v-if="showAuthMenu && !lgAndUp" @click="toggleAdminNavbar"
            class="p-2 rounded-full text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-100"
            aria-label="Open admin dashboard menu">
            <v-icon size="28" :color="ColorHelper.colorsHelper('primary')">mdi-view-module</v-icon>
          </button>

          <!-- Logo (Mobile Only) -->
          <a v-if="!lgAndUp" @click.prevent="navigateTo('landing')" :href="getRouteUrl('landing')" class="flex-shrink-0 hover:opacity-80 transition-opacity">
            <img class="h-10 w-auto" :src="HeaderLogo" alt="Noel Fish Delivery" />
          </a>
          
          <!-- Desktop: Search Bar (Moved to left/center area if needed, or keep right) -->
          <!-- We keep Search here if it was intended to be on the right, but typically search is central. 
               The original code had it in the right section. Let's keep it in the flow but make it distinct. -->
        </div>


        <!-- Right Section: Navigation Icons & Actions -->
        <div class="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          
          <!-- Desktop Search -->
          <div class="hidden lg:block w-96 transition-all duration-300">
             <SearchComponent />
          </div>

          <!-- Mobile Search Trigger -->
          <button v-if="route.name !== 'landing' && !lgAndUp" @click="navigateTo('search')"
            class="p-2 rounded-full text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            aria-label="Search products">
            <v-icon size="26">mdi-magnify</v-icon>
          </button>

          <!-- Cart Action -->
          <button @click="navigateTo('cart')"
            class="group flex items-center gap-2 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
            aria-label="View shopping cart">
            <div class="relative">
              <v-icon size="26" class="group-hover:scale-110 transition-transform">mdi-cart-outline</v-icon>
              <span v-if="itemsInCart > 0"
                class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {{ itemsInCart }}
              </span>
            </div>
            <span v-if="lgAndUp" class="text-sm font-semibold tracking-wide">Cart</span>
          </button>

          <!-- Divider -->
          <div v-if="lgAndUp" class="h-6 w-px bg-gray-200 mx-2"></div>

          <!-- Account Action -->
          <button v-if="!isAuthenticated" @click="navigateToLogin"
            class="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 hover:shadow-md transition-all duration-200 font-semibold text-sm"
            aria-label="Login to your account">
            <v-icon size="22">mdi-account-circle</v-icon>
            <span v-if="lgAndUp">Login</span>
          </button>

          <!-- Logout Action -->
          <button v-else @click="handleLogout"
            class="group flex items-center gap-2 px-3 py-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            aria-label="Logout">
            <v-icon size="26" class="group-hover:scale-110 transition-transform">mdi-logout-variant</v-icon>
            <span v-if="lgAndUp" class="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </nav>

  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { storeToRefs } from 'pinia';
import { useAuth, useCartStore, useDashboard, useGlobalStore } from '@/store';
import HeaderLogo from '@/assets/logo/logo-header.png';
import ColorHelper from '@/util/ColorHelper';
import SearchComponent from '@/components/SearchComponent.vue';

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
