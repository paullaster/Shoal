<template>
  <main class="product-wrapper">
    <section class="product-wrapper-card">
      <div class="product-wrapper-card--image-holder">
        <img :src="product.image" alt="" />
      </div>
      <h4>{{ product.name }},  {{ product.size }} - {{ product.color }} </h4>
      <p>{{ product.description }}</p>
      <h1>
        <span> {{ defaultCurrency }}  </span>
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
     <div>
        <ButtonComponent caption="add to cart" @click="() => router.push({ name: 'cart' })" />
     </div>
      <ButtonComponent caption="continue shopping" @click="() => router.push({ name: 'cart' })" />
    </section>
  </main>
</template>

<script setup>
import { useProductStore } from '@/store'
import stringToBase64AndReverse from '@/util/stringToBase64AndReverse'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { ref } from 'vue'

const defaultCurrency = ref('KES. ')

// ROUTES
const route = useRoute()
const router = useRouter()
// STORE
const productStore = useProductStore()

// STORE STATES AND GETTERS
const { product } = storeToRefs(productStore)

// STORE ACTIONS
productStore.getProduct(stringToBase64AndReverse.fromBase64String(route.params.productId))
</script>

<style scoped>
</style>