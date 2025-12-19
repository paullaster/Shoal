<template>
  <main class="bg-[#f8fafc] min-h-screen pb-32 md:pb-20" v-if="product && Object.keys(product).length">
    <div class="container mx-auto px-4 pt-6 md:pt-12">
      <!-- Main Grid: Images & Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start mb-24">

        <!-- Image Gallery (Left Side) -->
        <div class="image-gallery space-y-6">
          <div
            class="main-image-wrapper relative aspect-4/5 md:aspect-square rounded-[2.5rem] overflow-hidden bg-white group border border-white shadow-xl">
            <img :src="selectedImage?.url" :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110" />

            <!-- Ultra Modern Sale Badge -->
            <div v-if="onSale"
              class="absolute top-8 left-8 bg-primary text-white text-xl font-black py-3 px-6 rounded-2xl shadow-2xl transform -rotate-12 z-10 backdrop-blur-md bg-opacity-90 border-4 border-white">
              SALE
            </div>
          </div>

          <!-- Thumbnails -->
          <div v-if="resolvedImages?.length > 1"
            class="thumbnail-scroll flex gap-4 overflow-x-auto py-4 px-2 hide-scrollbar">
            <button v-for="(image, index) in resolvedImages" :key="index"
              class="relative w-24 h-24 shrink-0 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border-4"
              :class="selectedImage?.url === image.url ? 'border-primary shadow-xl scale-105' : 'border-transparent opacity-60 hover:opacity-100'"
              @click="selectedImage = image">
              <img :src="image.url" :alt="image.altText || 'thumbnail'" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product Details (Right Side) -->
        <div class="product-info flex flex-col lg:sticky lg:top-24">

          <!-- Category & Actions -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex flex-wrap gap-2">
              <span v-for="cat in resolvedCategories" :key="cat?.categoryId"
                class="px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-gray-900 text-white">
                {{ cat?.name }}
              </span>
            </div>
            <div class="flex items-center gap-3">
              <button
                class="w-12 h-12 rounded-full bg-white shadow-sm hover:shadow-md text-gray-500 transition-all flex items-center justify-center border border-gray-100"
                v-tooltip="'Share'">
                <v-icon size="22">mdi-share-variant</v-icon>
              </button>
              <button
                class="w-12 h-12 rounded-full bg-white shadow-sm hover:shadow-md text-gray-500 transition-all flex items-center justify-center border border-gray-100"
                v-tooltip="'Add to Wishlist'">
                <v-icon size="22">mdi-heart-outline</v-icon>
              </button>
              <button
                class="w-12 h-12 rounded-full bg-white text-gray-800 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all flex items-center justify-center ml-2 border border-gray-200 z-50 relative"
                @click="closeProductDetailPage">
                <v-icon size="24">mdi-close</v-icon>
              </button>
            </div>
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
            {{ product.name }}
          </h1>

          <!-- Advanced Price Section -->
          <div class="price-section mb-10">
            <div v-if="onSale" class="flex flex-col gap-1">
              <div class="flex items-center gap-3">
                <span class="text-xs font-black bg-green-500 text-white px-3 py-1 rounded-md transform -skew-x-12">
                  FLASH DEAL
                </span>
                <span class="text-sm font-bold text-green-600">
                  Save {{ currency }} {{ savingsAmount }} ({{ savingsPercentage }}% OFF)
                </span>
              </div>
              <div class="flex items-center gap-4 mt-2">
                <span class="text-5xl md:text-6xl font-black text-primary tracking-tighter">
                  {{ currency }}{{ displayPrice }}
                </span>
                <div class="flex flex-col justify-center">
                  <span class="text-xl font-bold text-gray-400 line-through decoration-primary/40 decoration-2">
                    {{ currency }}{{ originalPrice.toFixed(2) }}
                  </span>
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Original Price</span>
                </div>
              </div>
            </div>
            <div v-else>
              <span class="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">
                {{ currency }}{{ displayPrice }}
              </span>
            </div>
          </div>

          <!-- Stock Status Capsule -->
          <div
            class="mb-10 flex items-center gap-4 bg-white p-2 pr-6 rounded-full w-fit shadow-sm border border-gray-100">
            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50"
              :class="stockStatus.color.replace('text', 'bg').replace('600', '100')">
              <div class="relative flex h-3 w-3">
                <span v-if="stockStatus.available"
                  class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  :class="stockStatus.iconColor"></span>
                <span class="relative inline-flex rounded-full h-3 w-3" :class="stockStatus.iconColor"></span>
              </div>
            </div>
            <div class="flex flex-col py-2">
              <span class="font-black text-xs uppercase tracking-widest text-gray-400">Availability</span>
              <span class="font-bold text-sm" :class="stockStatus.color">{{ stockStatus.text }}</span>
            </div>
          </div>

          <!-- Description -->
          <div class="prose prose-lg text-gray-600 mb-10 leading-relaxed font-medium">
            <p>{{ product.description }}</p>
          </div>

          <!-- Variants (Elevated Selectors) -->
          <div class="variants-section mb-10" v-if="product.variants && product.variants.length > 1">
            <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Select Option</label>
            <div class="flex flex-wrap gap-3">
              <button v-for="variant in product.variants" :key="variant.variantId"
                @click="selectedVariantId = variant.variantId"
                class="px-6 py-3 rounded-xl font-bold transition-all duration-200 border-2" :class="selectedVariantId === variant.variantId
                  ? 'border-primary bg-primary/5 text-primary shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-white'">
                {{variant.name || variant.attributes.map(a => a.value).join(' / ')}}
              </button>
            </div>
          </div>

          <!-- Fixed Bottom Action Bar (Mobile) / Integrated (Desktop) -->
          <div
            class="cart-actions-container bg-white/80 backdrop-blur-xl p-5 md:p-8 rounded-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] md:shadow-2xl border border-white mt-auto sticky bottom-6 z-40 mx-4 md:mx-0 md:static">

            <!-- Quantity Manager State -->
            <div v-if="numberOfProductInCart > 0" class="flex items-center gap-6 animate-fade-in-up">
              <div
                class="flex items-center bg-linear-to-r from-gray-50 to-white rounded-full p-2.5 flex-1 border border-gray-100 shadow-inner group transition-all duration-300 hover:shadow-md">
                <button @click.prevent="() => cartStore.updateCart(product.productId, 'remove')"
                  class="w-16 h-16 rounded-full bg-white text-gray-800 hover:text-red-500 hover:bg-red-50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_rgba(239,68,68,0.15)] transition-all duration-300 active:scale-90 flex items-center justify-center border border-gray-50">
                  <v-icon size="28">mdi-minus</v-icon>
                </button>

                <div class="flex-1 flex flex-col items-center justify-center px-4">
                  <span class="font-black text-4xl text-gray-900 leading-none tracking-tight">{{ numberOfProductInCart
                    }}</span>
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">In Cart</span>
                </div>

                <button @click.prevent="() => cartStore.updateCart(product.productId, 'add')"
                  :disabled="!canAddToCartMore"
                  class="w-16 h-16 rounded-full primary-gradient-button shadow-lg transition-all duration-300 active:scale-90 disabled:opacity-30 disabled:shadow-none disabled:active:scale-100 flex items-center justify-center relative overflow-hidden group/btn">
                  <v-icon size="28" class="relative z-10">mdi-plus</v-icon>
                  <div
                    class="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out rounded-full">
                  </div>
                </button>
              </div>
            </div>

            <!-- Add to Cart State -->
            <button v-else @click="() => cartStore.createCart(selectedVariant)" :disabled="!stockStatus.available"
              class="primary-gradient-button group relative w-full py-6 px-10 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:grayscale disabled:opacity-70 disabled:hover:scale-100 shadow-[0_20px_40px_rgba(123,97,255,0.25)] hover:shadow-[0_30px_60px_rgba(123,97,255,0.4)]">

              <!-- Shine Effect -->
              <div
                class="absolute inset-0 opacity-0 group-hover:opacity-20 bg-linear-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out">
              </div>

              <!-- Content -->
              <div class="relative flex items-center justify-center gap-4 text-white">
                <v-icon size="32"
                  class="group-hover:rotate-12 transition-transform duration-300">mdi-cart-arrow-down</v-icon>
                <span class="font-black text-xl tracking-wider">ADD TO CART</span>
              </div>
            </button>
          </div>

          <!-- Quick Benefits (Moved here for better layout) -->
          <div class="hidden lg:grid grid-cols-3 gap-4 pt-10 border-t border-gray-100 mt-10">
            <div class="flex flex-col items-center text-center">
              <div class="bg-gray-50 p-3 rounded-full mb-2 text-primary">
                <v-icon size="24">mdi-truck-fast-outline</v-icon>
              </div>
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fast Delivery</span>
            </div>
            <div class="flex flex-col items-center text-center">
              <div class="bg-gray-50 p-3 rounded-full mb-2 text-green-600">
                <v-icon size="24">mdi-shield-check-outline</v-icon>
              </div>
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">100% Fresh</span>
            </div>
            <div class="flex flex-col items-center text-center">
              <div class="bg-gray-50 p-3 rounded-full mb-2 text-orange-500">
                <v-icon size="24">mdi-face-agent</v-icon>
              </div>
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">24/7 Support</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Chef's Recipe Section -->
      <div v-if="product.recipeTips" class="mt-10 mx-auto max-w-5xl mb-32">
        <div class="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 relative overflow-hidden">

          <div class="relative z-10 px-4 md:px-10 py-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div class="flex items-center gap-5">
                <div class="bg-primary/10 p-4 rounded-3xl text-primary">
                  <v-icon size="32">mdi-chef-hat</v-icon>
                </div>
                <div>
                  <h2 class="text-3xl md:text-4xl font-black text-gray-900 leading-tight">Chef's Secret Recipe</h2>
                  <p class="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Master this dish in your
                    kitchen</p>
                </div>
              </div>
              <div class="flex -space-x-2">
                <div v-for="i in 3" :key="i"
                  class="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-black overflow-hidden">
                  <v-icon size="16" color="primary">mdi-star</v-icon>
                </div>
                <div
                  class="w-10 h-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-black">
                  4.9
                </div>
              </div>
            </div>

            <!-- Video Container with 16:9 Aspect Ratio -->
            <div
              class="recipe-content-wrapper rounded-3xl overflow-hidden bg-black aspect-video w-full shadow-sm border border-gray-100">
              <div class="prose prose-invert max-w-none w-full h-full" v-html="product.recipeTips"></div>
            </div>

            <div
              class="mt-8 flex flex-wrap gap-6 items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              <div class="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full"><v-icon
                  size="16">mdi-clock-outline</v-icon> 25 MINS</div>
              <div class="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full"><v-icon size="16">mdi-fire</v-icon>
                MEDIUM HEAT</div>
              <div class="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full"><v-icon
                  size="16">mdi-silverware-variant</v-icon> SERVES 2-3</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Marketing Section 1: Perfect Companions (People Also Bought) -->
      <section class="mt-32 mb-24 relative" v-if="peopleAlsoBought.length">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center gap-2">
            <v-icon color="orange-darken-1" icon="mdi-basket-check" size="28"></v-icon>
            <h2 class="text-h5 font-weight-bold text-grey-darken-3 tracking-tight">Perfect Companions</h2>
          </div>
          <v-btn variant="text" color="primary" class="font-weight-bold px-0">See All</v-btn>
        </div>

        <div class="group relative">
          <v-slide-group show-arrows class="py-2 product-slide-group">
            <template v-slot:prev="{ onClick }">
              <v-btn icon="mdi-chevron-left" variant="flat" color="white"
                class="custom-nav-btn prev-btn elevation-3 hidden md:flex" @click="onClick"></v-btn>
            </template>
            <template v-slot:next="{ onClick }">
              <v-btn icon="mdi-chevron-right" variant="flat" color="white"
                class="custom-nav-btn next-btn elevation-3 hidden md:flex" @click="onClick"></v-btn>
            </template>

            <v-slide-group-item v-for="boughtProduct in peopleAlsoBought" :key="boughtProduct.productId">
              <div class="mx-2 mb-2 w-72 md:w-80 shrink-0">
                <ProductListing :product="boughtProduct" product-element-id="people-bought" class="h-full" />
              </div>
            </v-slide-group-item>
          </v-slide-group>
        </div>
      </section>

      <!-- Marketing Section 2: Explore Similar Tastes -->
      <section class="mb-32 relative" v-if="similarProducts.length">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center gap-2">
            <v-icon color="green-darken-1" icon="mdi-silverware-fork-knife" size="28"></v-icon>
            <h2 class="text-h5 font-weight-bold text-grey-darken-3 tracking-tight">Explore Similar Tastes</h2>
          </div>
          <v-btn variant="text" color="primary" class="font-weight-bold px-0">See All</v-btn>
        </div>

        <div class="group relative">
          <v-slide-group show-arrows class="py-2 product-slide-group">
            <template v-slot:prev="{ onClick }">
              <v-btn icon="mdi-chevron-left" variant="flat" color="white"
                class="custom-nav-btn prev-btn elevation-3 hidden md:flex" @click="onClick"></v-btn>
            </template>
            <template v-slot:next="{ onClick }">
              <v-btn icon="mdi-chevron-right" variant="flat" color="white"
                class="custom-nav-btn next-btn elevation-3 hidden md:flex" @click="onClick"></v-btn>
            </template>

            <v-slide-group-item v-for="simProduct in similarProducts" :key="simProduct.productId">
              <div class="mx-2 mb-2 w-72 md:w-80 shrink-0">
                <ProductListing :product="simProduct" product-element-id="similar-product" class="h-full" />
              </div>
            </v-slide-group-item>
          </v-slide-group>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
import useProduct from '@/composables/useProduct';
import { useProductStore, useSetupStore, useCartStore } from '@/store';
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductListing from '@/components/ProductListing.vue';

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
const { product, getCategoryById, getImageById, products } = storeToRefs(productStore);
const { currency } = storeToRefs(setupStore);
const { cart } = storeToRefs(cartStore);

// LOCAL STATE
const selectedVariantId = ref(null);
// We'll store the actual image object locally for selection state, defaulting to first resolved image
const _selectedImage = ref(null);

// DATA FETCHING & STATE INITIALIZATION
watch(() => route.params.productId, async (newId) => {
  if (newId) {
    // Reset state
    productStore.$reset();
    selectedVariantId.value = null;
    _selectedImage.value = null;

    await fetchProduct(newId, { eager: true });

    if (product.value) {
      // 1. Resolve Variants and Sales Priority
      if (product.value.variants && product.value.variants.length > 0) {
        // Find first variant on sale
        const saleVariant = product.value.variants.find(v => v.saleInfo?.onSale);
        if (saleVariant) {
          selectedVariantId.value = saleVariant.variantId;
        } else {
          // Default to first variant
          selectedVariantId.value = product.value.variants[0].variantId;
        }
      }

      // 2. Initial Image Selection
      // Since resolvedImages is computed, we can't access it immediately synchronously if it depends on store state that might update.
      // But typically we can just rely on the computed property's first item if _selectedImage is null.
    }
  }
}, { immediate: true });


// RESOLVED DATA HELPERS
const resolvedCategories = computed(() => {
  if (!product.value?.categoryIds) return [];
  return product.value.categoryIds.map(id => getCategoryById.value[id]).filter(Boolean);
});

const resolvedImages = computed(() => {
  if (!product.value?.imageIds) return [];
  return product.value.imageIds.map(id => getImageById.value[id]).filter(Boolean);
});

const selectedImage = computed({
  get: () => _selectedImage.value || resolvedImages.value[0] || { url: '', altText: '' },
  set: (val) => _selectedImage.value = val
});

const selectedVariant = computed(() => {
  if (!product.value) return null;
  if (!selectedVariantId.value || !product.value.variants?.length) {
    // If no variants, mock a "variant" structure from base product if needed, 
    // but schema says variants are always present in V2? 
    // Schema shows "variants" array. If empty, product is likely incomplete or simple.
    // We'll return product structure assuming simple product if variants missing (though V2 seems strict on variants)
    return product.value;
  }
  return product.value.variants.find(v => v.variantId === selectedVariantId.value);
});


// MARKETING DATA (Mocks based on store products)
const similarProducts = computed(() => {
  if (!products.value || !product.value) return [];
  // Filter products that share at least one category, exclude current product
  return products.value
    .filter(p => p.productId !== product.value.productId)
    .slice(0, 10); // Limit to 10 for carousel
});

const peopleAlsoBought = computed(() => {
  if (!products.value || !product.value) return [];
  // For now, just take a different slice or random selection
  // In a real app, this would come from an analytics endpoint
  return products.value
    .filter(p => p.productId !== product.value.productId)
    .slice(4, 12); // Take 8 items for carousel
});


// PRICE & SALE LOGIC (V2 Schema: price is string "600.00", saleInfo is object)
const saleInfo = computed(() => selectedVariant.value?.saleInfo || {});
const onSale = computed(() => saleInfo.value.onSale === true);

// Parse prices safely
const originalPrice = computed(() => parseFloat(selectedVariant.value?.price || product.value?.price || 0));
const discountedPrice = computed(() => parseFloat(saleInfo.value.discountedPrice || 0));

const displayPrice = computed(() => {
  if (onSale.value) {
    return discountedPrice.value.toFixed(2);
  }
  return originalPrice.value.toFixed(2);
});

const savingsAmount = computed(() => {
  if (!onSale.value) return "0.00";
  return (originalPrice.value - discountedPrice.value).toFixed(2);
});

const savingsPercentage = computed(() => {
  if (!onSale.value || originalPrice.value === 0) return 0;
  return Math.round(((originalPrice.value - discountedPrice.value) / originalPrice.value) * 100);
});


// CART LOGIC
const numberOfProductInCart = computed(() => {
  if (!product.value?.productId) return 0;
  const itemsById = cart.value.Items?.reduce((acc, item) => {
    acc[item.productId] = item;
    return acc;
  }, {});
  return itemsById?.[product.value.productId]?.quantity || 0;
});

const stockStatus = computed(() => {
  if (!selectedVariant.value) {
    return { available: false, text: 'Select an option', color: 'text-gray-500', iconColor: 'bg-gray-400' };
  }

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

:deep(iframe) {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  /* 8px */
}

/* Custom Navigation Buttons (Maintaining Product Listing Experience) */
.custom-nav-btn {
  position: absolute !important;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 48px !important;
  height: 48px !important;
  border-radius: 50% !important;
  background-color: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition: all 0.2s ease-in-out;
}

.custom-nav-btn:hover {
  background-color: white !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-50%) scale(1.1);
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

/* Hide default Vuetify slide group arrows */
:deep(.v-slide-group__prev),
:deep(.v-slide-group__next) {
  display: none !important;
}
</style>