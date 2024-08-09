<template>
  <aside class="sidebar-container">
    <div class="close-and-logo">
      <v-btn variant="text" @click="()=>globalStore.toggleSidebarNavigation(false)">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
      <LogoComponent width="200px" @click="() => router.push('/')" />
    </div>
    <div class="support">
      <ul>
        <li>
          <router-link>
            <span>NEED HELP &quest;</span>
            <v-icon>mdi-chevron-right</v-icon>
          </router-link>
        </li>
        <li>
          <router-link :to="{name: 'auth'}">
            <span>My account</span>
            <v-icon>mdi-chevron-right</v-icon>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="navigation-menus">
      <ul>
        <li v-for="menu in menus" :key="menu.path">
          <router-link :to="menu.path">
            <v-icon class="mr-4">{{ menu.icon }}</v-icon>
            <span>{{ menu.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="categories">
      <router-link to="">
        <span>Our Categories</span>
        <span>See All</span>
      </router-link>
    </div>
    <div class="categories-nav-list">
      <ul>
        <li v-for="category in categories" :key="category.cid">
          <router-link>
            <img :src="category.image" alt="Category" width="30px" height="30px" />
            <span>{{ category.name }}</span>
          </router-link>
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

// ROUTES AND ROUTER
const router = useRouter()

// STORE & STORE ACTIONS
const globalStore = useGlobalStore()
const setupStore = useSetupStore()
const { categories } = storeToRefs(setupStore)
const { menus } = storeToRefs(globalStore)
</script>