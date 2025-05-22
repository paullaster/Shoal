<template>
    <div class="discount-manager">
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-6">
            <div>
                <div class="text-h6 font-weight-bold">Product Discounts</div>
                <div class="text-subtitle-2 text-medium-emphasis">
                    Manage discounts and promotions for selected products
                </div>
            </div>
            <v-btn color="primary" variant="elevated" prepend-icon="mdi-tag-plus" @click="openCreateDialog">
                New Discount
            </v-btn>
        </div>

        <!-- Selected Products Summary -->
        <v-card class="selected-products mb-6" variant="outlined">
            <v-card-title class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-package-variant</v-icon>
                Selected Products
                <v-chip color="primary" variant="tonal" class="ml-2" size="small">
                    {{ selectedProducts.length }}
                </v-chip>
            </v-card-title>
            <v-card-text>
                <div v-if="selectedProducts.length" class="product-chips">
                    <v-chip v-for="product in selectedProducts" :key="product.pid" color="primary" variant="tonal"
                        class="mr-2 mb-2" closable @click:close="removeProduct(product)">
                        <v-avatar start size="24" class="mr-2">
                            <v-img :src="product.images[0]?.url || '/placeholder.png'" />
                        </v-avatar>
                        {{ product.name }}
                    </v-chip>
                </div>
                <div v-else class="text-center text-medium-emphasis py-4">
                    No products selected. Please select products from the product list.
                </div>
            </v-card-text>
        </v-card>

        <!-- Active Discounts -->
        <v-card class="discount-list mb-6" variant="outlined">
            <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                    <v-icon color="success" class="mr-2">mdi-tag-multiple</v-icon>
                    Active Discounts
                </div>
                <v-btn icon="mdi-refresh" variant="text" size="small" @click="refreshDiscounts" />
            </v-card-title>
            <v-card-text class="pa-0">
                <v-list>
                    <v-list-item v-for="discount in activeDiscounts" :key="discount.id" :value="discount"
                        class="discount-list-item">
                        <template v-slot:prepend>
                            <v-avatar :color="getDiscountColor(discount.type)" size="36" class="discount-icon">
                                <v-icon color="white" size="small">
                                    {{ getDiscountIcon(discount.type) }}
                                </v-icon>
                            </v-avatar>
                        </template>

                        <v-list-item-title class="text-subtitle-1 font-weight-medium">
                            {{ discount.name }}
                        </v-list-item-title>

                        <v-list-item-subtitle class="text-caption">
                            <div class="d-flex align-center">
                                <span class="mr-2">{{ formatDiscountValue(discount) }}</span>
                                <v-chip size="x-small" :color="discount.status === 'active' ? 'success' : 'warning'"
                                    variant="tonal">
                                    {{ discount.status }}
                                </v-chip>
                            </div>
                            <div class="text-caption text-medium-emphasis mt-1">
                                {{ formatDiscountPeriod(discount) }}
                            </div>
                        </v-list-item-subtitle>

                        <template v-slot:append>
                            <div class="d-flex align-center gap-2">
                                <v-btn icon="mdi-pencil" variant="text" color="primary" size="small"
                                    @click="editDiscount(discount)" />
                                <v-btn icon="mdi-delete" variant="text" color="error" size="small"
                                    @click="confirmDelete(discount)" />
                            </div>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>

        <!-- Create/Edit Discount Dialog -->
        <v-dialog v-model="createDialog" max-width="600px">
            <v-card class="rounded-xl pa-6">
                <v-card-title class="text-h5 font-weight-bold">
                    {{ editingDiscount ? 'Edit Discount' : 'New Discount' }}
                </v-card-title>
                <v-card-text>
                    <v-form ref="discountFormRef" @submit.prevent="saveDiscount">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="discountForm.name" label="Discount Name" :rules="rules.name"
                                    variant="outlined" density="comfortable" class="mb-4" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="discountForm.type" :items="discountTypes" label="Discount Type"
                                    :rules="rules.type" variant="outlined" density="comfortable" class="mb-4">
                                    <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props">
                                            <template v-slot:prepend>
                                                <v-icon :icon="getDiscountIcon(item.raw)"
                                                    :color="getDiscountColor(item.raw)" />
                                            </template>
                                            <v-list-item-title>{{ formatDiscountType(item.raw) }}</v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="discountForm.value" :label="getValueLabel" :rules="rules.value"
                                    type="number" :prefix="discountForm.type === 'percentage' ? '' : '$'"
                                    :suffix="discountForm.type === 'percentage' ? '%' : ''" variant="outlined"
                                    density="comfortable" class="mb-4" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-menu v-model="startDateMenu" :close-on-content-click="false"
                                    transition="scale-transition" min-width="auto">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-model="discountForm.startDate" label="Start Date"
                                            :rules="rules.startDate" readonly v-bind="props" variant="outlined"
                                            density="comfortable" class="mb-4" />
                                    </template>
                                    <v-date-picker v-model="discountForm.startDate"
                                        :min="new Date().toISOString().substr(0, 10)"
                                        @update:model-value="startDateMenu = false" />
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-menu v-model="endDateMenu" :close-on-content-click="false"
                                    transition="scale-transition" min-width="auto">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-model="discountForm.endDate" label="End Date"
                                            :rules="rules.endDate" readonly v-bind="props" variant="outlined"
                                            density="comfortable" class="mb-4" />
                                    </template>
                                    <v-date-picker v-model="discountForm.endDate" :min="discountForm.startDate"
                                        @update:model-value="endDateMenu = false" />
                                </v-menu>
                            </v-col>
                            <v-col cols="12">
                                <v-switch v-model="discountForm.isActive" label="Active" color="success" hide-details
                                    class="mb-4" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" @click="createDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveDiscount" :loading="saving" :disabled="!isFormValid">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Confirmation -->
        <v-dialog v-model="deleteDialog" max-width="400px">
            <v-card class="rounded-xl pa-6">
                <v-card-title class="text-h5 font-weight-bold">
                    Confirm Delete
                </v-card-title>
                <v-card-text>
                    Are you sure you want to delete the discount
                    <strong>{{ itemToDelete?.name }}</strong>?
                    This action cannot be undone.
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" @click="deleteDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="error" @click="confirmDeleteAction" :loading="deleting">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';

// Props
const props = defineProps({
    selectedProducts: {
        type: Array,
        default: () => [],
    },
});

// Emits
const emit = defineEmits(['close', 'update']);

// Stores
const productStore = useProductStore();
const { discounts } = storeToRefs(productStore);

// Form refs
const discountFormRef = ref(null);
const saving = ref(false);
const deleting = ref(false);

// State
const editingDiscount = ref(null);
const itemToDelete = ref(null);
const startDateMenu = ref(false);
const endDateMenu = ref(false);

// Dialogs
const createDialog = ref(false);
const deleteDialog = ref(false);

// Form state
const discountForm = ref({
    name: '',
    type: 'percentage',
    value: 0,
    startDate: new Date().toISOString().substr(0, 10),
    endDate: '',
    isActive: true,
});

// Discount types
const discountTypes = [
    { title: 'Percentage Off', value: 'percentage' },
    { title: 'Fixed Amount Off', value: 'fixed' },
    { title: 'Buy X Get Y', value: 'buy_x_get_y' },
];

// Validation rules
const rules = {
    name: [(v) => !!v || 'Discount name is required'],
    type: [(v) => !!v || 'Discount type is required'],
    value: [
        (v) => !!v || 'Discount value is required',
        (v) => v > 0 || 'Value must be greater than 0',
        (v) => discountForm.value.type === 'percentage' ? v <= 100 : true || 'Percentage cannot exceed 100%',
    ],
    startDate: [(v) => !!v || 'Start date is required'],
    endDate: [
        (v) => !!v || 'End date is required',
        (v) => v >= discountForm.value.startDate || 'End date must be after start date',
    ],
};

// Computed
const isFormValid = computed(() => {
    return discountFormRef.value?.validate() ?? false;
});

const activeDiscounts = computed(() => {
    return discounts.value.filter(d => d.isActive);
});

const getValueLabel = computed(() => {
    switch (discountForm.value.type) {
        case 'percentage':
            return 'Percentage Off';
        case 'fixed':
            return 'Amount Off';
        case 'buy_x_get_y':
            return 'Buy X Get Y Value';
        default:
            return 'Value';
    }
});

// Methods
function getDiscountIcon(type) {
    switch (type) {
        case 'percentage':
            return 'mdi-percent';
        case 'fixed':
            return 'mdi-currency-usd';
        case 'buy_x_get_y':
            return 'mdi-gift';
        default:
            return 'mdi-tag';
    }
}

function getDiscountColor(type) {
    switch (type) {
        case 'percentage':
            return 'success';
        case 'fixed':
            return 'primary';
        case 'buy_x_get_y':
            return 'warning';
        default:
            return 'grey';
    }
}

function formatDiscountType(type) {
    return discountTypes.find(t => t.value === type)?.title || type;
}

function formatDiscountValue(discount) {
    switch (discount.type) {
        case 'percentage':
            return `${discount.value}% off`;
        case 'fixed':
            return `$${discount.value} off`;
        case 'buy_x_get_y':
            return `Buy ${discount.buyQuantity} Get ${discount.getQuantity} at ${discount.value}% off`;
        default:
            return discount.value;
    }
}

function formatDiscountPeriod(discount) {
    const start = new Date(discount.startDate).toLocaleDateString();
    const end = new Date(discount.endDate).toLocaleDateString();
    return `${start} - ${end}`;
}

function openCreateDialog() {
    editingDiscount.value = null;
    discountForm.value = {
        name: '',
        type: 'percentage',
        value: 0,
        startDate: new Date().toISOString().substr(0, 10),
        endDate: '',
        isActive: true,
    };
    createDialog.value = true;
}

function editDiscount(discount) {
    editingDiscount.value = discount;
    discountForm.value = { ...discount };
    createDialog.value = true;
}

function confirmDelete(discount) {
    itemToDelete.value = discount;
    deleteDialog.value = true;
}

function removeProduct(product) {
    emit('update', props.selectedProducts.filter(p => p.pid !== product.pid));
}

async function saveDiscount() {
    try {
        const { valid } = await discountFormRef.value.validate();
        if (!valid) {
            useToast().error('Please fill in all required fields');
            return;
        }

        saving.value = true;

        const discountData = {
            ...discountForm.value,
            products: props.selectedProducts.map(p => p.pid),
        };

        if (editingDiscount.value) {
            await productStore.updateDiscount({
                ...editingDiscount.value,
                ...discountData,
            });
            useToast().success('Discount updated successfully');
        } else {
            await productStore.createDiscount(discountData);
            useToast().success('Discount created successfully');
        }

        createDialog.value = false;
        emit('update', discounts.value);
    } catch (error) {
        console.error('Error saving discount:', error);
        useToast().error('Failed to save discount');
    } finally {
        saving.value = false;
    }
}

async function confirmDeleteAction() {
    try {
        deleting.value = true;
        await productStore.deleteDiscount(itemToDelete.value.id);
        useToast().success('Discount deleted successfully');
        deleteDialog.value = false;
        emit('update', discounts.value);
    } catch (error) {
        console.error('Error deleting discount:', error);
        useToast().error('Failed to delete discount');
    } finally {
        deleting.value = false;
    }
}

function refreshDiscounts() {
    productStore.getDiscounts();
}

// Lifecycle
onMounted(() => {
    productStore.getDiscounts();
});
</script>

<style scoped>
.discount-manager {
    padding: 24px;
}

.selected-products,
.discount-list {
    border-radius: 12px !important;
    overflow: hidden;
}

.product-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.discount-list-item {
    border-radius: 8px !important;
    margin: 4px 8px !important;
    transition: all 0.2s ease !important;
}

.discount-list-item:hover {
    background: rgba(123, 97, 255, 0.04) !important;
}

.discount-icon {
    border: 2px solid rgba(255, 255, 255, 0.1);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {

    .selected-products,
    .discount-list {
        background: #1a1a1a !important;
        border-color: rgba(255, 255, 255, 0.12) !important;
    }

    .discount-list-item:hover {
        background: rgba(255, 255, 255, 0.04) !important;
    }
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .discount-manager {
        padding: 16px;
    }

    .product-chips {
        justify-content: center;
    }
}

/* Accessibility */
.discount-list-item:focus-visible {
    outline: 2px solid #7b61ff;
    outline-offset: 2px;
}

/* High contrast mode */
@media (forced-colors: active) {

    .selected-products,
    .discount-list {
        border: 2px solid CanvasText !important;
    }
}
</style>