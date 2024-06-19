<template>
  <main class="categories-wrapper">
    <section class="category-wrapper-card" v-for="(category, i) in categorizedProducts" :key="i">
      <h2 class="category-wrapper-card-heading">{{ Object.keys(category)[0] }}</h2>
      <div
        class="category-wrapper-card-product"
        v-for="(product, index) in category[Object.keys(category)[0]]"
        :key="index"
        @click="
          () =>
            router.push({
              name: 'productDetails',
              params: {
                category: stringToBase64AndReverse.toBase64String(Object.keys(category)[0]),
                productId: stringToBase64AndReverse.toBase64String(product.pid)
              }
            })
        "
      >
        <div class="category-wrapper-card-product-image">
          <img :src="product.image" alt="product.name" />
        </div>
        <div class="category-wrapper-card-product-info">
          <div class="category-wrapper-card-product-info-name">
            {{ product.name }}
          </div>
          <div class="category-wrapper-card-product-info-price">
            {{ product.price }}
          </div>
        </div>
        <div class="category-wrapper-card-product-button">
          <button class="category-wrapper-card-product-button-add-to-cart">Add to cart</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useProductStore, useSetupStore } from '@/store'
import stringToBase64AndReverse from '@/util/stringToBase64AndReverse'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// ROUTING
const router = useRouter();


// STORE
const productStore = useProductStore()
const setupStore = useSetupStore()

// STORERE STATES AND GETTERS
const { products } = storeToRefs(productStore)
const { categories } = storeToRefs(setupStore)

// STORE ACTIONS
productStore.getProducts()
setupStore.getCategories()

// COMPUTED PROPERTIES
const categorizedProducts = computed({
  get: () => {
    return categories.value.map((category) => {
      const categoryProducts = products.value.filter((product) => {
        return product.category.trim() === category.cid.trim()
      })
      return { [category.cid]: categoryProducts }
    })
  }
})

// WATCH EFFECT

// Lifecycle Hooks
onMounted(() => {})
</script>

<style scoped>
</style>