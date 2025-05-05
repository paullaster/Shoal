<template>
  <header class="header-wrapper">
    <nav class="header-nav">
      <ul>
        <li v-if="!lgAndUp">
          <v-btn variant="text" @click="() => globalStore.toggleSidebarNavigation(true)" v-if="!showAuthMenu">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          <v-btn v-if="showAuthMenu" variant="text" @click="() => !lgAndUp && dashboardStore.setToggleNavbar(true)">
            <v-icon size="30" :color="ColorHelper.colorsHelper('primary')">mdi-view-module</v-icon>
          </v-btn>
        </li>
        <li>
          <a @click="() => router.push({ name: 'landing' })"><img :src="HeaderLogo" alt="Noel Fish Delivery" /></a>
        </li>
      </ul>
      <ul class="reare-nav">
        <li>
          <a @click="() => router.push({ name: 'search' })"
            v-if="route.name !== 'landing'"><v-icon>mdi-magnify</v-icon></a>
        </li>
        <li class="cart-menu">
          <button @click="() => router.push({ name: 'cart' })">
            <v-icon>mdi-cart-outline</v-icon>
            <v-badge color="#ED1E79" :content="itemsInCart" inline v-if="itemsInCart"></v-badge>
            <span v-if="lgAndUp"> cart </span>
          </button>
        </li>
        <li>
          <a v-if="!AuthService.isAuthenticated()" @click="
            () =>
              router.push({
                name: 'auth',
                query: { redirectTo: stringToBase64AndReverse.toBase64String(route.fullPath) }
              })
          "><v-icon v-tooltip="'Login'">mdi-account-outline</v-icon><span v-if="lgAndUp">account</span></a>
          <a v-else @click="() => authStore.logout()"><v-icon v-tooltip="'Logout'">mdi-logout</v-icon><span
              v-if="lgAndUp">Logout</span></a>
        </li>
      </ul>
    </nav>
    <SidebarComponent v-if="showsidebarNavigation || lgAndUp" />
  </header>
</template>

<script setup>
import HeaderLogo from '@/assets/logo/logo-header.png'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useAuth, useCartStore, useDashboard, useGlobalStore } from '@/store'
import { storeToRefs } from 'pinia'
import stringToBase64AndReverse from '@/util/stringToBase64AndReverse'
import { useRouter, useRoute } from 'vue-router'
import SidebarComponent from './SidebarComponent.vue'
import AuthService from '@/packages/auth/AuthService'
import ColorHelper from '@/util/ColorHelper'
import { computed } from 'vue'

// ROUTES
const router = useRouter()
const route = useRoute()

// VUETIFY
const { lgAndUp } = useDisplay()

// STORE
const cartStore = useCartStore()
const globalStore = useGlobalStore()
const authStore = useAuth()
const dashboardStore = useDashboard()
const { itemsInCart } = storeToRefs(cartStore)
const { showsidebarNavigation } = storeToRefs(globalStore)

// Component State
// COMPUTED
const showAuthMenu = computed(() => {
  return AuthService.isAuthenticated() && route.matched.some((record) => record.name === 'accounts')
})
// WATCHERS
</script>

<style scoped>
.cart-menu {
  position: relative;
}

.v-badge {
  display: inline-block;
  line-height: 0;
  position: absolute;
  top: -0.6rem;
  left: 20.8%;
}
</style>