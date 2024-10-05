<template>
  <div class="checkout-summary">
    <v-card elevation="0">
      <v-card-title> Checkout Summary </v-card-title>
      <v-card-text class="checkoutlinesCard"><p> Subtotal</p> <p>{{currency}} {{ subTotalAmount }}</p> </v-card-text>
      <v-card-text class="checkoutlinesCard" > <p>Delivery</p><p>{{currency}} {{ shippingAmount }}</p></v-card-text>
      <v-card-text class="checkoutlinesCard"> <p class="totalTextTypography">Total</p><p class="totalTextTypography">{{currency}} {{ amountToPay }}</p></v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { useCartStore, useSetupStore } from '@/store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';


// APP STORE
const cartStore = useCartStore()
const setupStore = useSetupStore()
const { amountToPay, subTotalAmount, shippingAmount } = storeToRefs(cartStore);
const { currency } = storeToRefs(setupStore);


// HOOKS
onMounted(async() => {
    await cartStore.setCheckoutAmounToPay()
})

</script>