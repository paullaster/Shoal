<template>
    <div class="user-history-wrapper py-4 px-3 md:px-5">
        
        <!-- Section 1: Chef's Favorites (Horizontal Scroll) -->
        <section class="mb-10" v-if="trendingProducts.length">
            <div class="d-flex align-center justify-space-between mb-4">
                <div class="d-flex align-center gap-2">
                    <v-icon color="orange-darken-1" icon="mdi-fire" size="28"></v-icon>
                    <h2 class="text-h5 font-weight-bold text-grey-darken-3 tracking-tight">Chef's Favorites</h2>
                </div>
                <v-btn variant="text" color="primary" class="font-weight-bold px-0">See All</v-btn>
            </div>
            
            <v-slide-group show-arrows class="py-2">
                <v-slide-group-item
                    v-for="(product, index) in trendingProducts"
                    :key="product.id || index"
                >
                    <div class="mx-2 mb-2 w-72 flex-shrink-0">
                        <ProductListing :product="product" class="h-full" />
                    </div>
                </v-slide-group-item>
            </v-slide-group>
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
            <div class="mb-6 sticky top-20 z-30 bg-white/95 backdrop-blur-md py-2 -mx-2 px-2 transition-all">
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
</style>