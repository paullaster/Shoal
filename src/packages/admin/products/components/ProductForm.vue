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
                        </v-row>
                    </div>
                </v-stepper-window-item>

                <!-- Categories Step -->
                <v-stepper-window-item :value="2">
                    <div class="step-content">
                        <v-row>
                            <v-col cols="12">
                                <v-autocomplete v-model="selectedCategories" :items="categories" item-title="name"
                                    item-value="cid" label="Categories" :rules="rules.categories" variant="solo"
                                    density="comfortable"
                                    class="tw-bg-white/70 tw-backdrop-blur-md tw-border tw-border-gray-200 tw-shadow-lg tw-rounded-2xl tw-px-4 tw-py-2 tw-transition-all tw-duration-300 tw-outline-none focus:tw-ring-2 focus:tw-ring-primary-500 modern-classic-autocomplete mb-4"
                                    multiple chips closable-chips hide-details="auto"
                                    :menu-props="{ contentClass: 'tw-rounded-xl tw-shadow-xl tw-bg-white/90 tw-backdrop-blur' }"
                                    @update:modelValue="onChangeCategories" return-object>
                                    <template v-slot:label>
                                        <span
                                            class="tw-text-base tw-font-semibold tw-text-gray-700 tw-ml-1">Categories</span>
                                    </template>
                                    <template v-slot:chip="{ props, item }">
                                        <v-chip v-bind="props" :color="item.raw.color || 'primary'" variant="elevated"
                                            class="tw-bg-gradient-to-r tw-from-primary-100 tw-to-primary-50 tw-text-primary-700 tw-shadow-md tw-rounded-full tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-flex tw-items-center tw-gap-1"
                                            style="border: none; min-height: 2rem;">
                                            <v-icon start :icon="item.raw.icon || 'mdi-folder'" size="18"
                                                class="tw-mr-1" />
                                            {{ item.raw.name }}
                                        </v-chip>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12">
                                <v-btn color="secondary" variant="flat" prepend-icon="mdi-folder-plus"
                                    class="modern-classic-btn rounded-pill px-6 py-2 elevation-1"
                                    style="font-weight: 600; font-size: 1rem; letter-spacing: 0.2px; box-shadow: 0 2px 8px rgba(123,97,255,0.08);"
                                    @click="openCategoryDialog">
                                    <span style="text-transform: capitalize;">Add New Category</span>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-stepper-window-item>

                <!-- Variants Step -->
                <v-stepper-window-item :value="3">
                    <div class="step-content">
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
                                <v-card class="modern-classic-card pa-6 mb-6 rounded-xl elevation-2"
                                    style="border: 1px solid var(--v-border-color, #ececec); background: var(--v-surface, #fff);">
                                    <div class="d-flex align-center mb-4">
                                        <v-icon color="primary" size="28" class="mr-3">mdi-percent</v-icon>
                                        <div>
                                            <div class="text-h6 font-weight-bold" style="letter-spacing: 0.5px;">
                                                Discounts</div>
                                            <div class="text-body-2 text-grey-darken-1" style="font-style: italic;">
                                                Select or add
                                                discounts for this product
                                            </div>
                                        </div>
                                    </div>
                                    <v-autocomplete v-model="selectedDiscounts" :items="discounts" item-title="title"
                                        item-value="discountId" label="Select Discounts" :rules="rules.discounts"
                                        variant="solo" density="comfortable"
                                        class="tw-bg-white/70 tw-backdrop-blur-md tw-border tw-border-gray-200 tw-shadow-lg tw-rounded-2xl tw-px-4 tw-py-2 tw-transition-all tw-duration-300 tw-outline-none focus:tw-ring-2 focus:tw-ring-primary-500 modern-classic-autocomplete mb-4"
                                        multiple chips closable-chips hide-details="auto"
                                        :menu-props="{ contentClass: 'tw-rounded-xl tw-shadow-xl tw-bg-white/90 tw-backdrop-blur' }"
                                        @update:modelValue="onChangeDiscount" return-object>
                                        <template v-slot:label>
                                            <span class=" tw-text-base tw-font-semibold tw-text-gray-700
                                        tw-ml-1">Discounts
                                            </span>
                                        </template>
                                        <template v-slot:chip="{ props, item }">
                                            <v-chip v-bind="props" :color="item.raw.color || 'primary'"
                                                variant="elevated"
                                                class="tw-bg-gradient-to-r tw-from-primary-100 tw-to-primary-50 tw-text-primary-700 tw-shadow-md tw-rounded-full tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-flex tw-items-center tw-gap-1"
                                                style="border: none; min-height: 2rem;">
                                                <v-icon start :icon="'mdi-percent'" size="18" class="tw-mr-1" />
                                                {{ item.raw.title }}
                                            </v-chip>
                                        </template>
                                    </v-autocomplete>
                                    <div class="d-flex justify-end mt-2">
                                        <v-btn color="secondary" variant="flat"
                                            class="modern-classic-btn rounded-pill px-6 py-2 elevation-1"
                                            style="font-weight: 600; font-size: 1rem; letter-spacing: 0.2px; box-shadow: 0 2px 8px rgba(123,97,255,0.08);"
                                            @click="openDiscountDialog">
                                            <template #prepend>
                                                <BadgePercent :size="18" class="mr-2" />
                                            </template>
                                            <span style="text-transform: capitalize;">Add New Discount</span>
                                        </v-btn>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </v-stepper-window-item>

                <!-- Media Step -->
                <v-stepper-window-item :value="5">
                    <div class="step-content">
                        <v-row>
                            <v-col cols="12" style="padding-inline: 0 !important;">
                                <v-card class="py-6 modern-upload-card elevation-2 mb-4 rounded-xl">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" class="mr-2">mdi-image-multiple</v-icon>
                                        <div>
                                            <div class="font-weight-bold text-h6">Product Images</div>
                                            <div class="text-body-2 text-grey-darken-1">Upload up to 10 images. Drag &
                                                drop or click
                                                to select.</div>
                                        </div>
                                    </div>
                                    <div class="modern-upload-dropzone mb-3" @drop.prevent="handleDrop"
                                        @dragover.prevent @click="fileInputRef.click()">
                                        <v-file-input ref="fileInputRef" v-model="images" :rules="rules.images"
                                            variant="outlined" density="comfortable" class="modern-upload-input"
                                            accept="image/*" multiple chips counter show-size
                                            @change="handleImageUpload" @click:clear="clearImages"
                                            prepend-icon="mdi-upload" hide-details="auto">
                                            <template #selection="{ text }">
                                                <span class="text-primary">{{ text }}</span>
                                            </template>
                                        </v-file-input>
                                        <div class="modern-upload-dropzone-text">
                                            <v-icon color="primary" size="32">mdi-cloud-upload</v-icon>
                                            <div class="mt-2">Click or drag images here to upload</div>
                                        </div>
                                    </div>
                                    <div v-if="imagePreviews.length" class="modern-image-preview-grid mt-4">
                                        <div v-for="(image, index) in imagePreviews" :key="index"
                                            class="modern-image-preview-item">
                                            <v-img :src="image.preview" aspect-ratio="1" cover class="rounded-lg">
                                                <template v-slot:placeholder>
                                                    <v-row class="fill-height ma-0" align="center" justify="center">
                                                        <v-progress-circular indeterminate color="primary" />
                                                    </v-row>
                                                </template>
                                                <div class="modern-image-actions">
                                                    <v-btn icon="mdi-delete" color="white" variant="tonal" size="small"
                                                        @click="removeImage(index)" />
                                                </div>
                                            </v-img>
                                        </div>
                                    </div>
                                </v-card>
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
                <v-btn v-else class="primary-gradient-button rounded-lg" :loading="saving" @click="saveProduct">
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
                    <DiscountForm @closeQuickDiscountDialog="closeDiscountDialog" />
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-form>
</template>

<script setup>
import { ref, onMounted, useTemplateRef, toRaw } from 'vue';
import { useSetupStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import AddCategoryForm from './AddCategoryForm.vue';
import DiscountForm from '../../discounts/components/DiscountForm.vue';
import AttributeManager from './AttributeManager.vue';
import MobileVariantManager from './MobileVariantManager.vue';
import ProductVariantManager from './ProductVariantManager.vue';
import { BadgePercent } from 'lucide-vue-next';
import { useDiscount } from '@/composables/useDiscount';
import useProduct from '@/composables/useProduct';
import Helper from '@/util/Helper';

const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['submit', 'cancel']);

// Composables
const { discounts, fetchDiscounts } = useDiscount();
const { onProductChange, getProduct, setProduct } = useProduct();

const setupStore = useSetupStore();
const { categories } = storeToRefs(setupStore);


const form = useTemplateRef('form');
const fileInputRef = useTemplateRef('fileInputRef');
const categoryForm = ref(null);
const attributeManager = ref(null);
const saving = ref(false);
const currentStep = ref(1);
const categoryDialog = ref(false);
const attributeDialog = ref(false);
const discountDialog = ref(false);
const selectedCategories = ref([]);
const selectedDiscounts = ref([]);
const images = ref([]);

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

// Image handling
function handleImageUpload(e) {
    const files = e.target.files
    if (!files) return;
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = e => {
            imagePreviews.value.push({
                file,
                preview: e.target.result
            });
        };
        reader.readAsDataURL(file);
    }
    const product = { ...getProduct.value };
    product.images = imagePreviews.value;
    setProduct(product);
}

function handleDrop(e) {
    const files = e.dataTransfer.files;
    if (!files) return;
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = ev => {
            imagePreviews.value.push({
                file,
                preview: ev.target.result
            });
        };
        reader.readAsDataURL(file);
        images.value.push(file);
        const product = { ...getProduct.value };
        product.images = imagePreviews.value;
        setProduct(product);
    }
}

function clearImages() {
    images.value = [];
    imagePreviews.value = [];
}

function removeImage(index) {
    imagePreviews.value.splice(index, 1);
    images.value.splice(index, 1);
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

function onChangeCategories(categories) {
    const product = { ...getProduct.value };
    const newCategories = [...categories.map((cat) => toRaw(cat))];
    product.categories = newCategories;
    setProduct(product);
}

function onChangeDiscount(discounts) {
    const product = { ...getProduct.value };
    const newCategories = [...discounts.map((disc) => toRaw(disc))];
    product.discounts = newCategories;
    setProduct(product);
}

// Discount handling
function openDiscountDialog() {
    discountDialog.value = true;
}

function closeDiscountDialog() {
    discountDialog.value = false;
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
        const product = { ...getProduct.value };
        const { variants, categories, discounts, images, ...rest } = product;
        const stripeNullsFromBaseProduct = Helper.removeNullsFromObject(rest);
        const stripeNullFromVariant = variants.map((variant) => {
            variant.attributes = variant.attributes.map((attr) => ({ value: attr.valueId }));
            return Helper.removeNullsFromObject(variant);
        });
        const usableDiscounts = discounts.map((discount) => {
            return {
                discount: discount.discountId,
            }
        });
        const usableCategories = categories.map((cat) => {
            return {
                category: cat.categoryId,
            }
        });
        const isBaseProductValid = Helper.validateRequiredProperties(
            stripeNullsFromBaseProduct,
            ['description', 'price', 'name']
        );
        if (!isBaseProductValid.valid) {
            useToast().error(`Please fill in all required fields. ${isBaseProductValid.missing.join(",")} are missing.`);
            return;
        }
        const requiredVariantFields = ['price', 'quantity', 'sku', 'attributes'];
        const invalidVariants = stripeNullFromVariant.filter(
            variant => !Helper.validateRequiredProperties(variant, requiredVariantFields).valid
        );
        const isVariantsValid = invalidVariants.length === 0;
        if (!isVariantsValid) {
            useToast().error(`Invalid variant(s)`);
            return;
        }

        const requiredCategoryFields = ['category'];
        const isCategoriesValid =
            Array.isArray(usableCategories) &&
            usableCategories.length > 0 &&
            usableCategories.every(cat =>
                Helper.validateRequiredProperties(cat, requiredCategoryFields).valid
            );

        if (!isCategoriesValid) {
            useToast().error('Product must belong to at least one valid category.');
            return;
        }
        const requiredDiscountFields = ['discount'];
        const hasValidDiscounts =
            Array.isArray(usableDiscounts) &&
            usableDiscounts.length > 0 &&
            usableDiscounts.every(disc =>
                Helper.validateRequiredProperties(disc, requiredDiscountFields).valid
            );

        const formData = {
            name: stripeNullsFromBaseProduct.name,
            description: stripeNullsFromBaseProduct.description,
            recipeTips: stripeNullsFromBaseProduct.recipeTips || undefined,
            price: stripeNullsFromBaseProduct.price,
            categories: usableCategories,
            variants: stripeNullFromVariant,
            ...(hasValidDiscounts && {
                discounts: usableDiscounts
            })
        };

        emit('submit', {
            productData: formData,
            images,
        });
    } catch (error) {
        console.error('Error validating form:', error);
        useToast().error('Please check the form for errors');
    }
}

onMounted(async () => {
    await fetchDiscounts();
    if (props.initialData.images) {
        imagePreviews.value = props.initialData.images.map(url => ({
            preview: url,
            file: null
        }));
    }
});

// Effects

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

.modern-upload-card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
}

.modern-upload-dropzone {
    border: 2px dashed rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    padding: 16px;
    transition: border-color 0.2s ease;
}

.modern-upload-dropzone:hover {
    border-color: rgba(255, 255, 255, 0.7);
}

.modern-upload-input {
    display: none;
}

.modern-image-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
}

.modern-image-preview-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
}

.modern-image-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.modern-image-preview-item:hover .modern-image-actions {
    opacity: 1;
}

/* Modern Classic Card Styles */
.modern-classic-card {
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modern-classic-card .v-card-title {
    border-bottom: 1px solid #ececec;
    padding-bottom: 12px;
    margin-bottom: 16px;
}

.modern-classic-card .v-card-title .text-h5 {
    font-size: 1.25rem;
    font-weight: 500;
    color: #333;
}

.modern-classic-card .v-card-title .text-h6 {
    font-size: 1rem;
    font-weight: 400;
    color: #666;
}

.modern-classic-card .v-autocomplete {
    margin-bottom: 16px;
}

.modern-classic-card .v-btn {
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 0.2px;
    padding: 10px 24px;
    border-radius: 24px;
}

.modern-classic-card .v-btn:hover {
    box-shadow: 0 4px 12px rgba(123, 97, 255, 0.2);
}

.modern-classic-chip {
    border-radius: 999px;
    background: rgba(123, 97, 255, 0.08);
    color: #3d2c8d;
    letter-spacing: 0.2px;
}

.modern-classic-autocomplete .v-input__control {
    border: 1px solid #dcdcdc;
    border-radius: 8px;
}

.modern-classic-autocomplete .v-input__control:hover {
    border-color: #7b61ff;
}

.modern-classic-autocomplete .v-input__slot {
    padding: 8px 12px;
}

.modern-classic-autocomplete .v-select__selections {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.modern-classic-autocomplete .v-select__selection {
    background: #f5f5f5;
    border: 1px solid #dcdcdc;
    border-radius: 16px;
    padding: 6px 12px;
    font-size: 0.875rem;
    color: #333;
}

.modern-classic-autocomplete .v-select__selection--disabled {
    background: #e9ecef;
    color: #aaa;
}

.modern-classic-autocomplete .v-select__selection--error {
    border-color: #f44336;
}

.modern-classic-autocomplete .v-select__selection--error .v-icon {
    color: #f44336;
}

.modern-classic-autocomplete .v-select__selection--success {
    border-color: #4caf50;
}

.modern-classic-autocomplete .v-select__selection--success .v-icon {
    color: #4caf50;
}
</style>