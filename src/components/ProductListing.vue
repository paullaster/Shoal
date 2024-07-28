<template>
  <article class="product-listing-wrapper cool-shadow cool-borderradius">
    <div class="product-image">
      <img :src="product?.image" alt="product" class="img-sm"/>
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
defineProps({
  product: {
    type: Object,
    required: true
  }
})
// STORE
const setupStore = useSetupStore()
const { currency } = storeToRefs(setupStore)
</script>