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
            <template v-slot:icon>
              <v-icon siz="50" >mdi-truck-fast</v-icon>
            </template>
            <template v-slot:title>
              <span>Shipping Address</span>
            </template>
            <component :is="ShippingAddress"></component>
            <template v-slot:next>
                <v-btn :color="ColorHelper.colorsHelper('primary')" variant="flat">
                    <span>continue to Payments</span>
                </v-btn>
            </template>
            <template v-slot:prev v-if="true">
                <v-btn>
                    <span></span>
                </v-btn>
            </template>
          </v-stepper-vertical-item>
        <v-stepper-vertical-item>
          <template v-slot:icon>
            <v-icon :color="ColorHelper.colorsHelper('secondary')" siz="50" >mdi-credit-card</v-icon>
          </template>
          <template v-slot:title>
           <div style="display: flex; align-items: center;">
            <h3 style="font-weight: 500;">Payment Methods</h3>
           </div>
        </template>
        <component :is="PaymentMethod"></component>
        <template v-slot:next>
            <v-btn :color="ColorHelper.colorsHelper('primary')" variant="flat">
                <span>Pay {{  }} NOW </span>
            </v-btn>
        </template>
        <template v-slot:prev>
            <v-btn>
                <span></span>
            </v-btn>
        </template>
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
import ColorHelper from '@/util/ColorHelper'

//VUETIFY
const { mdAndDown } = useDisplay()
</script>