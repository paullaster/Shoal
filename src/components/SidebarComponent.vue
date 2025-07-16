<template>
  <aside class="sidebar-container">
    <div class="close-and-logo">
      <v-btn variant="text" @click="() => globalStore.toggleSidebarNavigation(false)">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
      <LogoComponent width="200px" @click="() => router.push('/')" />
    </div>
    <div class="support">
      <ul>
        <li>
          <RouterLink>
            <span>NEED HELP &quest;</span>
            <v-icon>mdi-chevron-right</v-icon>
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="AuthService.isAuthenticated() ? { name: 'userProfile' } : { name: 'auth' }">
            <span>My account</span>
            <v-icon>mdi-chevron-right</v-icon>
          </RouterLink>
        </li>
      </ul>
    </div>
    <div class="navigation-menus">
      <ul>
        <template v-for="menu in menus" :key="menu.path">
          <li v-if="menu.enabled">
            <RouterLink :to="menu.path">
              <v-icon class="mr-4">{{ menu.icon }}</v-icon>
              <span>{{ menu.name }}</span>
            </RouterLink>
          </li>
        </template>
      </ul>
    </div>
    <div class="categories">
      <RouterLink to="">
        <span>Our Categories</span>
        <span>See All</span>
      </RouterLink>
    </div>
    <div>test ghere</div>
    <div class="categories-nav-list">
      <ul>
        <li v-for="category in categories" :key="category.categoryId">
          <RouterLink>
            <v-icon :color="category.color">{{ category.icon }}</v-icon>
            <span>{{ category.name }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import LogoComponent from '@/components/LogoComponent.vue'
import { useRouter } from 'vue-router'
import { useGlobalStore, useSetupStore } from '@/store'
import { storeToRefs } from 'pinia'
import AuthService from '@/packages/auth/AuthService'

// ROUTES AND ROUTER
const router = useRouter()

// STORE & STORE ACTIONS
const globalStore = useGlobalStore()
const setupStore = useSetupStore()
const { categories } = storeToRefs(setupStore)
const { menus } = storeToRefs(globalStore)
</script>