<template>
  <main class="categories-wrapper">
    <section class="category-wrapper-card" >
      <h2 class="category-wrapper-card-heading bg-c-primary cool-borderradius">
        {{ categories.find(c=>c?.cid?.trim() === route.params.category?.trim())?.description }}
      </h2>
      <div :class="screenXExtraSmall ? '' : 'smAndUp'" :key="refreshProductView">
        <ProductListing v-for="product in categoryProducts"  :key="product.pid" :product="product"/>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useProductStore, useSetupStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import {  useRoute } from 'vue-router'
import ProductListing from '@/components/ProductListing.vue'

// ROUTING
const route = useRoute();


// STORE
const productStore = useProductStore()
const setupStore = useSetupStore()

// STORERE STATES AND GETTERS
const { products } = storeToRefs(productStore)
const { categories } = storeToRefs(setupStore)

// STORE ACTIONS
// productStore.getProducts()
// setupStore.getCategories()


// VARS
const screenXExtraSmall = ref(true);
const refreshProductView = ref(0);

// COMPUTED PROPERTIES
const categoryProducts = computed({
  get: () => {
    return products.value.filter((prod) => {
        return prod.category.trim() === route.params.category.trim()
    })
  }
})

// WATCH EFFECT
watch(
  () => window.outerWidth,
  (newWidth) => {
    if(newWidth > 325 ) {
      refreshProductView.value = refreshProductView.value + 1
      screenXExtraSmall.value = false;
    } else {
      refreshProductView.value = refreshProductView.value + 1
      screenXExtraSmall.value = true;
    }
  }
)


// Lifecycle Hooks
onMounted(() => {
  if(window?.outerWidth > 325 ) {
    screenXExtraSmall.value = false;
  }
})
</script>