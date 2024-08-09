<template>
  <main class="cart-wrapper">
    <section class="cart-wrapper-card">
      <h2 class="cart-wrapper-card-heading">
        <v-btn icon="mdi-arrow-left-thin" class="mr-4" elevation="0" @click="router.back()"></v-btn>
        <span>Shopping Bag ({{ itemsInCart }})</span>
      </h2>
      <div class="cart-wrapper-card-items" v-for="item in cart?.Item" :key="item?.productId">
        <div class="cart-wrapper-card-items-image">
          <v-avatar class="square-avatar">
            <v-img
              :src="item?.image"
              alt="product photos"
            >
            </v-img>
          </v-avatar>
        </div>
        <div class="cart-wrapper-card-items-details">
          <p class="cart-wrapper-card-items-details-name-attribute">
              <span>{{ item?.name }}</span>
              <span>({{ item?.size }})</span>
              <span> - {{item.color}}</span>
          </p>
          <p class="cart-wrapper-card-items-details-price">
            <span>{{ currency }}</span><span>{{ item?.price }}</span>
          </p>
        </div>
        <div class="cart-wrapper-card-items-action">
              <v-btn size="x-small" icon="mdi-minus" elevation="0" class="icon-btn-bg-color"></v-btn>
              <input :value="item?.quantity" type="number" min="1" readOnly class="remove-cart-input-bg" />
              <v-btn  size="x-small" icon="mdi-plus" elevation="0" class="icon-btn-bg-color"></v-btn>
        </div>
      </div>
      <div class="cart-wrapper-card-promo">
        <input placeholder="Promo code" />
        <v-btn size="x-small" icon="mdi-check" elevation="0" class="cart-promo-btn"></v-btn>
      </div>
      <div class="cart-wrapper-card-total">
        <p>Total: {{ currency }} {{ amount }}</p>
      </div>
      <div class="cart-wrapper-card-checkout-actions">
        <button class="continue-Shopping" @click="()=>router.push({name: 'landing'})">Continue Shopping</button>
        <button class="checkout-btn" ><v-icon icon="mdi-basket-check" class="mr.2"></v-icon> <span>Checkout</span></button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useCartStore, useSetupStore } from '@/store';
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import { useRouter } from 'vue-router';


// ROUTES
const router = useRouter();


// STORE AND STORE ACTIONS
const setupStore = useSetupStore();
const cartStore = useCartStore();
const { currency } = storeToRefs(setupStore);
const { itemsInCart, cart } = storeToRefs(cartStore)
const amount = ref(23)
const quantity = ref(1)
</script>

<style scoped>
.square-avatar {
  border-radius: 8px;
}
.icon-btn-bg-color {
background-color: var(--vt-c-primary-light-2);
}
.remove-cart-input-bg, .remove-cart-input-bg:hover, .remove-cart-input-bg:focus {
  background-color: transparent !important;
  border:none !important;
  width: 100%;
  outline: none !important;
}
.cart-promo-btn {
  background-color: transparent !important;
  color: var(--vt-c-primary);
}
</style>