<template>
  <main class="checkout-wrapper min-h-screen bg-grey-lighten-5 py-8 px-4 md:px-8">

    <!-- Header -->
    <div class="max-w-5xl mx-auto mb-8 d-flex align-center">
      <v-btn icon variant="text" @click="$router.back()" class="mr-2">
        <v-icon size="28">mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="text-h4 font-weight-bold text-grey-darken-3">Checkout</h1>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Left Column: Steps -->
      <div class="lg:col-span-2">

        <!-- Desktop Horizontal Stepper (Visual Indicator) -->
        <div v-if="!mdAndDown" class="mb-8">
          <v-sheet class="rounded-xl pa-4 d-flex align-center justify-space-between bg-white border">
            <div v-for="(step, index) in steps" :key="index" class="d-flex align-center gap-2"
              :class="{ 'text-primary font-weight-bold': verticalStep === index, 'text-grey': verticalStep !== index }">
              <v-avatar size="32" :color="verticalStep >= index ? 'primary' : 'grey-lighten-2'"
                class="text-body-2 font-weight-bold">
                <v-icon v-if="verticalStep > index" color="white" size="18">mdi-check</v-icon>
                <span v-else class="text-white">{{ index + 1 }}</span>
              </v-avatar>
              <span>{{ step.title }}</span>
              <v-icon v-if="index < steps.length - 1" class="mx-4 text-grey-lighten-2">mdi-chevron-right</v-icon>
            </div>
          </v-sheet>
        </div>

        <!-- Step Content Area -->
        <v-card elevation="0" border class="rounded-xl overflow-hidden bg-white pa-6 mb-6">
          <v-window v-model="verticalStep" :touch="false">

            <!-- Step 1: Shipping -->
            <v-window-item :value="0">
              <div class="mb-6">
                <h2 class="text-h5 font-weight-bold mb-4 d-flex align-center">
                  <v-icon color="primary" class="mr-3">mdi-truck-fast</v-icon>
                  Shipping Address
                </h2>
                <component :is="ShippingAddress"></component>
              </div>
              <div class="d-flex justify-end mt-6">
                <v-btn color="primary" size="x-large" rounded="pill" elevation="4" class="font-weight-bold px-8"
                  :variant="editAddressform || addAnotherAddress ? 'flat' : 'elevated'" @click="performAction">
                  {{ btnCaption() }}
                  <v-icon end icon="mdi-arrow-right" v-if="!editAddressform && !addAnotherAddress"></v-icon>
                </v-btn>
              </div>
            </v-window-item>

            <!-- Step 2: Review -->
            <v-window-item :value="1">
              <div class="mb-6">
                <h2 class="text-h5 font-weight-bold mb-4 d-flex align-center">
                  <v-icon color="primary" class="mr-3">mdi-file-document-outline</v-icon>
                  Review Order
                </h2>
                <component :is="checkoutSummary"></component>
              </div>
              <div class="d-flex justify-space-between mt-6">
                <v-btn variant="text" size="large" @click="moveBackAction(0)" class="px-4">
                  <v-icon start>mdi-arrow-left</v-icon> Back
                </v-btn>
                <v-btn color="primary" size="x-large" rounded="pill" elevation="4" class="font-weight-bold px-8"
                  @click="initiateAction">
                  Proceed to Payment
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </v-window-item>

            <!-- Step 3: Payment -->
            <v-window-item :value="2">
              <div class="mb-6">
                <h2 class="text-h5 font-weight-bold mb-4 d-flex align-center">
                  <v-icon color="primary" class="mr-3">mdi-credit-card</v-icon>
                  Payment Method
                </h2>
                <component :is="PaymentMethod"></component>
              </div>
              <div class="d-flex justify-space-between mt-6 align-center">
                <v-btn variant="text" size="large" @click="moveBackAction(1)" class="px-4">
                  <v-icon start>mdi-arrow-left</v-icon> Back
                </v-btn>
                <!-- Payment Action is usually inside PaymentMethod or triggered here -->
                <!-- Assuming PaymentMethod component handles the actual pay button or we show a summary pay button -->
                <div class="text-h6 font-weight-bold text-primary">
                  Total: {{ currency }} {{ amountToPay }}
                </div>
              </div>
            </v-window-item>
          </v-window>
        </v-card>
      </div>

      <!-- Right Column: Sticky Summary (Desktop Only) -->
      <div v-if="!mdAndDown" class="lg:col-span-1">
        <div class="sticky top-24">
          <v-card elevation="0" border class="rounded-xl pa-6 bg-white">
            <h3 class="text-h6 font-weight-bold mb-4">Order Summary</h3>
            <div class="space-y-3 mb-4">
              <div class="d-flex justify-space-between text-body-2 text-grey-darken-1">
                <span>Subtotal</span>
                <span>{{ currency }} {{ amountToPay }}</span> <!-- Using amountToPay as proxy for now -->
              </div>
              <div class="d-flex justify-space-between text-body-2 text-grey-darken-1">
                <span>Shipping</span>
                <span class="text-success font-weight-medium">Calculated</span>
              </div>
              <v-divider></v-divider>
              <div class="d-flex justify-space-between text-h6 font-weight-bold mt-2">
                <span>Total</span>
                <span>{{ currency }} {{ amountToPay }}</span>
              </div>
            </div>

            <div class="d-flex align-center gap-2 text-caption text-grey mt-4">
              <v-icon size="small" color="success">mdi-lock</v-icon>
              Secure SSL Encryption
            </div>
          </v-card>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import PaymentMethod from './PaymentMethod.vue'
import ShippingAddress from './ShippingAddress.vue'
import checkoutSummary from './checkoutSummary.vue'
import ColorHelper from '@/util/ColorHelper'
import { globalEventBus, useToast } from 'vue-toastification'
import { onMounted, ref, watch } from 'vue'
import { useCartStore, useProfile, useSetupStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

//VUETIFY
const { mdAndDown } = useDisplay()

// ROUTING
const route = useRoute()
const router = useRouter()

// APP STORE
const profileStore = useProfile()
const cartStore = useCartStore()
const setupStore = useSetupStore()
const { editAddressform, addAnotherAddress, address } = storeToRefs(profileStore)
const { amountToPay } = storeToRefs(cartStore)
const { currency } = storeToRefs(setupStore)
const verticalStep = ref(0)

const steps = [
  { title: 'Shipping' },
  { title: 'Review' },
  { title: 'Payment' }
];

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
  let caption = 'Continue'
  if (addAnotherAddress.value) {
    caption = 'Add Another Address'
  }
  if (editAddressform.value) {
    caption = 'Update Address'
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
function moveBackAction(step) {
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
function initiateAction() {
  globalEventBus.emit('moveToNext', 2)
}
</script>