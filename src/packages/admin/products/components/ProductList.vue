<template>
    <v-data-table :headers="headers" :items="products" :loading="loading" :search="search" class="premium-table"
        item-key="pid" density="comfortable" hover fixed-header height="auto"
        :sort-by="[{ key: sortBy, order: sortOrder }]" :page="page" :items-per-page="itemsPerPage"
        :server-items-length="totalItems" :selected="selectedProducts"
        @update:selected="(val) => $emit('update:selectedProducts', val)" show-select hide-default-footer>
        <!-- Image Column -->
        <template #[`item.images`]="{ item }">
            <div class="d-flex align-center">
                <v-avatar size="40" class="mr-2">
                    <v-img :src="item.images[0]?.url || '/placeholder.png'" :alt="item.name" cover />
                </v-avatar>
                <div class="d-flex flex-column">
                    <span class="text-body-2 font-weight-medium">{{ item.name }}</span>
                    <span class="text-caption text-medium-emphasis">
                        {{ truncateDescription(item.description, 50) }}
                    </span>
                </div>
            </div>
        </template>

        <!-- Price Column -->
        <template #[`item.price`]="{ item }">
            <div class="price-container">
                <span v-if="item.discount" class="original-price text-decoration-line-through">
                    ${{ item.price }}
                </span>
                <span class="font-weight-bold">
                    ${{ getDiscountedPrice(item) }}
                </span>
                <v-chip v-if="item.discount" size="x-small" color="error" variant="tonal" class="discount-chip">
                    {{ item.discount }}% OFF
                </v-chip>
            </div>
        </template>

        <!-- Stock Column -->
        <template #[`item.stock`]="{ item }">
            <div class="d-flex align-center">
                <v-chip :color="getStockColor(item.stock)" variant="tonal" size="small" class="stock-chip">
                    {{ item.stock }}
                </v-chip>
                <v-progress-linear :model-value="getStockPercentage(item.stock)" :color="getStockColor(item.stock)"
                    height="4" class="stock-progress ml-2" style="width: 60px" />
            </div>
        </template>

        <!-- Categories Column -->
        <template #[`item.categories`]="{ item }">
            <div class="d-flex gap-1 flex-wrap">
                <v-chip v-for="category in getProductCategories(item)" :key="category.cid" size="x-small"
                    variant="outlined" class="category-chip">
                    {{ category.name }}
                </v-chip>
            </div>
        </template>

        <!-- Status Column -->
        <template #[`item.status`]="{ item }">
            <v-chip :color="getStatusColor(item)" variant="tonal" size="small">
                {{ getStatusText(item) }}
            </v-chip>
        </template>

        <!-- Actions Column -->
        <template #[`item.actions`]="{ item }">
            <div class="d-flex gap-2">
                <v-btn icon="mdi-pencil" variant="text" color="primary" size="small" @click="$emit('edit', item)"
                    :disabled="loading" />
                <v-btn icon="mdi-delete" variant="text" color="error" size="small" @click="$emit('delete', item)"
                    :disabled="loading" />
            </div>
        </template>
    </v-data-table>
</template>

<script setup>
import { useSetupStore } from '@/store';
import { storeToRefs } from 'pinia';

defineProps({
    products: {
        type: Array,
        required: true
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
        default: 'name'
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
        default: 20
    },
    totalItems: {
        type: Number,
        required: true
    },
    selectedProducts: {
        type: Array,
        default: () => []
    }
});

defineEmits([
    'update:selectedProducts',
    'update:page',
    'update:itemsPerPage',
    'update:sortBy',
    'update:sortOrder',
    'edit',
    'delete'
]);

const setupStore = useSetupStore();
const { categories } = storeToRefs(setupStore);

const headers = [
    { title: 'Product', key: 'images', sortable: false, width: '300px' },
    { title: 'Price', key: 'price', align: 'end' },
    { title: 'Stock', key: 'stock', align: 'end' },
    { title: 'Categories', key: 'categories', sortable: false },
    { title: 'Status', key: 'status', align: 'center' },
    { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '100px' }
];

function getDiscountedPrice(product) {
    if (!product.discount) return product.price;
    return (product.price * (1 - product.discount / 100)).toFixed(2);
}

function getStockColor(stock) {
    if (stock === 0) return 'error';
    if (stock <= 10) return 'warning';
    return 'success';
}

function getStockPercentage(stock) {
    // Assuming max stock is 100 for percentage calculation
    return Math.min((stock / 100) * 100, 100);
}

function getStatusColor(product) {
    if (product.stock === 0) return 'error';
    if (product.stock <= 10) return 'warning';
    if (product.discount) return 'info';
    return 'success';
}

function getStatusText(product) {
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock <= 10) return 'Low Stock';
    if (product.discount) return 'On Sale';
    return 'In Stock';
}

function truncateDescription(description, length = 100) {
    if (!description) return '';
    return description.length > length
        ? description.substring(0, length) + '...'
        : description;
}

function getProductCategories(product) {
    if (!product.categories) return [];
    return categories.value.filter(cat =>
        product.categories.includes(cat.cid)
    );
}
</script>

<style scoped>
.premium-table {
    border-radius: 16px;
    overflow: hidden;
}

.price-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
}

.original-price {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
}

.discount-chip {
    font-size: 0.625rem;
    height: 16px;
}

.stock-chip {
    min-width: 48px;
    justify-content: center;
}

.stock-progress {
    border-radius: 2px;
}

.category-chip {
    font-size: 0.75rem;
    height: 20px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .original-price {
        color: rgba(255, 255, 255, 0.6);
    }
}

/* Accessibility */
:deep(.v-data-table__wrapper) {
    outline: none;
}

:deep(.v-data-table__wrapper:focus-visible) {
    outline: 2px solid #7b61ff;
    outline-offset: 2px;
}

/* High contrast mode */
@media (forced-colors: active) {
    :deep(.v-data-table) {
        border: 2px solid CanvasText;
    }
}
</style>