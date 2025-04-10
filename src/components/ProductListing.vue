<template>
  <article class="product-listing-wrapper cool-shadow cool-borderradius"
    @click="() => router.push({ name: 'productDetails', params: { category: product.category, productId: stringToBase64AndReverse.toBase64String(product.pid) } })">
    <div class="productlisting-image" :style="`
  background-image:url(${product?.Images[0].url});
  `
      ">

    </div>
    <div class="product-details">
      <p class="product-details-name">
        {{ product?.name }}
      </p>
      <p class="product-details-price" disabled>{{ currency }} {{ product?.price }}</p>
      <p class="product-details-availability">{{ product.quantity }} in stock</p>
    </div>
    <div class="cta-btn">
      <v-btn color="primary" variant="flat" rounded="pill" v-if="!Object.keys(productInCart).length"
        @click.stop="addToCart(product)">
        <v-icon class="mr-3">mdi-cart-outline</v-icon>
        <span class="text-capitalize">add </span><span style="margin-left: .4rem;" class="text-lowecase"> to
          cart</span>
      </v-btn>
      <div class="cta-btn-group-container" v-if="Object.keys(productInCart).length"
        @click.stop="cartUpdate(product, $event)">
        <v-btn variant="text" data-type-remove>
          <v-icon data-type-remove>mdi-minus</v-icon>
        </v-btn>
        <span>
          {{ productInCart.quantity }}
        </span>
        <v-btn variant="text" data-type-add>
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
  const item = cart.value.Items.find((it) => it.pid === props.product.pid)
  if (item) {
    return item
  }
  return {}
})

</script>