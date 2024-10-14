<template>
    <main class="order-page">
       <section class="order-container">
        <v-card elevation="0">
            <v-tabs
            v-model="orderNavigationTab"
            align-tabs="center"
            :color="ColorHelper.colorsHelper('primary')"
            @update:modelValue="onSwitchingTabs"
            >
            <v-tab :value="1">
                Active/Delivered
            </v-tab>
            <v-tab :value="2">
                Cancelled
            </v-tab>
            </v-tabs>
            <OrderList />
        </v-card>
       </section>
    </main>
</template>

<script setup>
import { useOrder } from '@/store';
import ColorHelper from '@/util/ColorHelper';
import { storeToRefs } from 'pinia';
// import { useDisplay } from 'vuetify/lib/framework.mjs';
import OrderList from '../components/OrderList.vue';
import { useToast } from 'vue-toastification';


// VUETIFY UTIL
// const { mobile } = useDisplay()

// APP STORE
const orderStore = useOrder();
const { orderNavigationTab } = storeToRefs(orderStore);

// COMPONENT METHODS
async function onSwitchingTabs () {
    try {
        await orderStore.switchOrderTabData(orderNavigationTab.value);
    } catch (error) {
        useToast().error(error.message || "Error");
    }
}
</script>
