<template>
  <main class="checkout-main">
    <section class="checkout-card">
      <v-stepper v-if="!mdAndDown">
        <v-stepper-item>
          <template v-slot:default>
            <v-icon>mdi-credit-card</v-icon>
            <span>Payment method</span>
            <component :is="PaymentMethod"></component>
          </template>
        </v-stepper-item>
        <v-stepper-item>
          <template v-slot:default>
            <v-icon>mdi-truck-fast</v-icon>
            <span>Shipping Address</span>
            <component :is="ShippingAddress"></component>
          </template>
        </v-stepper-item>
        <v-stepper-item>
          <template v-slot:default>
            <v-icon>mdi-file-document-edit-outline</v-icon>
            <span>Review Order</span>
            <component :is="checkoutSummary"></component>
          </template>
        </v-stepper-item>
      </v-stepper>
      <v-stepper-vertical v-else>
          <v-stepper-vertical-item>
            <template v-slot:title>
              <v-icon class="mx-3">mdi-truck-fast</v-icon>
              <span>Shipping Address</span>
            </template>
            <component :is="ShippingAddress"></component>
          </v-stepper-vertical-item>
        <v-stepper-vertical-item>
          <template v-slot:title>
            <v-icon class="mx-3">mdi-credit-card</v-icon>
            <span>Payment method</span>
        </template>
        <component :is="PaymentMethod"></component>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item>
          <template v-slot:default>
            <v-icon>mdi-file-document-edit-outline</v-icon>
            <span>Review Order</span>
            <component :is="checkoutSummary"></component>
          </template>
        </v-stepper-vertical-item>
      </v-stepper-vertical>
    </section>
  </main>
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import PaymentMethod from './PaymentMethod.vue'
import ShippingAddress from './ShippingAddress.vue'
import checkoutSummary from './checkoutSummary.vue'
import { VStepperVertical } from 'vuetify/lib/labs/components.mjs'

//VUETIFY
const { mdAndDown } = useDisplay()
</script>