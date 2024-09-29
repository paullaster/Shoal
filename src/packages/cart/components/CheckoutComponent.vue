<template>
   <main class="checkout-main">
    <section class="checkout-card">
        <p>uhuhuu</p>
        <v-stepper-vertical 
        :mobile="mdAndDown"
        multiple
        >
        <v-stepper-vertical-item>
            <component :is="PaymentMethod"></component>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item>
            <component :is="ShippingAddress"></component>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item>
            <component :is="checkoutSummary"></component>
        </v-stepper-vertical-item>
        </v-stepper-vertical>
    </section>
   </main>
</template>

<script setup>
import { VStepperVertical } from 'vuetify/lib/labs/components.mjs';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import PaymentMethod from './PaymentMethod.vue';
import ShippingAddress from './ShippingAddress.vue';
import checkoutSummary from './checkoutSummary.vue';

//VUETIFY
const { mdAndDown } = useDisplay();

</script>