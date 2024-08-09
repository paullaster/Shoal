<template>
  <main class="product-wrapper">
    <section class="product-wrapper-card">
      <div class="product-wrapper-card--image-holder">
        <img :src="product.image" alt="" />
      </div>
      <h4>{{ product.name }}, {{ product.size }} - {{ product.color }}</h4>
      <p>{{ product.description }}</p>
      <h1>
        <span> {{ currency }} </span>
        <span> {{ product.price }}</span>
      </h1>
      <div>
        <h3>Available in stock</h3>
        <p>{{ product.quantity }}</p>
      </div>
      <div>
        <h3>Description</h3>
        <p>{{ product.description }}</p>
      </div>
      <div class="product-detailpage-btn-holder">
        <v-btn  class="bg-c-primary">
          <v-icon >mdi-phone-outline</v-icon>
        </v-btn>
        <v-btn @click="async () =>await cartStore.createCart(product)" class="bg-c-primary" v-if="!numberOfProductInCart">
          <v-icon class="mr-2">mdi-cart-plus</v-icon>
          <span>Add to Cart</span>
        </v-btn>
        <div v-if="numberOfProductInCart">
          <v-btn class="bg-c-primary" @click.prevent="()=>cartStore.updateCart(product.pid, 'remove')"><v-icon class="mr-2">mdi-minus</v-icon></v-btn>
          <span>{{ numberOfProductInCart }}</span>
          <v-btn class="bg-c-primary" @click.prevent="()=>cartStore.updateCart(product.pid, 'add')"><v-icon>mdi-plus</v-icon></v-btn>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useProductStore, useSetupStore, useCartStore } from '@/store'
import stringToBase64AndReverse from "@/util/stringToBase64AndReverse";
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router';

// ROUTES
const route = useRoute();

// STORE
const productStore = useProductStore()
const setupStore = useSetupStore()
const cartStore = useCartStore();

// STORE STATES AND GETTERS
const { product } = storeToRefs(productStore)
const { currency } = storeToRefs(setupStore)
const {cart} = storeToRefs(cartStore);

// STORE ACTIONS
productStore.getProduct(stringToBase64AndReverse.fromBase64String(route.params.productId));

// Component REFS and STATE
const itemInCart = ref(undefined);
const numberOfProductInCart = ref(0);

// WATCHERS
watch(
  () => [product.value, cart.value], 
  () => {
    itemInCart.value = cart.value.Item?.find(item => item.productId === product.value.pid)
}, {deep: true, immediate: true})
watch(
  () => itemInCart.value, 
  (newValue) => {
    numberOfProductInCart.value = newValue?.quantity;
}, {deep: true, immediate: true})

</script> 

<style scoped>
</style>