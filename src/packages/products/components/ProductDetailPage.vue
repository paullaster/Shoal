<template>
  <main class="bg-gray-50 py-8 md:py-12" v-if="product && Object.keys(product).length">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

        <!-- Image Gallery -->
        <div class="image-gallery">
          <div class="main-image-wrapper rounded-lg overflow-hidden shadow-lg mb-4 bg-white">
            <img :src="selectedImage.url" :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105" />
          </div>
          <div class="thumbnail-grid grid grid-cols-4 gap-2">
            <div v-for="image in product.images" :key="image.imgId"
              class="thumbnail-wrapper rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200"
              :class="selectedImageId === image.imgId ? 'border-primary' : 'border-transparent hover:border-gray-300'"
              @click="selectedImageId = image.imgId">
              <img :src="image.url" alt="thumbnail" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- Product Details -->
        <div class="product-info flex flex-col">
          <!-- Category & Actions -->
          <div class="flex justify-between items-start mb-2">
            <div class="flex flex-wrap gap-2">
              <span v-for="cat in product.categories" :key="cat.categoryId"
                class="category-badge text-xs font-semibold bg-primary-light text-primary-dark py-1 px-3 rounded-full">
                {{ cat.name }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <v-btn icon variant="text" size="small" v-tooltip="'Share'"><v-icon>mdi-share-variant</v-icon></v-btn>
              <v-btn icon variant="text" size="small"
                v-tooltip="'Add to Wishlist'"><v-icon>mdi-heart-outline</v-icon></v-btn>
              <v-btn icon variant="text" size="small" v-tooltip="'Close'"
                @click="closeProductDetailPage"><v-icon>mdi-close</v-icon></v-btn>
            </div>
          </div>

          <!-- Name -->
          <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{{ product.name }}</h1>

          <!-- Price & Discount -->
          <div class="price-section mb-6">
            <!-- Deal Box: Appears only on sale -->
            <div v-if="onSale" class="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-lg shadow-sm">
              <div class="flex justify-between items-center mb-2">
                <span class="text-lg font-bold">{{ activeDiscount.title }}</span>
                <span class="bg-green-500 text-white text-sm font-bold py-1 px-3 rounded-full">SAVE {{ savingsPercentage
                  }}%</span>
              </div>
              <div class="flex items-baseline gap-3">
                <p class="text-4xl font-extrabold">{{ currency }} {{ displayPrice }}</p>
                <p class="text-xl text-gray-500 line-through">{{ currency }} {{ originalPrice.toFixed(2) }}</p>
              </div>
              <p class="text-md font-semibold mt-1">You save {{ currency }} {{ savingsAmount }}!</p>
            </div>

            <!-- Standard Price Display -->
            <div v-else>
              <p class="text-3xl font-bold text-gray-900">{{ currency }} {{ displayPrice }}</p>
            </div>
          </div>

          <!-- Variant Selection -->
          <div class="variants-section mb-6" v-if="product.variants && product.variants.length > 1">
            <h3 class="text-sm font-semibold text-gray-600 mb-2">Select Option</h3>
            <div class="flex flex-wrap gap-2">
              <v-chip v-for="variant in product.variants" :key="variant.variantId" @click="selectedVariantId = variant.variantId"
                :variant="selectedVariantId === variant.variantId ? 'elevated' : 'outlined'" color="primary"
                size="large" class="cursor-pointer">
                {{variant.name || variant.attributes.map(a => a.values[0].value).join(' / ')}}
              </v-chip>
            </div>
          </div>

          <!-- Stock Availability -->
          <div class="stock-status mb-6">
            <div class="flex items-center">
              <span class="h-2.5 w-2.5 rounded-full mr-2" :class="stockStatus.iconColor"></span>
              <p class="font-semibold" :class="stockStatus.color">{{ stockStatus.text }}</p>
            </div>
          </div>

          <!-- Add to Cart -->
          <div class="cart-actions mt-auto pt-6 border-t border-gray-200">
            <!-- Quantity Stepper -->
            <div v-if="numberOfProductInCart > 0"
              class="primary-gradient-button flex items-center justify-between w-full bg-gray-100 rounded-full p-2">
              <button @click.prevent="() => cartStore.updateCart(product.productId, 'remove')"
                class="h-10 w-10 rounded-full text-gray-600 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center">
                <v-icon>mdi-minus</v-icon>
              </button>
              <span class="text-lg font-bold text-white">{{ numberOfProductInCart }} in cart</span>
              <button @click.prevent="() => cartStore.updateCart(product.productId, 'add')"
                :disabled="!canAddToCartMore"
                class="h-10 w-10 rounded-full text-gray-600 hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center">
                <v-icon>mdi-plus</v-icon>
              </button>
            </div>

            <!-- Add to Cart Button -->
            <button v-else @click="() => cartStore.createCart(selectedVariant)" :disabled="!stockStatus.available"
              class="primary-gradient-button w-full flex items-center justify-center gap-3 rounded-full text-white font-bold text-base tracking-wider uppercase py-4 px-6 transition-all duration-300 ease-in-out transform hover:bg-gray-900 hover:shadow-lg hover:-translate-y-1 disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>

          </div>
          <!-- Description & Recipe -->
          <div class="mt-8">
            <div class="prose max-w-none">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Description</h3>
              <p class="text-gray-600">{{ product.description }}</p>

              <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-2">Recipe Tips</h3>
              <div class="aspect-video" v-html="product.recipeTips"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import useProduct from '@/composables/useProduct';
import { useProductStore, useSetupStore, useCartStore } from '@/store';
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// COMPOSABLES
const { fetchProduct } = useProduct();

// ROUTER
const route = useRoute();
const router = useRouter();

// STORE
const productStore = useProductStore();
const setupStore = useSetupStore();
const cartStore = useCartStore();

// STORE REFS
const { product } = storeToRefs(productStore);
const { currency } = storeToRefs(setupStore);
const { cart } = storeToRefs(cartStore);

// LOCAL STATE (IDs only, to maintain a single source of truth)
const selectedImageId = ref(null);
const selectedVariantId = ref(null);

// DATA FETCHING & STATE INITIALIZATION
watch(() => route.params.productId, async (newId) => {
  if (newId) {
    // Clear previous product state to avoid showing stale data
    productStore.$reset();
    selectedImageId.value = null;
    selectedVariantId.value = null;

    await fetchProduct(newId, { eager: true });

    if (product.value) {
      selectedImageId.value = product.value.images?.[0]?.imgId || null;
      // A product might not have variants, so fallback to the product itself
      selectedVariantId.value = product.value.variants?.[0]?.variantId || null;
    }
  }
}, { immediate: true });


// DERIVED STATE (Computed properties for selected objects)
const selectedImage = computed(() => {
    if (!product.value || !selectedImageId.value) return {};
    return product.value.images.find(img => img.imgId === selectedImageId.value) || {};
});

const selectedVariant = computed(() => {
    if (!product.value) return null;
    // If no variants or no ID selected, the "variant" is the main product data
    if (!selectedVariantId.value || !product.value.variants?.length) {
        return product.value;
    }
    return product.value.variants.find(v => v.variantId === selectedVariantId.value) || product.value;
});


// COMPUTED PROPERTIES
const onSale = computed(() => product.value?.price > product.value.discountedPrice);
const activeDiscount = computed(() => onSale.value ? product.value.discounts[0] : null);

const originalPrice = computed(() => selectedVariant.value?.price || product.value?.price || 0);

// Internal computed for raw number calculation
const _displayPrice = computed(() => {
  if (onSale.value) {
    return selectedVariant.value?.discountedPrice || product.value?.discountedPrice || 0;
  }
  return originalPrice.value;
});

// Formatted for display
const displayPrice = computed(() => _displayPrice.value.toFixed(2));

// Internal computed for raw number calculation
const _savingsAmount = computed(() => {
  if (!onSale.value) return 0;
  return originalPrice.value - _displayPrice.value;
});

// Formatted for display
const savingsAmount = computed(() => _savingsAmount.value.toFixed(2));

const savingsPercentage = computed(() => {
  if (!onSale.value || !originalPrice.value) return 0;
  // Perform calculation on numbers
  return Math.round((_savingsAmount.value / originalPrice.value) * 100);
});

const numberOfProductInCart = computed(() => {
  if (!product.value?.pid) return 0;
  // Assumes cart store is optimized with a Map/object for O(1) lookup
  const itemsById = cart.value.Items?.reduce((acc, item) => {
    acc[item.productPid] = item;
    return acc;
  }, {});
  return itemsById[product.value.pid]?.quantity || 0;
});

const stockStatus = computed(() => {
  if (!selectedVariant.value) {
    return { available: false, text: 'Select an option', color: 'text-gray-500', iconColor: 'bg-gray-400' };
  }

  // Corrected logic: first check availability, then quantity nuances.
  if (!selectedVariant.value.isAvailable) {
    return { available: false, text: 'Out of Stock', color: 'text-red-600', iconColor: 'bg-red-500' };
  }

  const quantity = selectedVariant.value.quantity;
  if (quantity > 0 && quantity <= 10) {
    return { available: true, text: `Only ${quantity} left in stock!`, color: 'text-yellow-600', iconColor: 'bg-yellow-500' };
  }

  return { available: true, text: 'In Stock', color: 'text-green-600', iconColor: 'bg-green-500' };
});

const canAddToCartMore = computed(() => {
  if (!selectedVariant.value || !stockStatus.value.available) return false;
  return numberOfProductInCart.value < selectedVariant.value.quantity;
});

// METHODS
function closeProductDetailPage() {
  router.back();
}
</script>

<style scoped>
.prose {
  line-height: 1.6;
}

.category-badge {
  /* Example custom colors if needed */
  background-color: #e0e7ff;
  color: #3730a3;
}

:deep(iframe) {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  /* 8px */
}
</style>