<template>
  <article class="product-listing-wrapper cool-shadow cool-borderradius" 
  @click="()=>router.push({name: 'productDetails', params: {category: product.category,productId: stringToBase64AndReverse.toBase64String(product.pid)}})"
  >
    <div class="product-image">
      <img :src="product?.Images[0].url" alt="product" class="img-sm"/>
    </div>
    <div class="product-details">
      <p>
        {{ product?.name }}
      </p>
      <p>{{ currency }} {{ product?.price }}</p>
    </div>
    <div class="available"></div>
  </article>
</template>

<script setup>
import { defineProps } from 'vue'
import { useSetupStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router';
import stringToBase64AndReverse from '@/util/stringToBase64AndReverse';
defineProps({
  product: {
    type: Object,
    required: true
  }
})
// ROUTES
const router = useRouter()

// STORE
const setupStore = useSetupStore()
const { currency } = storeToRefs(setupStore)

</script>