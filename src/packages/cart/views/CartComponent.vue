<template>
  <main class="cart-wrapper">
    <section class="cart-wrapper-card">
      <h2 class="cart-wrapper-card-heading">
        <v-btn icon="mdi-arrow-left-thin" class="mr-4" elevation="0"></v-btn>
        <span>Shopping Bag ({{ 3 }})</span>
      </h2>
      <div class="cart-wrapper-card-items">
        <div>
         <v-avatar class="square-avatar">
            <v-img
                src="http://localhost:3500/public/image/products/AAA70GIZE5AUV.png"  
                alt="colored-phts"          
            >

            </v-img>
         </v-avatar>
        </div>
        <div>
          <v-row>
            <v-col>
              <span>Product Name</span>
            </v-col>
            <v-col>
              <span>(Medi)</span>
            </v-col>
            <v-col>
              <span>- red</span>
            </v-col>
          </v-row>
        </div>
        <div>
          <v-row>
            <v-col>
              <v-btn icon="mdi-minus"></v-btn>
            </v-col>
            <v-col>
              <v-text-field v-model="quantity" type="number" min="1"></v-text-field>
            </v-col>
            <v-col>
              <v-btn icon="mdi-plus"></v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
      <div>
        <v-row>
          <v-col>
            <span>{{ currency }} {{ amount }}</span>
          </v-col>
        </v-row>
      </div>
      <div class="cart-wrapper-card-promo">
        <v-text-field label="Promo code"></v-text-field>
        <button>Apply</button>
      </div>
      <div class="cart-wrapper-card-total">
        <h3>Total: {{ currency }} {{ amount }}</h3>
      </div>
      <div class="cart-wrapper-card-checkout">
        <ButtonComponent caption="Continue Shopping"></ButtonComponent>
        <ButtonComponent caption="Checkout" preIcon="mdi-basket-check"></ButtonComponent>
      </div>
    </section>
  </main>
</template>

<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue'
import { ref } from 'vue'
const currency = ref('$')
const amount = ref(23)
const quantity = ref(1)
</script>

<style scoped>
.square-avatar {
  border-radius: 8px;
}

</style>