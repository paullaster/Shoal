<template>
  <article 
    class="group relative product-listing-wrapper cool-borderradius bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl overflow-hidden"
    @click="() => router.push({ name: 'productDetails', params: { productId: stringToBase64AndReverse.toBase64String(product?.productId) } })">
    
    <div class="productlisting-image h-48 w-full overflow-hidden">
      <div 
        class="h-full w-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
        :style="`background-image:url(${product?.images?.[0]?.url});`">
      </div>
    </div>

    <div class="product-details p-4">
      <p class="text-base font-semibold text-gray-800 truncate" :title="product?.name">
        {{ product?.name }}
      </p>
      <p class="text-lg font-bold text-gray-900">{{ currency }} {{ product?.price }}</p>
      
      <!-- Modern Availability Indicator -->
      <div class="mt-1">
        <!-- "In Stock" Indicator -->
        <div v-if="product.isAvailable" class="flex items-center">
          <span class="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
          <span class="text-xs text-gray-600">In Stock</span>
        </div>

        <!-- "Out of Stock" Indicator -->
        <div v-else class="flex items-center">
          <span class="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
          <span class="text-xs text-gray-500">Out of Stock</span>
        </div>
      </div>
    </div>

    <!-- God-level CTA: Slides up on hover -->
    <div class="cta-btn absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/80 to-transparent opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
      <v-btn color="primary" variant="flat" rounded="pill" v-if="!Object.keys(productInCart).length"
        @click.stop="addToCart(product)" class="w-full shadow-lg">
        <v-icon class="mr-2">mdi-cart-outline</v-icon>
        Add to Cart
      </v-btn>
      <div class="cta-btn-group-container flex justify-around items-center bg-white rounded-pill shadow-lg p-1" v-if="Object.keys(productInCart).length"
        @click.stop="cartUpdate(product, $event)">
        <v-btn variant="text" data-type-remove rounded="circle">
          <v-icon data-type-remove>mdi-minus</v-icon>
        </v-btn>
        <span class="font-bold text-lg">
          {{ productInCart.quantity }}
        </span>
        <v-btn variant="text" data-type-add rounded="circle">
          <v-icon data-type-add>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
  </article>
</template>

<script setup>
import { useCartStore, useSetupStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router';
import stringToBase64AndReverse from '@/util/stringToBase64AndReverse'
import { computed } from 'vue';
import useProduct from '@/composables/useProduct';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
// ROUTES
const router = useRouter()
const { addToCart, cartUpdate } = useProduct()

// STORE
const setupStore = useSetupStore()
const cartStore = useCartStore()
const { currency } = storeToRefs(setupStore)
const { cart } = storeToRefs(cartStore)

// Computed
const productInCart = computed(() => {
  const item = cart.value.Items.find((it) => it.productPid === props.product.pid)
  if (item) {
    return item
  }
  return {}
})

</script>
