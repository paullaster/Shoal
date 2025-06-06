<template>
    <v-dialog v-model="isOpen" max-width="600">
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title>{{ props.variant ? 'Edit Variant' : 'Add Variant' }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="isOpen = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="py-4">
                <v-row>
                    <v-col cols="12" md="6">
                        <div class="space-y-2">
                            <v-label for="variant-name-dialog">Variant Name</v-label>
                            <v-text-field id="variant-name-dialog" v-model="formData.name"
                                placeholder="e.g., Blue T-Shirt Large" variant="outlined" density="comfortable"
                                hide-details :error-messages="errors.name" @input="errors.name = ''"></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6">
                        <div class="space-y-2">
                            <v-label for="variant-sku-dialog">SKU</v-label>
                            <v-text-field id="variant-sku-dialog" v-model="formData.sku"
                                placeholder="e.g., TSHIRT-BLU-L" variant="outlined" density="comfortable" hide-details
                                :error-messages="errors.sku" @input="errors.sku = ''"></v-text-field>
                        </div>
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12" md="6">
                        <div class="space-y-2">
                            <v-label for="variant-price-dialog">Price</v-label>
                            <v-text-field id="variant-price-dialog" v-model.number="formData.price" type="number"
                                prefix="$" variant="outlined" density="comfortable" hide-details
                                :error-messages="errors.price" @input="errors.price = ''" min="0"
                                step="0.01"></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6">
                        <div class="space-y-2">
                            <v-label for="variant-quantity-dialog">Stock Quantity</v-label>
                            <v-text-field id="variant-quantity-dialog" v-model.number="formData.quantity" type="number"
                                variant="outlined" density="comfortable" hide-details :error-messages="errors.quantity"
                                @input="errors.quantity = ''" min="0" step="1"></v-text-field>
                        </div>
                    </v-col>
                </v-row>

                <template v-if="props.attributes.length > 0">
                    <v-divider class="my-4"></v-divider>
                    <div class="space-y-4">
                        <h3 class="font-weight-medium">Attributes</h3>
                        <v-row>
                            <v-col cols="12" md="6" v-for="attr in props.attributes" :key="attr.name">
                                <div class="space-y-2">
                                    <v-label :for="`attr-dialog-${attr.name}`">{{ attr.name }}</v-label>
                                    <v-select :id="`attr-dialog-${attr.name}`" v-model="formData.attributes[attr.name]"
                                        :items="attr.values" :placeholder="`Select ${attr.name}`" variant="outlined"
                                        density="comfortable" hide-details :error-messages="errors[`attr_${attr.name}`]"
                                        @update:model-value="errors[`attr_${attr.name}`] = ''"></v-select>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </template>
                <template v-else>
                    <v-alert type="info" variant="tonal" class="mt-4">
                        No attributes defined yet. Add attributes first to create variants.
                    </v-alert>
                </template>
            </v-card-text>

            <v-card-actions class="justify-end px-4 pb-4">
                <v-btn variant="text" @click="isOpen = false">Cancel</v-btn>
                <v-btn color="primary" variant="flat" @click="handleSubmit" :disabled="!isFormValid">
                    {{ props.variant ? 'Update Variant' : 'Add Variant' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'


const props = defineProps()
const emit = defineEmits(['update:open', 'save'])

const isOpen = computed({
    get: () => props.open,
    set: (val) => emit('update:open', val),
})

const initialFormData = {
    variantId: '',
    productId: 'product-123',
    name: '',
    sku: '',
    price: 0,
    quantity: 0,
    attributes: {},
}

const formData = reactive({ ...initialFormData })
const errors = reactive({})

watch(
    () => props.open,
    (newVal) => {
        if (newVal) {
            Object.assign(formData, props.variant ? { ...props.variant } : { ...initialFormData })
            // Initialize attributes based on current variant or clear them if adding new
            if (!props.variant) {
                formData.attributes = {}
            } else {
                // Ensure all existing attributes are present in formData.attributes
                // And fill with variant's existing values if available, or empty string
                const newAttributes = {}
                props.attributes.forEach(attr => {
                    newAttributes[attr.name] = props.variant?.attributes[attr.name] || ''
                })
                formData.attributes = newAttributes
            }
            Object.keys(errors).forEach((key) => delete errors[key]) // Clear errors
        }
    },
    { immediate: true }
)

const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
        newErrors.name = 'Name is required'
    }
    if (!formData.sku.trim()) {
        newErrors.sku = 'SKU is required'
    }
    if (formData.price < 0) {
        newErrors.price = 'Price cannot be negative'
    }
    if (formData.quantity < 0) {
        newErrors.quantity = 'Quantity cannot be negative'
    }

    props.attributes.forEach((attr) => {
        if (!formData.attributes[attr.name]) {
            newErrors[`attr_${attr.name}`] = `${attr.name} is required`
        }
    })

    Object.assign(errors, newErrors)
    return Object.keys(newErrors).length === 0
}

const isFormValid = computed(() => {
    // Basic validation check to enable/disable save button
    const hasRequiredFields = formData.name.trim() !== '' && formData.sku.trim() !== '' && formData.price >= 0 && formData.quantity >= 0;
    const allAttributesSelected = props.attributes.every(attr => formData.attributes[attr.name]);
    return hasRequiredFields && allAttributesSelected;
});


const handleSubmit = () => {
    if (validateForm()) {
        emit('save', formData)
        isOpen.value = false
    }
}
</script>

<style scoped>
.text-muted-foreground {
    color: #64748b;
    /* Tailwind gray-500 or similar */
}

.text-destructive {
    color: #ef4444;
    /* Tailwind red-500 or similar */
}

.font-weight-medium {
    font-weight: 500;
}
</style>