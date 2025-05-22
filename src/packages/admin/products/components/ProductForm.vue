<template>
    <v-form ref="form" @submit.prevent="saveProduct">
        <v-stepper v-model="currentStep" class="product-form-stepper">
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
                                <v-text-field v-model="product.name" label="Product Name" :rules="rules.name"
                                    variant="outlined" density="comfortable" class="mb-4" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="product.description" label="Product Description"
                                    :rules="rules.description" variant="outlined" density="comfortable" class="mb-4"
                                    rows="4" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="product.price" label="Price" type="number"
                                    :rules="rules.price" variant="outlined" density="comfortable" class="mb-4"
                                    prefix="$" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="product.stock" label="Initial Stock" type="number"
                                    :rules="rules.stock" variant="outlined" density="comfortable" class="mb-4" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="product.sku" label="SKU" :rules="rules.sku" variant="outlined"
                                    density="comfortable" class="mb-4" />
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
                        <v-row>
                            <v-col cols="12">
                                <div class="d-flex align-center justify-space-between mb-4">
                                    <div class="text-subtitle-1 font-weight-medium">Product Variants</div>
                                    <v-btn color="primary" variant="tonal" prepend-icon="mdi-plus"
                                        @click="openAttributeDialog">
                                        Manage Attributes
                                    </v-btn>
                                </div>
                                <v-expansion-panels>
                                    <v-expansion-panel v-for="(variant, index) in product.variants" :key="index"
                                        class="mb-2">
                                        <v-expansion-panel-title>
                                            Variant {{ index + 1 }}
                                        </v-expansion-panel-title>
                                        <v-expansion-panel-text>
                                            <v-row>
                                                <v-col cols="12" md="6">
                                                    <v-text-field v-model.number="variant.price" label="Price"
                                                        type="number" variant="outlined" density="comfortable"
                                                        class="mb-4" prefix="$" />
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field v-model.number="variant.stock" label="Stock"
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
                                </v-expansion-panels>
                                <v-btn v-if="hasAttributes" color="primary" variant="tonal" prepend-icon="mdi-plus"
                                    class="mt-4" @click="generateVariants">
                                    Generate Variants
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-stepper-window-item>

                <!-- Media Step -->
                <v-stepper-window-item :value="4">
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
            <div class="stepper-actions pa-4">
                <v-btn v-if="currentStep > 1" variant="tonal" class="mr-2" @click="currentStep--">
                    <v-icon start>mdi-chevron-left</v-icon>
                    Previous
                </v-btn>
                <v-spacer />
                <v-btn v-if="currentStep < steps.length" color="primary" @click="currentStep++">
                    Next
                    <v-icon end>mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn v-else color="primary" :loading="saving" @click="saveProduct">
                    <v-icon start>mdi-content-save</v-icon>
                    Save Product
                </v-btn>
            </div>
        </v-stepper>

        <!-- Category Dialog -->
        <v-dialog v-model="categoryDialog" max-width="600px">
            <v-card class="rounded-xl pa-6">
                <v-card-title class="text-h5 font-weight-bold">
                    Add New Category
                </v-card-title>
                <v-card-text>
                    <add-category-form ref="categoryForm" @save="saveCategory" @cancel="closeCategoryDialog" />
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Attribute Dialog -->
        <v-dialog v-model="attributeDialog" max-width="800px">
            <v-card class="rounded-xl pa-6">
                <v-card-title class="text-h5 font-weight-bold">
                    Manage Attributes
                </v-card-title>
                <v-card-text>
                    <attribute-manager ref="attributeManager" @close="closeAttributeDialog"
                        @update="updateAttributes" />
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSetupStore, useProductStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import AddCategoryForm from './AddCategoryForm.vue';
// import AttributeManager from './AttributeManager.vue';

const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['save', 'cancel']);

const setupStore = useSetupStore();
const productStore = useProductStore();
const { categories } = storeToRefs(setupStore);

const form = ref(null);
const categoryForm = ref(null);
const attributeManager = ref(null);
const saving = ref(false);
const currentStep = ref(1);
const categoryDialog = ref(false);
const attributeDialog = ref(false);

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
        title: 'Media',
        subtitle: 'Product images',
        icon: 'mdi-image',
        value: 4
    }
];

const product = ref({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    categories: [],
    variants: [],
    images: [],
    ...props.initialData
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
        v => !!v || 'Price is required',
        v => v >= 0 || 'Price must be positive'
    ],
    stock: [
        v => !!v || 'Stock is required',
        v => v >= 0 || 'Stock must be positive',
        v => Number.isInteger(v) || 'Stock must be a whole number'
    ],
    sku: [
        v => !!v || 'SKU is required',
        v => /^[A-Z0-9-]+$/.test(v) || 'SKU must contain only uppercase letters, numbers, and hyphens'
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

function openAttributeDialog() {
    attributeDialog.value = true;
}

function closeAttributeDialog() {
    attributeDialog.value = false;
}

function updateAttributes(attributes) {
    // Update product attributes
    product.value.attributes = attributes;
}

function removeVariantAttribute(variantIndex, attribute) {
    const variant = product.value.variants[variantIndex];
    if (variant.attributes) {
        delete variant.attributes[attribute];
    }
}

function generateVariants() {
    // Implementation for generating variants based on attributes
    // This would create all possible combinations of attributes
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
            price: product.value.price,
            stock: 0,
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

async function saveProduct() {
    try {
        const { valid } = await form.value.validate();
        if (!valid) {
            useToast().error('Please fill in all required fields');
            return;
        }

        saving.value = true;
        const productData = { ...product.value };

        if (props.initialData.pid) {
            await productStore.updateProduct(productData);
            useToast().success('Product updated successfully');
        } else {
            await productStore.createProduct(productData);
            useToast().success('Product created successfully');
        }

        emit('save', productData);
    } catch (error) {
        console.error('Error saving product:', error);
        useToast().error('Failed to save product');
    } finally {
        saving.value = false;
    }
}

onMounted(() => {
    if (props.initialData.images) {
        imagePreviews.value = props.initialData.images.map(url => ({
            preview: url,
            file: null
        }));
    }
});
</script>

<style scoped>
.product-form-stepper {
    border-radius: 16px;
    overflow: hidden;
}

.step-content {
    padding: 24px;
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

    .stepper-actions {
        background: #1a1a1a;
        border-top-color: rgba(255, 255, 255, 0.12);
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
</style>