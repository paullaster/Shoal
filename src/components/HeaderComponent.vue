<template>
  <header class="header-wrapper">
    <h1 class="header-title">Noels Fish Delivery</h1>
    <nav class="header-nav">
      <ul>
        <li v-if="!lgAndUp">
          <v-btn variant="text" @click="()=>globalStore.toggleSidebarNavigation(true)">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </li>
        <li>
          <a @click="()=>router.push({name: 'landing'})" ><img :src="HeaderLogo" alt="Noel Fish Delivery" /></a>
        </li>
      </ul>
      <ul class="reare-nav">
        <li>
          <a @click="()=>router.push({name: 'search'})" v-if="route.name !== 'landing'"><v-icon>mdi-magnify</v-icon></a>
        </li>
        <li>
          <a @click="()=>router.push({name: 'auth', query: { redirectTo: route.fullPath}})" ><v-icon>mdi-account-outline</v-icon><span v-if="lgAndUp">account</span></a>
        </li>
        <li class="cart-menu">
          <button
          @click="()=>router.push({name: 'cart'})"
            ><v-icon>mdi-cart-outline</v-icon>
            <v-badge color="#ED1E79" :content="itemsInCart" inline v-if="itemsInCart"></v-badge>
            <span v-if="lgAndUp"> cart </span></button
          >
        </li>
      </ul>
    </nav>
    <SidebarComponent v-if="showsidebarNavigation || lgAndUp" />
  </header>
</template>

<script setup>
import HeaderLogo from '@/assets/logo/logo-header.png'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useCartStore, useGlobalStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import SidebarComponent from './SidebarComponent.vue';

// ROUTES
const router = useRouter()
const route = useRoute();

// VUETIFY 
const { lgAndUp } = useDisplay()

// STORE
const cartStore = useCartStore();
const globalStore = useGlobalStore();
const { itemsInCart } = storeToRefs(cartStore);
const { showsidebarNavigation } = storeToRefs(globalStore);


// Component State
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