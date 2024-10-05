<template>
  <div class="payment-method">
    <div class="fieldset-mobile">
      <div class="express-checkout-mobile">
        <div class="mpesa">
          <v-btn
            size="large"
            block
            style="display: flex; align-items: center"
            @click="payWithMpesa"
            :color="ColorHelper.colorsHelper('secondary')"
            variant="flat"
          >
          <span style="display: block; font-weight: bold;">PAY WITH </span>
            <img :src="mpesaLogo" alt="MPESA" style="display: block; margin-left: 0.2rem" />
          </v-btn>
        </div>
      </div>
    </div>

    <div class="division-line">
      <div class="division-line-card">
        <span class="openning-line"></span>
        <span>or pay with card</span>
        <span class="closing-line"></span>
      </div>
    </div>
    <div>
      <div>
        <div>
          <v-card-text tag="p"> Enter your card details </v-card-text>
          <v-form ref="cardForm">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="cardNumber"
                  label="Card Number"
                  placeholder="Enter Card Number"
                  variant="outlined"
                  :rules="[required]"
                >
                  <template v-slot:append-inner>
                    <v-icon size="30" :color="ColorHelper.colorsHelper('secondary')"> mdi-credit-card </v-icon>
                  </template>
                </v-text-field>
                <div class="accepted-card-logos">
                  <div>
                    <v-img :src="visaLogo" tag="img" width="10%"></v-img>
                  </div>
                  <div>
                    <v-img :src="mastercardLogo" tag="img" width="10%"></v-img>
                  </div>
                </div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="expiryDate"
                  placeholder="MM/YY"
                  variant="outlined"
                  :rules="[required]"
                  @input="formatExpiryDate"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="cvv" label="CVV" variant="outlined" :rules="[required]" />
              </v-col>
            </v-row>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import mpesaLogo from '@/assets/images/M-PESA_LOGO-01.svg'
// import googleLogo from "@/assets/images/google.svg"
import visaLogo from '@/assets/images/Visa_Inc._logo.svg'
import mastercardLogo from '@/assets/images/Mastercard-logo.svg'
import { useAuth, useCartStore, useGlobalStore, useSetupStore } from '@/store'
import { storeToRefs } from 'pinia'
import ColorHelper from '@/util/ColorHelper'
import { globalEventBus, useToast } from 'vue-toastification'
import { onMounted, ref } from 'vue'

const authStore = useAuth()
const globalStore = useGlobalStore()
const setupStore = useSetupStore()
const cartStore = useCartStore()
const { user } = storeToRefs(authStore)
const { currency } = storeToRefs(setupStore)
const { cart } = storeToRefs(cartStore);

// COMPONENT STATE
const amountToPay = ref(0)

// COMPONENT HOOKS
onMounted(async ()=> {
  globalEventBus.on("procedd-to-pay-with-mpesa", (obj)=> {
    const payload = {
      ...obj,
      checkoutId: cart.value.cartId,
    }
    cartStore.checkout(payload);
  })
  await cartStore.setCheckoutAmounToPay()
});


// COMPONENT METHODS
function formatExpiryDate(event) {
  switch (event.target.value.length) {
    case 2:
      event.target.value += '/'
      break
  }
}
function payWithCard() {}

function payWithMpesa() {
  try {
    // Placeholder for MPESA payment logic
    cartStore
      .getCheckoutCart()
      .then((response) => {
        amountToPay.value = response.data.Items.reduce(
          (sum, runningVal) => sum + parseFloat(runningVal.totalPrice),
          0
        )
        amountToPay.value += parseFloat(response.data.shippingRate);
        const dialogValue = {
          show: true,
          description: 'Complete Mpesa Checkout',
          controls: {
            inputs: [
              {
                prop: 'mpesaNumber',
                model: `${user.value.phoneNumber?.split(" ").join("")}`,
                component: 'v-text-field',
                props: {
                  tag: 'input',
                  label: 'Enter Your MPESA Number',
                  type: 'text',
                  variant: 'outlined',
                  rules: [
                      (v) => !!v || 'Mpesa number is required',
                      (v) => /^\+\d{1,2}\s?\d{4,14}$/.test(v) || 'Invalid Mpesa number'
                    ]
                },
                cols: 12
              }
            ],
            actions: [
              {
                key: 'submit',
                props: {
                  tag: 'button',
                  color: `${ColorHelper.colorsHelper('secondary')}`,
                  variant: 'flat',
                  size: 'large',
                  block: true,
                },
                caption: `proceed to pay  ${currency.value}${amountToPay.value}`,
                handler: (obj) => {
                  globalEventBus.emit("procedd-to-pay-with-mpesa", obj);
                  // Placeholder for MPESA payment submission logic
                  globalStore.setDynamicDialog({show: false})
                }
              }
            ]
          }
        }
        return globalStore.setDynamicDialog(dialogValue);
      })
      .catch((err) => {
        console.error('Error fetching checkout cart:', err)
        return useToast().error(
          err.response.data.message ||
            err.message ||
            'Sorry, We ran into an error, Please try again later'
        )
      });
  } catch (error) {
    console.error('Error fetching checkout cart:', error)
    globalStore.setDynamicDialog({show: false})
    return useToast().error(error.message || 'Sorry, We ran into an error, Please try again later!')
  }
}
</script>