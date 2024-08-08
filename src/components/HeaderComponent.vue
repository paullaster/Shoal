<template>
  <header class="header-wrapper" v-if="showHeader">
    <h1 class="header-title">Noels Fish Delivery</h1>
    <nav class="header-nav">
      <ul>
        <li><v-icon>mdi-menu</v-icon></li>
        <li>
          <a @click="()=>router.push({name: 'landing'})" ><img :src="HeaderLogo" alt="Noel Fish Delivery" /></a>
        </li>
      </ul>
      <ul class="reare-nav">
        <li>
          <a @click="()=>console.log('search')" v-if="route.name !== 'landing'"><v-icon>mdi-magnify</v-icon></a>
        </li>
        <li>
          <a @click="()=>router.push({name: 'auth'})" ><v-icon>mdi-account-outline</v-icon><span v-if="lgAndUp">account</span></a>
        </li>
        <li class="cart-menu">
          <button
          @click="()=>router.push({name: 'cart'})"
            ><v-icon>mdi-cart-outline</v-icon>
            <v-badge color="#ED1E79" :content="cartCount" inline v-if="cartCount"></v-badge>
            <span v-if="lgAndUp"> cart </span></button
          >
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import HeaderLogo from '@/assets/logo/logo-header.png'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useCartStore } from '@/store';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// ROUTES
const router = useRouter()
const route = useRoute();

// VUETIFY 
const { lgAndUp } = useDisplay()

// STORE
const cartStore = useCartStore();
const { cart } = storeToRefs(cartStore);


// Component State
const cartCount = ref(cart?.Item?.length || 0)
const showHeader = ref(true);

router.afterEach(() => {
  cartCount.value = cart?.Item?.length || 0
})

// WATCH
watch(
  () =>route.name,
  (name) => {
  if (name === 'auth') {
    showHeader.value = false;
  } 
  if (name === 'search'){
    showHeader.value = false;
  }
});
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