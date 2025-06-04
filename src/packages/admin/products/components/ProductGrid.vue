<template>
    <v-container fluid class="pa-4 product-grid">
        <v-row v-if="products.length" style="padding-inline: 0 !important;">
            <v-col v-for="product in products" :key="product.pid" cols="12" sm="6" md="4" lg="3" xl="2"
                style="padding-inline: 0 !important;">
                <v-card class="product-card rounded-lg" elevation="2">
                    <div class="product-image-container">
                        <v-img :src="product.imageUrl || 'https://via.placeholder.com/300x200.png?text=No+Image'"
                            :alt="product.name" height="150" cover class="product-image" />

                        <!-- Discount Badge -->
                        <v-chip v-if="product.discount" color="pink-accent-3" density="compact"
                            class="product-discount-badge" label>{{ product.discount.type === 'Percentage' ? '-' +
                                product.discount.amount + '%' : '-$' + product.discount.amount
                            }}</v-chip>

                        <!-- Selection Checkbox -->
                        <v-checkbox :model-value="internalSelected.includes(product.pid)"
                            @update:model-value="toggleProductSelection(product.pid)" density="compact" hide-details
                            class="product-selection-checkbox" color="primary" />
                    </div>

                    <v-card-title class="text-subtitle-1 font-weight-bold product-title">{{ product.name
                        }}</v-card-title>

                    <v-card-subtitle class="text-caption text-medium-emphasis product-categories">
                        Categories: {{ getProductCategories(product.category).join(', ') }}
                    </v-card-subtitle>

                    <v-card-text class="pt-2 pb-0">
                        <div class="d-flex align-center justify-space-between mb-2">
                            <div class="product-price">
                                <span class="text-subtitle-1 font-weight-bold text-primary">{{
                                    calculateDiscountedPrice(product) }}</span>
                                <span v-if="product.discount"
                                    class="text-caption text-medium-emphasis text-decoration-line-through ml-2">{{
                                        product.price }}</span>
                            </div>

                            <!-- Stock Chip -->
                            <v-chip :color="getStockColor(product.stock)" density="compact" class="product-stock-chip"
                                :variant="product.stock === 0 ? 'elevated' : 'tonal'">
                                {{ product.stock > 0 ? 'Stock: ' + product.stock : 'Out of Stock' }}
                            </v-chip>
                        </div>

                        <div class="text-caption text-medium-emphasis product-description">
                            {{ truncateDescription(product.description) }}
                        </div>
                    </v-card-text>

                    <v-card-actions class="product-actions">
                        <v-spacer />
                        <v-btn icon="mdi-pencil" size="small" variant="text" color="primary"
                            @click="$emit('edit', product)" />
                        <v-btn icon="mdi-delete" size="small" variant="text" color="error"
                            @click="$emit('delete', product)" />
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else-if="loading">
            <v-col cols="12" class="text-center pa-6">
                <v-progress-circular indeterminate color="primary" size="48" />
                <div class="text-subtitle-1 mt-3">Loading products...</div>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12" class="text-center pa-6">
                <v-icon size="64" color="grey-lighten-1">mdi-package-variant-off</v-icon>
                <div class="text-h6 mt-3">No products found</div>
                <div v-if="search || hasActiveFilters" class="text-body-2 text-medium-emphasis">Try adjusting your
                    filters or search term.</div>
                <div v-else class="text-body-2 text-medium-emphasis">Start by adding a new product.</div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed } from 'vue';
import { useSetupStore } from '@/store';
import { storeToRefs } from 'pinia';

const props = defineProps({
    products: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    search: {
        type: String,
        default: ''
    },
    sortBy: {
        type: String,
        default: ''
    },
    sortOrder: {
        type: String,
        default: 'asc'
    },
    page: {
        type: Number,
        default: 1
    },
    itemsPerPage: {
        type: Number,
        default: 10
    },
    totalItems: {
        type: Number,
        default: 0
    },
    selected: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['update:selected', 'edit', 'delete']);

const setupStore = useSetupStore();
const { categories } = storeToRefs(setupStore);

function getProductCategories(categoryCid) {
    const category = categories.value.find(cat => cat.cid === categoryCid);
    return category ? [category.name] : [];
}

function calculateDiscountedPrice(product) {
    if (product.discount) {
        if (product.discount.type === 'Percentage') {
            return '$' + (product.price * (1 - product.discount.amount / 100)).toFixed(2);
        } else if (product.discount.type === 'Fixed') {
            const discounted = product.price - product.discount.amount;
            return '$' + (discounted > 0 ? discounted : 0).toFixed(2);
        }
    }
    return '$' + product.price.toFixed(2);
}

function getStockColor(stock) {
    if (stock === 0) return 'error';
    if (stock <= 10) return 'warning';
    return 'success';
}

function truncateDescription(description, maxLength = 100) {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
}

const internalSelected = computed({
    get: () => props.selected,
    set: (value) => emit('update:selected', value)
});

function toggleProductSelection(productId) {
    const newSelected = [...internalSelected.value];
    const index = newSelected.indexOf(productId);

    if (index === -1) {
        newSelected.push(productId);
    } else {
        newSelected.splice(index, 1);
    }
    internalSelected.value = newSelected;
}

const hasActiveFilters = computed(() => props.search !== '' || props.filterStatus !== 'All');
</script>

<style scoped>
.product-grid {
    /* Remove background from grid itself, let the parent container handle it */
}

.product-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    border: 1px solid rgba(123, 97, 255, 0.1);
    background: #fff;
    position: relative;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
    border-color: rgba(123, 97, 255, 0.2);
}

.product-image-container {
    position: relative;
}

.product-image {
    border-radius: 8px 8px 0 0;
}

.product-discount-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
    font-weight: bold;
}

.product-selection-checkbox {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
    border-radius: 0 0 8px 0;
    padding: 4px;
}

.product-title {
    padding-bottom: 0;
}

.product-categories {
    padding-top: 0;
}

.product-price span {
    display: inline-block;
}

.product-stock-chip {
    font-weight: bold;
}

.product-description {
    min-height: 3em;
}

.product-actions {
    background-color: rgba(0, 0, 0, 0.02);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .product-card {
        background: #1a1a1a;
        border-color: rgba(255, 255, 255, 0.08);
    }

    .product-card:hover {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.24);
        border-color: rgba(255, 255, 255, 0.15);
    }

    .product-actions {
        background-color: rgba(255, 255, 255, 0.05);
    }

    .product-selection-checkbox {
        border: 2px solid #ffffff !important;
    }

    /* Ensure text is white in dark mode */
    .product-title,
    .product-categories,
    .product-description {
        color: #ffffff !important;
    }
}

/* Accessibility */
:focus-visible .product-card {
    outline: 2px solid #7b61ff;
    outline-offset: 2px;
}

/* High contrast mode */
@media (forced-colors: active) {
    .product-card {
        border: 2px solid CanvasText !important;
    }

    .product-actions {
        background-color: Canvas;
    }

    .product-selection-checkbox {
        border: 2px solid CanvasText;
    }
}
</style>