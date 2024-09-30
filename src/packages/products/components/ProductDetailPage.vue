<template>
  <main class="product-wrapper">
    <section class="product-wrapper-card" v-if="Object.keys(product).length">
      <div class="product-wrapper-card--image-holder">
        <img :src="product?.Images[0]?.url" alt="Product" />
      </div>
      <div class="product-detailedpage-close-btn-holder">
       <v-btn
       v-tooltip="'Close'"
       icon
       elevation="0"
       class="vbtn-close-bg"
       @click="closeProductDetailPage"
       >
        <v-icon 
        class="mr-2"
        :color="ColorHelper.colorsHelper('error')"
        >
          mdi-close
        </v-icon>
       </v-btn>
      </div>
      <div class="product-detailpage-interaction-btn-holder">
        <v-btn @click="async () => await addToWishlist(product.pid)"
          icon
          class="bg-c-primary"
          v-if="!numberOfProductInWishlist"
          v-tooltip="'Add to Wishlist'"
          elevation="0"
          >
          <v-icon class="mr-2" :color="ColorHelper.colorsHelper('primary')">mdi-heart-outline</v-icon>
          <span v-if="lgAndUp">Add to Wishlist</span>
        </v-btn>
        <v-btn @click="openShareDialog" class="bg-c-primary"
        v-tooltip="'Share'"
        icon
        elevation="0"
        >
          <v-icon class="mr-2" :color="ColorHelper.colorsHelper('primary')">mdi-share-variant</v-icon>
          <span v-if="lgAndUp">Share</span>
        </v-btn>
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
        <v-btn @click="async () =>await cartStore.createCart({...product, quantity: 1})" class="bg-c-primary" v-if="!numberOfProductInCart">
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
import ColorHelper from '@/util/ColorHelper';
import stringToBase64AndReverse from "@/util/stringToBase64AndReverse";
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';


// VUETIFY
const { lgAndUp} = useDisplay();

// ROUTES
const route = useRoute();
const router = useRouter();

// STORE
const productStore = useProductStore()
const setupStore = useSetupStore()
const cartStore = useCartStore();

// STORE STATES AND GETTERS
const { product } = storeToRefs(productStore)
const { currency } = storeToRefs(setupStore)
const {cart} = storeToRefs(cartStore);

// STORE ACTIONS

onMounted(() => {
  productStore.getProduct(stringToBase64AndReverse.fromBase64String(route.params.productId));
})

// Component REFS and STATE
const itemInCart = ref(undefined);
const numberOfProductInCart = ref(0);
const numberOfProductInWishlist = ref(0);

// WATCHERS
watch(
  () => [product.value, cart.value], 
  () => {
    itemInCart.value = cart.value.Items?.find(item => item.productPid === product.value.pid)
}, {deep: true, immediate: true})
watch(
  () => itemInCart.value, 
  (newValue) => {
    numberOfProductInCart.value = newValue?.quantity;
}, {deep: true, immediate: true})



// COMPONENT METHODS
function closeProductDetailPage() {
  router.back();
}
</script> 

<style scoped>
</style>