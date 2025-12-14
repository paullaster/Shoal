<template>
  <v-navigation-drawer
    v-model="drawerModel"
    app
    :permanent="lgAndUp"
    :temporary="!lgAndUp"
    class="sidebar-drawer"
    :elevation="lgAndUp ? 0 : 8"
    :class="{ 'border-none': lgAndUp }"
    color="white"
  >
    <!-- Header: Logo & Close Button -->
    <div class="drawer-header d-flex align-center justify-space-between px-4 py-4">
      <LogoComponent width="140px" @click="handleLogoClick" class="cursor-pointer logo-hover" />
      
      <v-btn
        v-if="!lgAndUp"
        icon="mdi-close"
        variant="text"
        color="grey-darken-1"
        @click="closeSidebar"
        aria-label="Close Menu"
      ></v-btn>
    </div>

    <!-- Content Container -->
    <div class="drawer-content px-3 py-2">
      
      <!-- Account & Support -->
      <div class="mb-6 section-group">
        <p class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-3 px-3 tracking-wide">Account</p>
        <v-list density="comfortable" nav class="pa-0">
          <v-list-item
            :to="AuthService.isAuthenticated() ? { name: 'userProfile' } : { name: 'auth' }"
            color="primary"
            rounded="xl"
            class="nav-item mb-2"
            active-class="nav-item-active"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-account-circle-outline" class="nav-icon"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">My Account</v-list-item-title>
          </v-list-item>

          <v-list-item link color="primary" rounded="xl" class="nav-item mb-2" active-class="nav-item-active">
            <template v-slot:prepend>
              <v-icon icon="mdi-lifebuoy" class="nav-icon"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">Need Help?</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

      <!-- Main Navigation -->
      <div class="mb-6 section-group">
        <p class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-3 px-3 tracking-wide">Menu</p>
        <v-list density="comfortable" nav class="pa-0">
          <template v-for="menu in menus" :key="menu.path">
            <v-list-item
              v-if="menu.enabled"
              :to="menu.path"
              color="primary"
              rounded="xl"
              class="nav-item mb-2"
              active-class="nav-item-active"
            >
              <template v-slot:prepend>
                <v-icon :icon="menu.icon" class="nav-icon"></v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">{{ menu.name }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </div>

      <!-- Categories -->
      <div class="section-group">
        <div class="d-flex align-center justify-space-between px-3 mb-3">
          <p class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-0 tracking-wide">Categories</p>
          <RouterLink to="" class="text-caption text-primary text-decoration-none font-weight-bold hover-underline">
            See All
          </RouterLink>
        </div>
        
        <v-list density="comfortable" nav class="pa-0">
          <v-list-item
            v-for="category in categories"
            :key="category.categoryId"
            link
            color="primary"
            rounded="xl"
            class="nav-item mb-2"
            active-class="nav-item-active"
          >
            <template v-slot:prepend>
               <v-icon :color="category.color" class="nav-icon">{{ category.icon }}</v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">{{ category.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

    </div>
  </v-navigation-drawer>
</template>

<script setup>
import LogoComponent from '@/components/LogoComponent.vue'
import { useRouter, useRoute } from 'vue-router'
import { useGlobalStore, useSetupStore } from '@/store'
import { storeToRefs } from 'pinia'
import AuthService from '@/packages/auth/AuthService'
import { computed, watch } from 'vue'
import { useDisplay } from 'vuetify'

// ROUTES AND ROUTER
const router = useRouter()
const route = useRoute()
const { lgAndUp } = useDisplay()

// STORE & STORE ACTIONS
const globalStore = useGlobalStore()
const setupStore = useSetupStore()
const { categories } = storeToRefs(setupStore)
const { menus, showsidebarNavigation } = storeToRefs(globalStore)

// COMPUTED MODEL FOR V-MODEL
const drawerModel = computed({
  get() {
    // If large screen, always true (permanent). If mobile, value from store.
    if (lgAndUp.value) return true;
    return showsidebarNavigation.value;
  },
  set(val) {
    globalStore.toggleSidebarNavigation(val);
  }
})

// METHODS
const closeSidebar = () => {
  globalStore.toggleSidebarNavigation(false);
}

const handleLogoClick = () => {
  router.push('/');
  if (!lgAndUp.value) closeSidebar();
}

// WATCHERS
// Auto-close on route change (Mobile only)
watch(
  () => route.fullPath,
  () => {
    if (!lgAndUp.value && showsidebarNavigation.value) {
      closeSidebar();
    }
  }
);
</script>

<style scoped>
/* Seamless border removal for large screens */
.border-none {
  border-right: none !important;
}

/* Lively Hover Effects */
.nav-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  transform: translateX(4px);
}

.nav-item-active {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}

.nav-icon {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.nav-item:hover .nav-icon,
.nav-item-active .nav-icon {
  opacity: 1;
}

.logo-hover {
  transition: transform 0.2s ease;
}

.logo-hover:hover {
  transform: scale(1.05);
}

.hover-underline:hover {
  text-decoration: underline !important;
}

/* Subtle typography tweaks */
.tracking-wide {
  letter-spacing: 0.08em !important;
}
</style>