<template>
  <div class="payment-method">
    <div class="fieldset-mobile">
      <div class="express-checkout-mobile">
        <div class="mpesa">
          <v-btn
            size="large"
            block
            style="display: flex; align-items: center; border: .1rem solid var(--vt-c-secondary)"
            @click="payWithMpesa"
          >
            <img :src="mpesaLogo" alt="MPESA" style="display: block; margin-right: 0.2rem" />
            <span style="display: block">Mpesa</span>
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
                    <v-icon color="primary" size="24"> mdi-credit-card </v-icon>
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
import { useAuth, useGlobalStore } from '@/store'
import { storeToRefs } from 'pinia'
import ColorHelper from '@/util/ColorHelper'

const authStore = useAuth()
const globalStore = useGlobalStore()
const { user } = storeToRefs(authStore)

// COMPONENT METHODS
function formatExpiryDate(event) {
  switch (event.target.value.length) {
    case 2:
      event.target.value += '/'
      break
  }
}

function payWithMpesa() {
  // Placeholder for MPESA payment logic
  console.log('MPESA payment initiated dialog')
  const dialogValue = {
    show: true,
    description: 'Complete Mpesa Checkout',
    controls: {
      inputs: [
        {
          prop: 'mpesaNumber',
          model: `${user.value.phoneNumber}`,
          component: 'v-text-field',
          props: {
            tag: 'input',
            label: 'Enter Your MPESA Number',
            type: 'text',
            variant: 'outlined',
            rules: () => {
              return [
                (v) => !!v || 'Mpesa number is required',
                (v) => /^\+\d{1,2}\s?\d{4,14}$/.test(v) || 'Invalid Mpesa number'
              ]
            }
          },
          cols: 12
        }
      ],
      actions: [
        {
          key: 'submit',
          props: {
            tag: 'button',
            color: `${ColorHelper.colorsHelper('primary')}`,
            variant: 'flat',
            block: true,
          },
          caption: `proceed to pay KSH. 5000`,
          handler: () => {
            console.log('Mpesa payment submitted')
            // Placeholder for MPESA payment submission logic
            globalStore.setDynamicDialog(null)
          }
        }
      ]
    }
  }
  globalStore.setDynamicDialog(dialogValue)
}
</script>