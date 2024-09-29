<template>
    <div class="payment-method">
        <fieldset class="fieldset-mobile">
            <legend>Express Checkout</legend>
            <div class="express-checkout-mobile">
                <div class="mpesa">
                    <v-btn
                    size="large"
                    block
                    >
                    <img :src="mpesaLogo" alt="MPESA" />
                    <span>Mpesa</span>
                </v-btn>
                </div>
            </div>
        </fieldset>

        <div>
            <div>
                <span></span><span>or pay with card</span><span></span>
            </div>
        </div>
        <div>
          <div>
            <div>
                <v-card-text tag="p">
                    Enter your card details
                </v-card-text>
                <v-form ref="cardForm">
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-text-field
                                v-model="cardNumber"
                                label="Card Number"
                                variant="outlined"
                                :rules="[required]"
                            >
                        <template v-slot:append-inner>
                            <v-icon color="primary" size="24">
                                mdi-credit-card
                            </v-icon>

                        </template>
                        </v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="expiryDate"
                                placeholder="MM/YY"
                                variant="outlined"
                                :rules="[required]"
                            />
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="cvv"
                                label="CVV"
                                variant="outlined"
                                :rules="[required]"
                            />
                        </v-col>
                    </v-row>
                </v-form>
            </div>
          </div>
        </div>
    </div>
</template>

<script setup>
import mpesaLogo from "@/assets/images/M-PESA_LOGO-01.svg"
// import googleLogo from "@/assets/images/google.svg"

</script>