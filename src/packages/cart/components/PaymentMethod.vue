<template>
    <div class="payment-method">
        <div class="fieldset-mobile">
            <div class="express-checkout-mobile">
                <div class="mpesa">
                    <v-btn
                    size="large"
                    block
                    style="
                    display: flex;
                    align-items: center;
                    "
                    >
                    <img :src="mpesaLogo" alt="MPESA"  style="display: block; margin-right: .2rem;"/>
                    <span style="display: block;">Mpesa</span>
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
                <v-card-text tag="p">
                    Enter your card details
                </v-card-text>
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
                            <v-icon color="primary" size="24">
                                mdi-credit-card
                            </v-icon>

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
import visaLogo from "@/assets/images/Visa_Inc._logo.svg"
import mastercardLogo from "@/assets/images/Mastercard-logo.svg"


// COMPONENT METHODS
function formatExpiryDate(event) {
    switch (event.target.value.length) {
        case 2:
            event.target.value += "/";
            break;
    }
}

</script>