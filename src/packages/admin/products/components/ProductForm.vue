<template>
    <v-form ref="form" @submit.prevent="saveProduct">
        <v-stepper v-model="currentStep" class="product-form-stepper" style="padding-inline: 0 !important;">
            <!-- Stepper Header -->
            <v-stepper-header>
                <v-stepper-item v-for="step in steps" :key="step.value" :value="step.value" :title="step.title"
                    :subtitle="step.subtitle">
                    <template v-slot:icon>
                        <v-icon :icon="step.icon" />
                    </template>
                </v-stepper-item>
            </v-stepper-header>

            <!-- Stepper Content -->
            <v-stepper-window>
                <!-- Basic Info Step -->
                <v-stepper-window-item :value="1">
                    <div class="step-content">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Product Name" :rules="rules.name" variant="outlined"
                                    density="comfortable" class="mb-4 rounded-xlg"
                                    @change="(value) => onProductChange('name', value.target.value)" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea label="Product Description" :rules="rules.description" variant="outlined"
                                    density="comfortable" class="mb-4" rows="4"
                                    @change="(value) => onProductChange('description', value.target.value)" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea label="Recipe Tips" variant="outlined" density="comfortable" class="mb-4"
                                    rows="4" @change="(value) => onProductChange('recipeTips', value.target.value)" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Base Price" type="number" :rules="rules.price" variant="outlined"
                                    density="comfortable" class="mb-4" prefix="$"
                                    @change="(value) => onProductChange('price', value.target.value, 'number')" />
                            </v-col>
                            <v-col cols="12">
                                <v-switch label="Has Variants?" color="primary" hide-details
                                    @change="(value) => onProductChange('hasVariants', value.target.value, 'boolean')" />
                            </v-col>
                        </v-row>
                    </div>
                </v-stepper-window-item>

                <!-- Categories Step -->
                <v-stepper-window-item :value="2">
                    <div class="step-content">
                        <v-row>
                            <v-col cols="12">
                                <v-autocomplete v-model="product.categories" :items="categories" item-title="name"
                                    item-value="cid" label="Categories" :rules="rules.categories" variant="outlined"
                                    density="comfortable" class="mb-4" multiple chips closable-chips>
                                    <template v-slot:chip="{ props, item }">
                                        <v-chip v-bind="props" :color="item.raw.color || 'primary'" variant="tonal">
                                            <v-icon start :icon="item.raw.icon || 'mdi-folder'" />
                                            {{ item.raw.name }}
                                        </v-chip>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12">
                                <v-btn color="secondary" variant="tonal" prepend-icon="mdi-folder-plus"
                                    @click="openCategoryDialog">
                                    Add New Category
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-stepper-window-item>

                <!-- Variants Step -->
                <v-stepper-window-item :value="3">
                    <div class="step-content">
                        <!-- <v-row>
                            <v-col cols="12">
                                <div class="mb-4"
                                    style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                                    <div class="text-subtitle-1 font-weight-medium">Product Variants</div>
                                    <v-btn color="primary" variant="tonal" prepend-icon="mdi-plus"
                                        @click="openAttributeDialog">
                                        Manage Attributes
                                    </v-btn>
                                </div> -->

                        <!-- Variants List -->
                        <!-- <v-expansion-panels>
                                    <v-expansion-panel v-for="(variant, index) in product.variants"
                                        :key="variant.variantId" class="mb-2">
                                        <v-expansion-panel-title>
                                            <div class="d-flex align-center">
                                                <span class="mr-2">Variant {{ index + 1 }}</span>
                                                <v-chip size="small" color="primary" variant="tonal" class="ml-2">
                                                    SKU: {{ variant.sku }}
                                                </v-chip>
                                            </div>
                                        </v-expansion-panel-title>
                                        <v-expansion-panel-text>
                                            <v-row>
                                                <v-col cols="12" md="6">
                                                    <v-text-field v-model.number="variant.price" label="Variant Price"
                                                        type="number" variant="outlined" density="comfortable"
                                                        class="mb-4" prefix="$" />
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field v-model.number="variant.quantity" label="Stock"
                                                        type="number" variant="outlined" density="comfortable"
                                                        class="mb-4" />
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field v-model="variant.sku" label="SKU" variant="outlined"
                                                        density="comfortable" class="mb-4" />
                                                </v-col>
                                                <v-col cols="12">
                                                    <div class="d-flex gap-2 flex-wrap">
                                                        <v-chip v-for="(value, attr) in variant.attributes" :key="attr"
                                                            closable @click:close="removeVariantAttribute(index, attr)">
                                                            {{ attr }}: {{ value }}
                                                        </v-chip>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels> -->

                        <!-- Generate Variants Button -->
                        <!-- <v-btn v-if="hasAttributes" color="primary" variant="tonal" prepend-icon="mdi-plus"
                                    class="mt-4" @click="generateVariants">
                                    Generate Variants
                                </v-btn>
                            </v-col>
                        </v-row> -->
                        <v-container fluid class="pa-0">
                            <MobileVariantManager v-if="$vuetify.display.mobile" />
                            <ProductVariantManager v-else />
                        </v-container>
                    </div>
                </v-stepper-window-item>

                <!-- Discounts Step -->
                <v-stepper-window-item :value="4">
                    <div class="step-content">
                        <v-row>
                            <v-col cols="12">
                                <v-autocomplete v-model="product.discounts" :items="discounts" item-title="title"
                                    item-value="discountId" label="Discounts" :rules="rules.discounts"
                                    variant="outlined" density="comfortable" class="mb-4" multiple chips closable-chips>
                                    <template v-slot:chip="{ props, item }">
                                        <v-chip v-bind="props" :color="item.raw.color || 'primary'" variant="tonal">
                                            <v-icon start :icon="'mdi-percent'" />
                                            {{ item.raw.title }}
                                        </v-chip>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12">
                                <v-btn color="secondary" variant="tonal" @click="openDiscountDialog" class="rouded-lg">
                                    <template #prepend>
                                        <BadgePercent :size="16" />
                                    </template>
                                    <span class="capitalize">add new discount</span>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-stepper-window-item>

                <!-- Media Step -->
                <v-stepper-window-item :value="5">
                    <div class="step-content">
                        <v-row>
                            <v-col cols="12">
                                <v-file-input v-model="product.images" label="Product Images" :rules="rules.images"
                                    variant="outlined" density="comfortable" class="mb-4" accept="image/*" multiple
                                    chips counter show-size @change="handleImageUpload" @click:clear="clearImages" />
                            </v-col>
                            <v-col cols="12">
                                <div class="image-preview-grid">
                                    <div v-for="(image, index) in imagePreviews" :key="index"
                                        class="image-preview-item">
                                        <v-img :src="image.preview" aspect-ratio="1" cover class="rounded-lg">
                                            <template v-slot:placeholder>
                                                <v-row class="fill-height ma-0" align="center" justify="center">
                                                    <v-progress-circular indeterminate color="primary" />
                                                </v-row>
                                            </template>
                                            <div class="image-actions">
                                                <v-btn icon="mdi-delete" color="white" variant="tonal" size="small"
                                                    @click="removeImage(index)" />
                                            </div>
                                        </v-img>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </v-stepper-window-item>
            </v-stepper-window>

            <!-- Stepper Actions -->
            <div class="stepper-actions flex mt-8 pa-4">
                <v-btn v-if="currentStep > 1" variant="tonal" class="mr-2 rounded-lg" @click="currentStep--">
                    <v-icon start>mdi-chevron-left</v-icon>
                    Prev
                </v-btn>
                <v-spacer />
                <v-btn v-if="currentStep < steps.length" class="primary-gradient-button rounded-lg"
                    @click="currentStep++">
                    Next
                    <v-icon end>mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn v-else color="primary" :loading="saving" @click="saveProduct">
                    <v-icon start>mdi-content-save</v-icon>
                    Save Product
                </v-btn>
            </div>
        </v-stepper>

        <!-- Dialogs -->
        <v-dialog v-model="categoryDialog" max-width="600px">
            <v-card class="rounded-xl py-6">
                <v-card-title class="text-h5 font-weight-bold">
                    Add New Category
                </v-card-title>
                <v-card-text>
                    <add-category-form ref="categoryForm" @save="saveCategory" @cancel="closeCategoryDialog" />
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="attributeDialog" max-width="800px">
            <v-card class="rounded-xl py-6">
                <v-card-title class="text-h5 font-weight-bold">
                    Manage Attributes
                </v-card-title>
                <v-card-text>
                    <AttributeManager ref="attributeManager" @close="closeAttributeDialog" @update="updateAttributes" />
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="discountDialog" max-width="600px">
            <v-card class="rounded-xl py-6">
                <v-card-title class="text-h5 font-weight-bold">
                    Add Discount
                </v-card-title>
                <v-card-text>
                    <DiscountForm />
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSetupStore } from '@/store';
import { storeToRefs } from 'pinia';
import { globalEventBus, useToast } from 'vue-toastification';
import AddCategoryForm from './AddCategoryForm.vue';
import DiscountForm from '../../discounts/components/DiscountForm.vue';
import AttributeManager from './AttributeManager.vue';
import MobileVariantManager from './MobileVariantManager.vue';
import ProductVariantManager from './ProductVariantManager.vue';
import { useDisplay } from 'vuetify';
import { BadgePercent } from 'lucide-vue-next';
import { useDiscount } from '@/composables/useDiscount';
import useProduct from '@/composables/useProduct';

const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['submit', 'cancel']);

// Composables
const { discounts } = useDiscount();
const { onProductChange } = useProduct();

const setupStore = useSetupStore();
const { categories } = storeToRefs(setupStore);
const { mobile } = useDisplay();


const form = ref(null);
const categoryForm = ref(null);
const attributeManager = ref(null);
const discountForm = ref(null);
const saving = ref(false);
const currentStep = ref(1);
const categoryDialog = ref(false);
const attributeDialog = ref(false);
const discountDialog = ref(false);
const product = ref({
    name: '',
    description: '',
    recipeTips: '',
    price: 0,
    hasVariants: false,
    categories: [],
    variants: [],
    discounts: [],
})

const steps = [
    {
        title: 'Basic Info',
        subtitle: 'Product details',
        icon: 'mdi-information',
        value: 1
    },
    {
        title: 'Categories',
        subtitle: 'Product categories',
        icon: 'mdi-folder',
        value: 2
    },
    {
        title: 'Variants',
        subtitle: 'Product variants',
        icon: 'mdi-package-variant',
        value: 3
    },
    {
        title: 'Discounts',
        subtitle: 'Product discounts',
        icon: 'mdi-tag',
        value: 4
    },
    {
        title: 'Media',
        subtitle: 'Product images',
        icon: 'mdi-image',
        value: 5
    }
];

const newDiscount = ref({
    percentage: 0,
    validUntil: null
});

const imagePreviews = ref([]);

const rules = {
    name: [
        v => !!v || 'Name is required',
        v => v.length <= 100 || 'Name must be less than 100 characters'
    ],
    description: [
        v => !!v || 'Description is required',
        v => v.length <= 2000 || 'Description must be less than 2000 characters'
    ],
    price: [
        v => !v || v >= 0 || 'Price must be positive'
    ],
    categories: [
        v => v.length > 0 || 'At least one category is required'
    ],
    images: [
        v => v.length <= 10 || 'Maximum 10 images allowed'
    ]
};

const hasAttributes = computed(() => {
    return product.value.variants.some(v => Object.keys(v.attributes || {}).length > 0);
});

// Image handling
function handleImageUpload(files) {
    if (!files) return;
    const newFiles = Array.from(files);
    newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            imagePreviews.value.push({
                file,
                preview: e.target.result
            });
        };
        reader.readAsDataURL(file);
    });
}

function clearImages() {
    product.value.images = [];
    imagePreviews.value = [];
}

function removeImage(index) {
    imagePreviews.value.splice(index, 1);
    product.value.images.splice(index, 1);
}

// Category handling
function openCategoryDialog() {
    categoryDialog.value = true;
}

function closeCategoryDialog() {
    categoryDialog.value = false;
}

async function saveCategory(categoryData) {
    try {
        await setupStore.createCategory(categoryData);
        useToast().success('Category created successfully');
        closeCategoryDialog();
        setupStore.getCategories();
    } catch (error) {
        console.error('Error creating category:', error);
        useToast().error('Failed to create category');
    }
}

// Attribute handling
function openAttributeDialog() {
    attributeDialog.value = true;
}

function closeAttributeDialog() {
    attributeDialog.value = false;
}

function updateAttributes(attributes) {
    product.value.attributes = attributes;
}

function removeVariantAttribute(variantIndex, attribute) {
    const variant = product.value.variants[variantIndex];
    if (variant.attributes) {
        delete variant.attributes[attribute];
    }
}

// Discount handling
function openDiscountDialog() {
    discountDialog.value = true;
}

function closeDiscountDialog() {
    discountDialog.value = false;
}

async function saveDiscount() {
    try {
        const { valid } = await discountForm.value.validate();
        if (!valid) {
            useToast().error('Please fill in all required fields');
            return;
        }

        const discountId = `disc_${Date.now()}`;
        product.value.discounts.push({
            id: discountId,
            percentage: newDiscount.value.percentage,
            validUntil: newDiscount.value.validUntil
        });

        useToast().success('Discount added successfully');
        closeDiscountDialog();
    } catch (error) {
        console.error('Error saving discount:', error);
        useToast().error('Failed to save discount');
    }
}

// Variant generation
function generateVariants() {
    const attributes = product.value.attributes || {};
    const attributeNames = Object.keys(attributes);
    const attributeValues = Object.values(attributes);

    if (attributeNames.length === 0) return;

    const combinations = cartesianProduct(attributeValues);
    product.value.variants = combinations.map(combo => {
        const attributes = {};
        attributeNames.forEach((name, index) => {
            attributes[name] = combo[index];
        });

        return {
            variantId: `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            price: product.value.price,
            quantity: 0,
            sku: '',
            attributes
        };
    });
}

function cartesianProduct(arrays) {
    return arrays.reduce((a, b) =>
        a.map(x => b.map(y => x.concat([y])))
            .reduce((a, b) => a.concat(b), []),
        [[]]
    );
}
function addVariant(variant) {
    product.value.variants.push({ ...variant });
}

// Save product
async function saveProduct() {
    try {
        const { valid } = await form.value.validate();
        if (!valid) {
            useToast().error('Please fill in all required fields');
            return;
        }

        const productData = { ...product.value };
        const formData = {
            name: productData.name,
            description: productData.description,
            recipeTips: productData.recipeTips || undefined,
            price: productData.price || undefined,
            categories: productData.categories,
            variants: productData.variants.map(variant => ({
                price: variant.price,
                quantity: variant.quantity,
                sku: variant.sku,
                attributes: variant.attributes
            })),
            discounts: productData.discounts.map(discount => ({
                percentage: discount.percentage,
                validUntil: discount.validUntil
            }))
        };

        // Emit the form data and images separately
        emit('submit', {
            productData: formData,
            images: imagePreviews.value.map(img => ({
                file: img.file,
                preview: img.preview
            }))
        });
    } catch (error) {
        console.error('Error validating form:', error);
        useToast().error('Please check the form for errors');
    }
}

onMounted(() => {
    if (props.initialData.images) {
        imagePreviews.value = props.initialData.images.map(url => ({
            preview: url,
            file: null
        }));
    }
    globalEventBus.on('setVariants', (value) => {
        product.value = [
            ...product.value,
            ...value
        ]
    });
    globalEventBus.on('closeDiscountForm', () => {
        console.log('close discount event emitted:');
        discountDialog.value = false;
    });

    globalEventBus.on('UpdatingVariant', (variant) => {
        console.log('EMITTED EVENT:UpdatingVariant')
        addVariant(variant)
    });
});
</script>

<style scoped>
.product-form-stepper {
    border-radius: 16px;
    overflow: hidden;
}

.step-content {
    padding: 8px;
    background: rgba(123, 97, 255, 0.04);
    border-radius: 12px;
    margin: 16px 0;
}

.stepper-actions {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    background: white;
}

.image-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
    margin-top: 16px;
}

.image-preview-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
}

.image-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.image-preview-item:hover .image-actions {
    opacity: 1;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .step-content {
        background: rgba(255, 255, 255, 0.04);
    }
}

/* Accessibility */
:deep(.v-stepper) {
    outline: none;
}

:deep(.v-stepper:focus-visible) {
    outline: 2px solid #7b61ff;
    outline-offset: 2px;
}

/* High contrast mode */
@media (forced-colors: active) {
    .product-form-stepper {
        border: 2px solid CanvasText;
    }

    .step-content {
        border: 1px solid CanvasText;
    }
}

.upload-status-card {
    background: rgba(123, 97, 255, 0.04);
    border: 1px solid rgba(123, 97, 255, 0.08);
    border-radius: 12px;
}

/* Dark mode support for upload status */
@media (prefers-color-scheme: dark) {
    .upload-status-card {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.08);
    }
}
</style>