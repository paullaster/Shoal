<template>
    <div class="user-history-wrapper py-4">
        
        <!-- Section 1: Chef's Favorites (Horizontal Scroll) -->
        <section class="mb-10 relative" v-if="trendingProducts.length">
            <div class="d-flex align-center justify-space-between mb-4">
                <div class="d-flex align-center gap-2">
                    <v-icon color="orange-darken-1" icon="mdi-fire" size="28"></v-icon>
                    <h2 class="text-h5 font-weight-bold text-grey-darken-3 tracking-tight">Chef's Favorites</h2>
                </div>
                <v-btn variant="text" color="primary" class="font-weight-bold px-0">See All</v-btn>
            </div>
            
            <div class="group relative">
                <v-slide-group show-arrows class="py-2 product-slide-group">
                    <template v-slot:prev="{ onClick }">
                        <v-btn
                            icon="mdi-chevron-left"
                            variant="flat"
                            color="white"
                            class="custom-nav-btn prev-btn elevation-3 hidden md:flex"
                            @click="onClick"
                        ></v-btn>
                    </template>
                    <template v-slot:next="{ onClick }">
                        <v-btn
                            icon="mdi-chevron-right"
                            variant="flat"
                            color="white"
                            class="custom-nav-btn next-btn elevation-3 hidden md:flex"
                            @click="onClick"
                        ></v-btn>
                    </template>

                    <v-slide-group-item
                        v-for="(product, index) in trendingProducts"
                        :key="product.id || index"
                    >
                        <div class="mx-2 mb-2 w-72 md:w-80 flex-shrink-0">
                            <ProductListing :product="product" class="h-full" />
                        </div>
                    </v-slide-group-item>
                </v-slide-group>
            </div>
        </section>

        <!-- Section 2: Fresh from the Kitchen (Main Grid) -->
        <section>
            <div class="d-flex align-center justify-space-between mb-4">
                <div class="d-flex align-center gap-2">
                    <v-icon color="green-darken-1" icon="mdi-leaf" size="28"></v-icon>
                    <h2 class="text-h5 font-weight-bold text-grey-darken-3 tracking-tight">Fresh from the Kitchen</h2>
                </div>
                <v-btn variant="text" color="primary" class="font-weight-bold px-0">See All</v-btn>
            </div>
            
            <!-- Filter Chips -->
            <div class="mb-6 sticky top-20 z-30 bg-white/95 backdrop-blur-md py-2 px-0 transition-all">
                 <v-slide-group show-arrows>
                    <v-slide-group-item v-slot="{ isSelected, toggle }">
                        <v-chip
                            class="ma-2 font-weight-bold"
                            :color="activeCategory === null ? 'primary' : undefined"
                            :variant="activeCategory === null ? 'flat' : 'outlined'"
                            rounded="pill"
                            @click="activeCategory = null"
                            elevation="0"
                            size="default"
                        >
                            All
                        </v-chip>
                    </v-slide-group-item>
                    <v-slide-group-item
                        v-for="category in categories"
                        :key="category.categoryId"
                        v-slot="{ isSelected, toggle }"
                    >
                        <v-chip
                            class="ma-2 font-weight-bold"
                            :color="activeCategory === category.categoryId ? 'primary' : undefined"
                            :variant="activeCategory === category.categoryId ? 'flat' : 'outlined'"
                            rounded="pill"
                            @click="activeCategory = category.categoryId"
                            elevation="0"
                            size="default"
                        >
                            {{ category.name }}
                        </v-chip>
                    </v-slide-group-item>
                </v-slide-group>
            </div>
    
            <!-- Product Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ProductListing 
                    v-for="(product, index) in filteredProducts" 
                    :key="product.id || index" 
                    :product="product" 
                    class="h-full" 
                />
            </div>
            
            <!-- Empty State -->
            <div v-if="filteredProducts.length === 0" class="text-center py-10 text-grey">
                <v-icon size="large" class="mb-2">mdi-food-off</v-icon>
                <p>No products found in this category.</p>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useSetupStore } from '@/store';
import ProductListing from '@/components/ProductListing.vue';
import useProduct from '@/composables/useProduct';

// Composables & Store
const { getProducts } = useProduct();
const setupStore = useSetupStore();
const { categories } = storeToRefs(setupStore);

// State
const activeCategory = ref(null); // null means 'All'

// Computed
const trendingProducts = computed(() => {
    // For now, take the first 6 products as "Trending"
    return getProducts.value ? getProducts.value.slice(0, 6) : [];
});

const filteredProducts = computed(() => {
    if (!activeCategory.value) {
        return getProducts.value;
    }
    return getProducts.value.filter(product => product.category === activeCategory.value);
});
</script>

<style scoped>
.user-history-wrapper {
    /* Removed background-color and specific border-radius to blend seamlessly */
    background-color: transparent; 
}

/* Custom Navigation Buttons */
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

/* Hide default Vuetify slide group arrows if they persist */
:deep(.v-slide-group__prev),
:deep(.v-slide-group__next) {
    display: none !important;
} 
</style>