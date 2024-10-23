<template>
  <main class="cart-wrapper">
    <section class="cart-wrapper-card" v-if="itemsInCart" >
      <h2 class="cart-wrapper-card-heading">
        <v-btn icon="mdi-arrow-left-thin" class="mr-4" elevation="0" @click="router.back()"></v-btn>
        <span>Shopping Bag ({{ itemsInCart }})</span>
      </h2>
      <div class="cart-wrapper-card-items" v-for="item in cart?.Items" :key="item?.productId">
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
              <span> - {{item?.color}}</span>
          </p>
          <p class="cart-wrapper-card-items-details-price">
            <span>{{ currency }}</span><span>{{ item?.price }}</span>
          </p>
          <div>
            <v-btn variant="outlined" size="x-small" @click="()=> cartStore.removeItemFromCart(item.productId)">
              <v-icon icon="mdi-trash-can-outline" size="18" class="mr-2" ></v-icon>
              <span>Remove</span>
            </v-btn>
          </div>
        </div>
        <div class="cart-wrapper-card-items-action">
              <v-btn size="x-small" icon="mdi-minus" elevation="0" class="icon-btn-bg-color" @click="()=>cartStore.updateCart(item.productPid, 'remove', true)"></v-btn>
              <input :value="item?.quantity" type="number" min="1" readOnly class="remove-cart-input-bg" />
              <v-btn  size="x-small" icon="mdi-plus" elevation="0" class="icon-btn-bg-color" @click="()=>cartStore.updateCart(item.productPid, 'add', true)"></v-btn>
        </div>
      </div>
      <div class="cart-wrapper-card-promo">
        <input placeholder="Promo code" />
        <v-btn size="x-small" icon="mdi-check" elevation="0" class="cart-promo-btn"></v-btn>
      </div>
      <div class="cart-wrapper-card-total">
        <p>Subt Total: {{ currency }} {{ cartTotal }}</p>
      </div>
      <div class="cart-wrapper-card-checkout-actions">
        <button class="continue-Shopping" @click="()=>router.push({name: 'landing'})">Continue Shopping</button>
        <button class="checkout-btn" @click="()=>router.push({name: 'checkout'})"><v-icon icon="mdi-basket-check" class="mr.2"></v-icon> <span>Checkout</span></button>
      </div>
    </section>
    <section class="empty-cart" v-if="!itemsInCart">
      <p>
        <v-icon size="120" :color="ColorHelper.colorsHelper('primary')">mdi-cart</v-icon>
      </p>
      <h2>Your shopping cart is empty</h2>
      <p>Start adding items to your cart by selecting from the product list.</p>
      <v-btn :color="ColorHelper.colorsHelper('primary')" @click="()=>router.push({name: 'landing'})" class="my-6">Start Shopping</v-btn>
    </section>
  </main>
</template>

<script setup>
import { useCartStore, useSetupStore } from '@/store';
import ColorHelper from '@/util/ColorHelper';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

// VUETIFY UTILS


// ROUTES
const router = useRouter();


// STORE AND STORE ACTIONS
const setupStore = useSetupStore();
const cartStore = useCartStore();
const { currency } = storeToRefs(setupStore);
const { itemsInCart, cart, cartTotal } = storeToRefs(cartStore)
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
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
}
</style>