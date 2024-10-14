<template>
    <v-card-text
    style="
     padding-inline: 0 !important;
    "
    >
        <v-list
        lines="2"
        style="
        padding-inline: 0 !important;
        width: 100% !important;
        "
        >
        <v-list-item
        v-for="order in orders"
        :key="order.orderId"
        :title="`# ${order.orderId}`"
        class="my-2"   
        style="
        padding-top: .8rem;
        padding-bottom: .8rem;
        padding-inline: .8rem !important;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
        "
        :value="order.orderId"
        @click="()=>router.push({name: 'orderDetails', params: {orderId: stringToBase64AndReverse.toBase64String(order.orderId)}})"
        >
        <template v-slot:subtitle>
           <div 
           style="display: flex; flex-direction: column;"
           >
            <div 
            style="display: flex; flex-direction: row; align-items: center;"
            >
                <p style="margin: .2rem 0;">
               Price {{currency}} {{ order.totalPrice }}
            </p>
            <span> &nbsp; &nbsp;- &nbsp; &nbsp;</span>
            <p style="margin: .4rem 0;">
               <v-chip :color="ColorHelper.colorsHelper(order.orderStatus)">{{ order.orderStatus }}</v-chip>
            </p>
            
            </div>
            <div>
                <p
            style="
            margin: .2rem 0;
            display: flex;
            flex-direction: column;
            "
            >
                <span small style="margin: .4rem 0;">ordered on {{ order.createAt }}</span>
            </p>
            </div>
           </div>
        </template>
        </v-list-item>
        </v-list>
    </v-card-text>
</template>

<script setup>
import { useOrder, useSetupStore } from '@/store';
import ColorHelper from '@/util/ColorHelper';
import stringToBase64AndReverse from '@/util/stringToBase64AndReverse';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';


// ROUTER
const router = useRouter();

// APP STORE
const orderStore = useOrder()
const setupStore = useSetupStore()
const { orders } = storeToRefs(orderStore);
const { currency } = storeToRefs(setupStore)

</script>