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
      <v-stepper-vertical v-else v-model="verticalStep">
        <v-stepper-vertical-item>
          <template v-slot:icon>
            <v-icon siz="50">mdi-truck-fast</v-icon>
          </template>
          <template v-slot:title>
            <div style="display: flex; align-items: center">
              <h3 style="font-weight: 500">Shipping Address</h3>
            </div>
          </template>
          <component :is="ShippingAddress"></component>
          <template v-slot:next>
            <v-btn
              :color="ColorHelper.colorsHelper('primary')"
              :variant="editAddressform ? 'flat' : 'text'"
              block
              :style="` padding: 1.4rem 0;`"
              @click="performAction"
            >
              <span style="font-weight: 600">{{ btnCaption() }}</span>
              <v-icon :color="ColorHelper.colorsHelper('primary')" size="30" left v-if="!editAddressform">
                mdi-chevron-right
              </v-icon>
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
            <v-icon :color="ColorHelper.colorsHelper('secondary')" siz="50">mdi-credit-card</v-icon>
          </template>
          <template v-slot:title>
            <div style="display: flex; align-items: center">
              <h3 style="font-weight: 500">Payment Methods</h3>
            </div>
          </template>
          <component :is="PaymentMethod"></component>
          <template v-slot:next>
            <v-btn :color="ColorHelper.colorsHelper('primary')" variant="flat">
              <span>Pay {{}} NOW </span>
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
import { globalEventBus, useToast } from 'vue-toastification'
import { onMounted, ref, watch } from 'vue'
import { useProfile } from '@/store'
import { storeToRefs } from 'pinia'

//VUETIFY
const { mdAndDown } = useDisplay()

// ROUTING

// APP STORE
const profileStore = useProfile()
const { editAddressform } = storeToRefs(profileStore)

const verticalStep = ref(0)

// HOOKS
onMounted(() => {
  globalEventBus.on('moveToPayments', () => {
    verticalStep.value = 1
  })
})

// COMPUTED

// UI UPDATES
watch(
  () => editAddressform.value,
  () => {
    btnCaption()
  },
  { immediate: true , deep: true}
)

// METHODS
function btnCaption () {
  return editAddressform.value ? 'update address' : 'continue to payments'
}
function commitAddressAndNext() {
  try {
    globalEventBus.emit('commitAddress')
  } catch (error) {
    useToast().error(error.message)
  }
}
function performAction() {
  if (editAddressform.value) {
    globalEventBus.emit('updateAddress')
  } else {
    commitAddressAndNext()
  }
}
</script>