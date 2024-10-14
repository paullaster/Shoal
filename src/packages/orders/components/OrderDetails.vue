<template>
  <main class="order-details">
    <section class="order-details-container">
      <v-card elevation="0">
        <v-card-title style="padding-inline: 0 !important">
          <v-toolbar>
            <v-btn icon @click="() => router.push({ name: 'orders' })">
              <v-icon>mdi-keyboard-backspace</v-icon>
            </v-btn>
            <v-toolbar-title>Order Details</v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text style="padding-inline: 0 !important">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <p >
                <span style="font-weight: 700">
                  Order ID
                  {{ order.orderId }}
                </span>
                <span>&nbsp; &nbsp; - &nbsp; &nbsp;</span>
                <span style="font-weight: 700">{{ order.items.length }} Items</span>
              </p>
              <p>
                Placed on:
                {{ DateClass.toDate('2024-10') }}
              </p>
              <p>
                <span style="font-weight: 500;">Price <span>{{ currency }}</span> {{ order.totalPrice }}</span>
                <span>&nbsp; &nbsp; - &nbsp; &nbsp;</span>
                <span> {{ order.paymentStatus }}</span>
                <span>Through &nbsp;<v-chip :color="ColorHelper.colorsHelper(order.orderStatus)">{{ order.paymentMethod }}</v-chip></span>
              </p>
              <p>
                <v-chip :color="ColorHelper.colorsHelper(order.orderStatus)" size="large">{{
                  order.orderStatus
                }}</v-chip>
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <p style="font-weight: 500">ITEMS IN YOUR ORDER</p>
            </v-col>
            <v-col>
              <ul>
                <li
                  v-for="item in order.items"
                  :key="item.itemId"
                  style="
                    display: flex;
                    flex-direction: row;
                    list-style-type: none;
                    height: max-content;
                    margin-bottom: 0.8rem;
                    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
                  "
                >
                  <div
                    :style="`
                  width: 40%;
                  background-image: url(${item.image});
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: cover;
                  border-radius: .4rem;
                  `"
                  ></div>
                  <div style="padding: 1rem">
                    <p style="font-weight: 700">{{ item.name }}</p>
                    <p>Quantity: {{ item.quantity }}</p>
                    <p>Color: {{ item.color }}</p>
                    <p>Size: {{ item.size }}</p>
                    <p style="font-weight: 600">
                      Price: 
                      <span>{{ currency }}</span>
                      {{ item.price }}
                    </p>
                  </div>
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </section>
  </main>
</template>

<script setup>
import { useOrder, useSetupStore } from '@/store'
import ColorHelper from '@/util/ColorHelper'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import DateClass from '@/util/DateUtil'

// ROUTING
const router = useRouter()

// APP STORE
const orderStore = useOrder()
const setupStore = useSetupStore()
const { order } = storeToRefs(orderStore)
const { currency } = storeToRefs(setupStore)
</script>