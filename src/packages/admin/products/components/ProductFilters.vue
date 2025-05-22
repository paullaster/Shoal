<template>
    <v-navigation-drawer :model-value="modelValue" @update:model-value="(val) => $emit('update:modelValue', val)"
        location="right" temporary width="360" class="filter-panel" :class="{ 'filter-panel-mobile': isMobile }">
        <template v-slot:prepend>
            <div class="filter-panel-header pa-4">
                <div class="d-flex align-center justify-space-between">
                    <div class="text-h6 font-weight-bold">Filter & Sort</div>
                    <v-btn icon="mdi-close" variant="text" @click="$emit('update:modelValue', false)"
                        class="close-btn" />
                </div>
                <div class="text-subtitle-2 text-medium-emphasis mt-1">
                    Refine your product list with advanced filters
                </div>
            </div>
        </template>

        <v-divider />

        <v-card-text class="pa-4">
            <v-form ref="filterForm" @submit.prevent>
                <!-- Sort Options -->
                <div class="filter-section mb-6">
                    <div class="filter-section-header d-flex align-center mb-3">
                        <v-icon color="primary" class="mr-2">mdi-sort</v-icon>
                        <div class="text-subtitle-1 font-weight-medium">Sort Options</div>
                    </div>
                    <v-select v-model="filters.sortBy" :items="sortOptions" variant="outlined" density="comfortable"
                        hide-details class="premium-input mb-2" placeholder="Sort by..."
                        @update:model-value="emitUpdate" />
                    <v-radio-group v-model="filters.sortOrder" density="comfortable" hide-details class="mt-2"
                        @update:model-value="emitUpdate">
                        <v-radio label="Ascending" value="asc" />
                        <v-radio label="Descending" value="desc" />
                    </v-radio-group>
                </div>

                <!-- Price Range -->
                <div class="filter-section mb-6">
                    <div class="filter-section-header d-flex align-center mb-3">
                        <v-icon color="primary" class="mr-2">mdi-currency-usd</v-icon>
                        <div class="text-subtitle-1 font-weight-medium">Price Range</div>
                    </div>
                    <div class="d-flex gap-2">
                        <v-text-field v-model.number="filters.priceRange.min" label="Min Price" type="number"
                            variant="outlined" density="comfortable" hide-details class="premium-input"
                            @update:model-value="emitUpdate" />
                        <v-text-field v-model.number="filters.priceRange.max" label="Max Price" type="number"
                            variant="outlined" density="comfortable" hide-details class="premium-input"
                            @update:model-value="emitUpdate" />
                    </div>
                </div>

                <!-- Stock Status -->
                <div class="filter-section mb-6">
                    <div class="filter-section-header d-flex align-center mb-3">
                        <v-icon color="primary" class="mr-2">mdi-package-variant</v-icon>
                        <div class="text-subtitle-1 font-weight-medium">Stock Status</div>
                    </div>
                    <v-select v-model="filters.stockStatus" :items="stockStatusOptions" variant="outlined"
                        density="comfortable" hide-details class="premium-input" placeholder="Filter by stock status..."
                        @update:model-value="emitUpdate" />
                </div>

                <!-- Categories -->
                <div class="filter-section mb-6">
                    <div class="filter-section-header d-flex align-center mb-3">
                        <v-icon color="primary" class="mr-2">mdi-folder</v-icon>
                        <div class="text-subtitle-1 font-weight-medium">Categories</div>
                    </div>
                    <v-autocomplete v-model="filters.categories" :items="categories" item-title="name" item-value="cid"
                        variant="outlined" density="comfortable" hide-details class="premium-input"
                        placeholder="Select categories..." multiple chips closable-chips
                        @update:model-value="emitUpdate">
                        <template v-slot:chip="{ props, item }">
                            <v-chip v-bind="props" :color="item.raw.color || 'primary'" variant="tonal">
                                <v-icon start :icon="item.raw.icon || 'mdi-folder'" />
                                {{ item.raw.name }}
                            </v-chip>
                        </template>
                    </v-autocomplete>
                </div>

                <!-- Discount Status -->
                <div class="filter-section mb-6">
                    <div class="filter-section-header d-flex align-center mb-3">
                        <v-icon color="primary" class="mr-2">mdi-tag</v-icon>
                        <div class="text-subtitle-1 font-weight-medium">Discount Status</div>
                    </div>
                    <v-select v-model="filters.discountStatus" :items="discountStatusOptions" variant="outlined"
                        density="comfortable" hide-details class="premium-input"
                        placeholder="Filter by discount status..." @update:model-value="emitUpdate" />
                </div>

                <v-divider class="my-6" />

                <!-- Filter Actions -->
                <div class="filter-actions">
                    <v-btn block color="grey-darken-1" variant="tonal" class="mb-2" @click="resetFilters">
                        <v-icon start>mdi-refresh</v-icon>
                        Reset Filters
                    </v-btn>
                    <v-btn block color="primary" @click="applyFilters" :disabled="!hasActiveFilters"
                        class="apply-filters-btn">
                        <v-icon start>mdi-check</v-icon>
                        Apply Filters
                    </v-btn>
                </div>
            </v-form>
        </v-card-text>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useSetupStore } from '@/store';
import { storeToRefs } from 'pinia';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    isMobile: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    'update:modelValue',
    'update:filters'
]);

const setupStore = useSetupStore();
const { categories } = storeToRefs(setupStore);

const filterForm = ref(null);

const filters = ref({
    sortBy: 'name',
    sortOrder: 'asc',
    priceRange: {
        min: null,
        max: null
    },
    stockStatus: 'All',
    categories: [],
    discountStatus: 'All'
});

const sortOptions = [
    { title: 'Name', value: 'name' },
    { title: 'Price', value: 'price' },
    { title: 'Stock', value: 'stock' },
    { title: 'Created Date', value: 'createdAt' }
];

const stockStatusOptions = [
    { title: 'All', value: 'All' },
    { title: 'In Stock', value: 'In Stock' },
    { title: 'Low Stock', value: 'Low Stock' },
    { title: 'Out of Stock', value: 'Out of Stock' }
];

const discountStatusOptions = [
    { title: 'All', value: 'All' },
    { title: 'On Sale', value: 'On Sale' },
    { title: 'No Discount', value: 'No Discount' }
];

const hasActiveFilters = computed(() => {
    return (
        filters.value.sortBy !== 'name' ||
        filters.value.sortOrder !== 'asc' ||
        filters.value.priceRange.min !== null ||
        filters.value.priceRange.max !== null ||
        filters.value.stockStatus !== 'All' ||
        filters.value.categories.length > 0 ||
        filters.value.discountStatus !== 'All'
    );
});

function emitUpdate() {
    emit('update:filters', { ...filters.value });
}

function resetFilters() {
    filters.value = {
        sortBy: 'name',
        sortOrder: 'asc',
        priceRange: {
            min: null,
            max: null
        },
        stockStatus: 'All',
        categories: [],
        discountStatus: 'All'
    };
    emitUpdate();
}

function applyFilters() {
    emit('update:modelValue', false);
}

// Watch for external filter updates
watch(() => props.modelValue, (newValue) => {
    if (!newValue) {
        // Reset form when drawer is closed
        filterForm.value?.reset();
    }
});
</script>

<style scoped>
.filter-panel {
    border-radius: 16px 0 0 16px;
    overflow: hidden;
}

.filter-panel-header {
    background: linear-gradient(120deg, #1a2236 0%, #2d3652 100%);
    color: white;
}

.filter-section {
    background: rgba(123, 97, 255, 0.04);
    border-radius: 12px;
    padding: 16px;
}

.filter-section-header {
    color: rgba(0, 0, 0, 0.87);
}

.premium-input {
    background: white;
    border-radius: 8px;
}

.apply-filters-btn {
    border-radius: 8px;
    text-transform: none;
    letter-spacing: 0.01em;
    font-weight: 600;
    height: 44px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .filter-section {
        background: rgba(255, 255, 255, 0.04);
    }

    .filter-section-header {
        color: rgba(255, 255, 255, 0.87);
    }

    .premium-input {
        background: #1a1a1a;
    }
}

/* Mobile adjustments */
.filter-panel-mobile {
    border-radius: 0;
}

/* Accessibility */
.filter-panel:focus-visible {
    outline: 2px solid #7b61ff;
    outline-offset: 2px;
}

/* High contrast mode */
@media (forced-colors: active) {
    .filter-panel {
        border: 2px solid CanvasText;
    }

    .filter-section {
        border: 1px solid CanvasText;
    }
}
</style>