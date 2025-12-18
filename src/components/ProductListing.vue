<template>
  <article
    class="group relative product-listing-wrapper cool-borderradius bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl flex flex-col overflow-hidden h-full">
    <a :href="productUrl"
      @click.prevent="router.push({ name: 'productDetails', params: { productId: product.productId } })"
      class="grow flex flex-col">
      <div class="productlisting-image h-64 w-full overflow-hidden relative">
        <img :src="displayImage.url" :alt="displayImage.altText"
          class="h-full w-full object-cover object-center transition-transform duration-500 ease-in-out md:group-hover:scale-110" />
        <!-- Ultra Modern God-Level Sale Percentage Badge -->
        <div v-if="onSale"
          class="absolute top-2 left-2 bg-green-500 text-white text-sm md:text-base font-bold py-1 px-2 rounded-full shadow-lg transform -rotate-3 origin-top-left z-10">
          SAVE {{ savingsPercentage }}%
        </div>
      </div>

      <div class="product-details p-5 grow">
        <p class="text-lg font-bold text-gray-900 truncate mb-1" :title="product.name">
          {{ product.name }}
        </p>
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
          <p class="text-2xl font-extrabold text-primary" v-if="onSale">{{ currency }} {{ displayPrice }}
          </p>
          <p class="text-xl font-bold text-gray-900" :class="{ 'line-through text-gray-500 text-base': onSale }">{{
            currency }} {{ originalPrice }}</p>
        </div>

        <!-- Categories -->
        <div v-if="displayCategories.length" class="flex flex-wrap gap-1 mb-2">
          <span v-for="cat in displayCategories" :key="cat.categoryId"
            class="text-xs font-semibold bg-gray-100 text-gray-700 py-1 px-2 rounded-md">
            {{ cat.name }}
          </span>
        </div>

        <!-- Attributes -->
        <div v-if="displayAttributes.length" class="flex flex-wrap gap-1 mb-2">
          <span v-for="attr in displayAttributes" :key="attr.name"
            class="text-xs text-gray-500 py-0.5 px-1.5 rounded-full border border-gray-200">
            {{ attr.name }}: {{ attr.value }}
          </span>
        </div>

        <!-- Modern Availability Indicator -->
        <div class="mt-auto pt-2">
          <div v-if="firstVariant?.isAvailable" class="flex items-center">
            <span class="relative flex h-2.5 w-2.5 mr-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span class="text-sm font-medium text-gray-600">In Stock</span>
          </div>
          <div v-else class="flex items-center">
            <span class="h-2.5 w-2.5 bg-red-500 rounded-full mr-2"></span>
            <span class="text-sm font-medium text-gray-500">Out of Stock</span>
          </div>
        </div>
      </div>
    </a>

    <!-- Responsive CTA -->

    <div
      class="cta-btn p-4 md:absolute md:bottom-0 md:left-0 md:right-0 md:bg-white/95 md:backdrop-blur-sm md:opacity-0 md:transform md:translate-y-full md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-in-out border-t md:border-none border-gray-100 flex justify-center">

      <v-btn color="primary" variant="flat" rounded="pill" height="44" v-if="!productInCart"
        @click.stop="addToCart(product)"
        class="w-4/5 mx-auto shadow-lg font-weight-bold text-none primary-gradient-button">

        <v-icon class="mr-2">mdi-cart-outline</v-icon>

        Add to Cart

      </v-btn>

      <div v-else
        class="cta-btn-group-container h-11 w-4/5 mx-auto flex justify-between items-center primary-gradient-button rounded-pill p-1 shadow-lg"
        @click.stop="cartUpdate(product, $event)">

        <v-btn variant="text" density="comfortable" icon="mdi-minus" data-type-remove color="white"
          class="ml-1"></v-btn>

        <span class="font-bold text-lg text-white">

          {{ productInCart.quantity }}

        </span>

        <v-btn variant="text" density="comfortable" icon="mdi-plus" data-type-add color="white" class="mr-1"></v-btn>

      </div>

    </div>
  </article>
</template>

<script setup>
import { useCartStore, useSetupStore, useProductStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import useProduct from '@/composables/useProduct';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// ROUTER
const router = useRouter();
const { addToCart, cartUpdate } = useProduct();

// STORE
const setupStore = useSetupStore();
const cartStore = useCartStore();
const productStore = useProductStore();

const { currency } = storeToRefs(setupStore);
const { itemsById: cartItemsById } = storeToRefs(cartStore);
const { getCategoryById, getImageById, getAttributeById } = storeToRefs(productStore);

// COMPUTED
const productUrl = computed(() => router.resolve({ name: 'productDetails', params: { productId: props.product.productId } }).href);

const firstVariant = computed(() => props.product.variants?.[0]);

const displayImage = computed(() => {
  const imageId = props.product.imageIds?.[0];
  return imageId ? getImageById.value[imageId] : { url: '', altText: `Image of ${props.product.name}` }; // Fallback
});

const displayCategories = computed(() => {
  return (props.product.categoryIds || []).map(id => getCategoryById.value[id]).filter(Boolean);
});

const displayAttributes = computed(() => {
  if (!firstVariant.value || !firstVariant.value.attributes) return [];
  return firstVariant.value.attributes.map(attr => {
    const attributeDefinition = getAttributeById.value[attr.attributeId];
    return {
      name: attributeDefinition ? attributeDefinition.name : 'Unknown Attribute',
      value: attr.value
    };
  });
});

const onSale = computed(() => firstVariant.value?.saleInfo?.onSale || false);

const originalPrice = computed(() => firstVariant.value?.price || 0.00);

const displayPrice = computed(() => {
  if (onSale.value) {
    return firstVariant.value?.saleInfo?.discountedPrice?.toFixed(2);
  }
  return originalPrice.value;
});

const savingsPercentage = computed(() => {
  if (!onSale.value || !originalPrice.value) return 0;
  const discountedPrice = firstVariant.value.saleInfo.discountedPrice;
  const savings = originalPrice.value - discountedPrice;
  return Math.round((savings / originalPrice.value) * 100);
});

const productInCart = computed(() => {
  // O(1) lookup using the new getter. Returns null if not found.
  return cartItemsById.value[props.product.productId] || null;
});

</script>