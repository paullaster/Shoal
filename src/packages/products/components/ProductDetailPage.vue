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
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

// ROUTES

// STORE
const productStore = useProductStore()
const setupStore = useSetupStore()
const cartStore = useCartStore();

// STORE STATES AND GETTERS
const { product } = storeToRefs(productStore)
const { currency } = storeToRefs(setupStore)
const {cart} = storeToRefs(cartStore);

// STORE ACTIONS
// productStore.getProduct(stringToBase64AndReverse.fromBase64String(route.params.productId))
// cartStore.getCart();

// @TODO: remove
productStore.$patch({
  product: {
    pid: '1',
    name: 'Product 1',
    size: 'M',
    color: 'Black',
    image: 'http://192.168.0.103:3500/public/image/products/AAAK9NF5RL8VZ.png',
    description: `lorem ipsum dolor sit amet, 
    consectetur adipiscing elit in a just. pure and transparent.
     Lore maur tincidunt et just eu just et just eu just eu just eu just eu just eu just eu just et`,
    price: 19.99,
    quantity: 10
  }
})

// Component REFS and STATE
const itemInCart = ref(undefined);
const numberOfProductInCart = ref(0);

// WATCHERS
watch(
  () => cart.value, 
  (newValue) => {
    itemInCart.value = newValue.Item.find(item => item.productId === product.value.pid)
}, {deep: true})
watch(
  () => itemInCart.value?.quantity, 
  (newValue) => {
    numberOfProductInCart.value = newValue;
}, {deep: true})

</script> 

<style scoped>
</style>