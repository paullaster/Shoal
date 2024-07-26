<template>
  <main class="cart-wrapper">
    <section class="cart-wrapper-card">
      <h2 class="cart-wrapper-card-heading">
        <v-btn icon="mdi-arrow-left-thin" class="mr-4" elevation="0" @click="router.back()"></v-btn>
        <span>Shopping Bag ({{ 1 }})</span>
      </h2>
      <div class="cart-wrapper-card-items">
        <div class="cart-wrapper-card-items-image">
          <v-avatar class="square-avatar">
            <v-img
              src="http://192.168.0.103:3500/public/image/products/AAA70GIZE5AUV.png"
              alt="colored-phts"
            >
            </v-img>
          </v-avatar>
        </div>
        <div class="cart-wrapper-card-items-details">
          <p class="cart-wrapper-card-items-details-name-attribute">
              <span>Product Name</span>
              <span>(Medi)</span>
              <span> - red</span>
          </p>
          <p class="cart-wrapper-card-items-details-price">
            <span>{{ currency }}</span><span>{{ amount }}</span>
          </p>
        </div>
        <div class="cart-wrapper-card-items-action">
              <v-btn size="x-small" icon="mdi-minus" elevation="0" class="icon-btn-bg-color"></v-btn>
              <input :value="quantity" type="number" min="1" readOnly class="remove-cart-input-bg" />
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
        <button class="continue-Shopping">Continue Shopping</button>
        <button class="checkout-btn" ><v-icon icon="mdi-basket-check" class="mr.2"></v-icon> <span>Checkout</span></button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';


// ROUTES
const router = useRouter();



const currency = ref('$')
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