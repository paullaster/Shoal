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
      <v-stepper-vertical v-else v-model="verticalStep" elevation="0" >
        <v-stepper-vertical-item>
          <template v-slot:icon>
            <v-icon :color="ColorHelper.colorsHelper(address.length ? 'success':'solidgrey')" siz="50">mdi-truck-fast</v-icon>
          </template>
          <template v-slot:title>
            <div style="display: flex; align-items: center">
              <h3 style="font-weight: 500">Shipping Address</h3>
            </div>
          </template>
          <component :is="ShippingAddress"></component>
          <template v-slot:next>
            <div
            style="
            display: flex;
            justify-content: flex-start;
            position: absolute;
            right: 4%;
            "
            >
            <v-btn
              :color="ColorHelper.colorsHelper('primary')"
              :variant="editAddressform || addAnotherAddress ? 'flat' : 'text'"
              @click="performAction"
              :disabled="false"
            >
              <span style="font-weight: 600">{{ btnCaption() }}</span>
              <v-icon
                :color="ColorHelper.colorsHelper('primary')"
                size="30"
                left
                v-if="!editAddressform || !addAnotherAddress"
              >
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </div>
          </template>
          <template v-slot:prev>
            <v-btn>
              <span></span>
            </v-btn>
          </template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item>
          <template v-slot:icon>
            <v-icon :color="ColorHelper.colorsHelper(verticalStep >= 1 ? 'success':'solidgrey')" >mdi-file-document-edit-outline</v-icon>
          </template>
          <template v-slot:title>
            <div style="display: flex; align-items: center">
              <h3 style="font-weight: 500">Review Order</h3>
            </div>
          </template>
          <component :is="checkoutSummary"></component>
          <template v-slot:next>
            <div
            style="
            display: flex;
            justify-content: flex-start;
            width: 100%;
            "
            >
            <v-btn variant="text" @click="moveBackAction(0)"
            style=" 
            margin-left:-1.6rem !important;
            "
            >
              <v-icon size="40" class="mx-0"> mdi-chevron-left </v-icon>
              <span>Back</span>
            </v-btn>
          </div>
          </template>
          <template v-slot:prev>
            <div
            style="
            display: flex;
            justify-content: flex-end;
            width: 100%;
            "
            >
            <v-btn 
            :color="ColorHelper.colorsHelper('primary')" 
            variant="text" 
            @click="initiateAction"
            style=" 
            margin-right:0 !important;
            "
            >
              <span>Proceed to Pay</span>
              <v-icon size="40"> mdi-chevron-right </v-icon>
            </v-btn>
            </div>
          </template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item>
          <template v-slot:icon>
            <v-icon :color="ColorHelper.colorsHelper(verticalStep === 2 ? 'secondary' : 'solidgrey')" siz="50">mdi-credit-card</v-icon>
          </template>
          <template v-slot:title>
            <div style="display: flex; align-items: center">
              <h3 style="font-weight: 500">Payment Methods</h3>
            </div>
          </template>
          <component :is="PaymentMethod"></component>
          <template v-slot:prev>
            <div
            style="
            display: flex;
            justify-content: flex-end;
           width: 100%;
            "
            >
            <v-btn :color="ColorHelper.colorsHelper('primary')" variant="flat" style="margin-right: 0;">
              <span>Pay {{ currency }}{{ amountToPay }} NOW </span>
            </v-btn>
          </div>
          </template>
          <template v-slot:next>
            <div
            style="
            display: flex;
            justify-content: flex-start;
            position: absolute; left: 2%;
            "
            >
            <v-btn variant="text" @click="moveBackAction(1)">
              <v-icon size="40"> mdi-chevron-left </v-icon>
              <span style="font-weight: 500">back</span>
            </v-btn>
          </div>
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
import { useCartStore, useProfile, useSetupStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

//VUETIFY
const { mdAndDown } = useDisplay()

// ROUTING
const route = useRoute()

// APP STORE
const profileStore = useProfile()
const cartStore = useCartStore()
const setupStore = useSetupStore()
const { editAddressform, addAnotherAddress, address } = storeToRefs(profileStore)
const { amountToPay } = storeToRefs(cartStore)
const { currency } = storeToRefs(setupStore)
const verticalStep = ref(0)

// HOOKS
onMounted(() => {
  profileStore.$patch({
    addAnotherAddress: false,
    editAddressform: false,
    forceChangeUpgate: 1
  })

  // SET ACTIVE STEP
  if (route.query?.step) {
    verticalStep.value = parseInt(route.query.step)
  } else {
    verticalStep.value = 0
    const url = new URL(location)
    url.searchParams.set('step', verticalStep.value.toString())
    history.pushState({}, '', url)
  }

  globalEventBus.on('moveToNext', (step) => {
    moveNextAction(step)
  })
})
// COMPUTED

// UI UPDATES
watch(
  () => editAddressform.value,
  () => {
    btnCaption()
  },
  { immediate: true, deep: true }
)

// METHODS
function btnCaption() {
  let caption = 'continue'
  if (addAnotherAddress.value) {
    caption = 'add another address'
  }
  if (editAddressform.value) {
    caption = 'update address'
  }
  return caption
}
function commitAddressAndNext() {
  try {
    if (!editAddressform.value && !addAnotherAddress.value && address.value.length) {
      moveNextAction(1)
    } else {
      globalEventBus.emit('commitAddress')
    }
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
function moveBackAction (step) {
  verticalStep.value = parseInt(step);
    const url = new URL(location)
    url.searchParams.set('step', step.toString())
    history.pushState({}, '', url)
}
function moveNextAction(step) {
  verticalStep.value = step
    const url = new URL(location)
    url.searchParams.set('step', step)
    history.pushState({}, '', url)
}
function initiateAction () {
  globalEventBus.emit('moveToNext', 2)
}
</script>