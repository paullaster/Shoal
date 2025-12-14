<template>
  <main class="cart-wrapper min-h-screen bg-grey-lighten-5 py-6 px-4 md:px-8">
    
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-6 d-flex align-center">
      <v-btn icon variant="text" @click="router.back()" class="mr-2">
        <v-icon size="28">mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="text-h4 font-weight-bold text-grey-darken-3">Shopping Bag <span class="text-h6 text-grey ml-2">({{ itemsInCart }} Items)</span></h1>
    </div>

    <!-- Main Content -->
    <div v-if="itemsInCart" class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left Column: Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <transition-group name="list" tag="div">
          <v-card
            v-for="item in cart?.Items"
            :key="item?.itemId"
            elevation="0"
            border
            class="rounded-xl overflow-hidden hover:shadow-sm transition-all mb-4"
          >
            <div class="d-flex flex-column sm:flex-row pa-4 gap-4">
              <!-- Image -->
              <div class="flex-shrink-0">
                <v-img
                  :src="item?.image"
                  width="120"
                  height="120"
                  cover
                  class="rounded-lg bg-grey-lighten-4"
                  alt="Product Image"
                ></v-img>
              </div>

              <!-- Details -->
              <div class="flex-grow-1 d-flex flex-column justify-space-between">
                <div>
                  <div class="d-flex justify-space-between align-start">
                    <div>
                      <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-1 line-clamp-2">{{ item?.name }}</h3>
                      <div class="text-body-2 text-grey-darken-1 mb-2">
                        <span v-if="item?.size" class="mr-3">Size: <span class="font-weight-medium text-black">{{ item?.size }}</span></span>
                        <span v-if="item?.color">Color: <span class="font-weight-medium text-black">{{ item?.color }}</span></span>
                      </div>
                    </div>
                    <!-- Price -->
                    <div class="text-h6 font-weight-bold text-primary">
                      {{ currency }} {{ item?.price }}
                    </div>
                  </div>
                </div>

                <!-- Actions: Quantity & Remove -->
                <div class="d-flex align-center justify-space-between mt-4">
                  <!-- Quantity Pill -->
                  <div class="d-flex align-center bg-grey-lighten-4 rounded-pill px-1 py-1" style="width: fit-content;">
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      density="comfortable"
                      :disabled="item.quantity <= 1"
                      @click="() => cartStore.updateCart(item.itemId, 'remove', true)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <span class="text-body-1 font-weight-bold mx-3 w-6 text-center">{{ item.quantity }}</span>
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      density="comfortable"
                      @click="() => cartStore.updateCart(item.itemId, 'add', true)"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>

                  <!-- Remove Link -->
                  <v-btn
                    variant="text"
                    color="error"
                    size="small"
                    class="px-2"
                    @click="() => cartStore.removeItemFromCart(item.itemId, false, true)"
                  >
                    <v-icon start icon="mdi-trash-can-outline"></v-icon>
                    Remove
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card>
        </transition-group>
      </div>

      <!-- Right Column: Order Summary -->
      <div class="lg:col-span-1">
        <div class="sticky top-24">
          <v-card elevation="0" border class="rounded-xl pa-6 bg-white">
            <h2 class="text-h5 font-weight-bold mb-6">Order Summary</h2>

            <!-- Promo Codes -->
            <div class="mb-6">
              <label class="text-caption font-weight-bold text-grey mb-2 d-block">PROMO CODE</label>
              <div class="d-flex gap-2 mb-3">
                <v-text-field
                  v-model="promoCode"
                  placeholder="Enter code"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  bg-color="grey-lighten-5"
                ></v-text-field>
                <v-btn
                  color="grey-darken-3"
                  variant="flat"
                  height="40"
                  rounded="lg"
                  @click="applyPromo"
                  :disabled="!promoCode"
                >
                  Apply
                </v-btn>
              </div>
              
              <!-- Applied Promos List -->
              <div v-if="appliedPromos.length" class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="(code, index) in appliedPromos"
                  :key="index"
                  closable
                  color="success"
                  label
                  size="small"
                  variant="tonal"
                  @click:close="removePromo(index)"
                  class="font-weight-bold"
                >
                  <v-icon start icon="mdi-tag-check" size="14"></v-icon>
                  {{ code }}
                </v-chip>
              </div>
            </div>

            <v-divider class="mb-4"></v-divider>

            <!-- Totals -->
            <div class="space-y-3 mb-6">
              <div class="d-flex justify-space-between text-body-1 text-grey-darken-1">
                <span>Subtotal</span>
                <span>{{ currency }} {{ cartTotal }}</span>
              </div>
              <!-- Placeholder for Shipping/Tax logic -->
              <div class="d-flex justify-space-between text-body-1 text-grey-darken-1">
                <span>Shipping</span>
                <span class="text-caption">Calculated at checkout</span>
              </div>
               <div v-if="appliedPromos.length" class="d-flex justify-space-between text-body-1 text-success font-weight-medium">
                <span>Discount</span>
                <span>- {{ currency }} 0.00</span> <!-- Placeholder logic -->
              </div>
              <v-divider></v-divider>
              <div class="d-flex justify-space-between text-h6 font-weight-bold mt-2">
                <span>Total</span>
                <span>{{ currency }} {{ cartTotal }}</span>
              </div>
            </div>

            <!-- Checkout Button -->
            <v-btn
              block
              color="primary"
              size="x-large"
              rounded="pill"
              elevation="4"
              class="mb-4 font-weight-bold"
              @click="() => router.push({ name: 'checkout' })"
            >
              <v-icon start icon="mdi-lock-outline"></v-icon>
              Secure Checkout
            </v-btn>

            <!-- Trust Signals -->
            <div class="d-flex justify-center gap-4 text-grey text-caption">
              <div class="d-flex align-center gap-1">
                <v-icon size="small">mdi-shield-check</v-icon> Secure
              </div>
              <div class="d-flex align-center gap-1">
                <v-icon size="small">mdi-truck-fast</v-icon> Fast Delivery
              </div>
            </div>
          </v-card>
        </div>
      </div>

    </div>

    <!-- Empty State -->
    <div v-else class="max-w-md mx-auto text-center py-20">
      <div class="mb-6 bg-white rounded-circle d-inline-flex pa-8 shadow-sm">
        <v-icon size="80" color="grey-lighten-2">mdi-cart-outline</v-icon>
      </div>
      <h2 class="text-h4 font-weight-bold text-grey-darken-3 mb-3">Your bag is empty</h2>
      <p class="text-body-1 text-grey-darken-1 mb-8">
        Looks like you haven't added any items to the bag yet. Start exploring our fresh menu!
      </p>
      <v-btn
        color="primary"
        size="x-large"
        rounded="pill"
        elevation="4"
        width="200"
        @click="() => router.push({ name: 'landing' })"
      >
        Start Shopping
      </v-btn>
    </div>

  </main>
</template>

<script setup>
import { useCartStore, useSetupStore } from '@/store';
import ColorHelper from '@/util/ColorHelper';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

// ROUTES
const router = useRouter();


// STORE AND STORE ACTIONS
const setupStore = useSetupStore();
const cartStore = useCartStore();
const { currency } = storeToRefs(setupStore);
const { itemsInCart, cart, cartTotal } = storeToRefs(cartStore)

// LOCAL STATE for Promos
const promoCode = ref('');
const appliedPromos = ref([]);

function applyPromo() {
  if (promoCode.value) {
    // Here you would normally call the store action to validate and apply
    // cartStore.applyPromo(promoCode.value)
    // For UI demonstration:
    if (!appliedPromos.value.includes(promoCode.value)) {
       appliedPromos.value.push(promoCode.value);
    }
    promoCode.value = '';
  }
}

function removePromo(index) {
  appliedPromos.value.splice(index, 1);
  // cartStore.removePromo(...)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>