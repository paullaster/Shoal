<template>
  <v-container fluid class="product-management" style="padding-inline: 0 !important;">
    <!-- Floating Action Button for Quick Actions -->
    <v-speed-dial location="bottom right" transition="slide-y-reverse-transition" class="quick-actions-fab">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" fab size="large" class="primary-gradient-button" icon="mdi-plus">
          <v-icon size="large">mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-tooltip v-for="action in quickActions" :key="action.id" :text="action.text" location="left">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn fab size="small" v-bind="tooltipProps" :color="action.color" :icon="action.icon"
            @click="action.handler"></v-btn>
        </template>
      </v-tooltip>
    </v-speed-dial>
    <!-- Page Title Area -->
    <div class="py-4 d-flex align-center">
      <v-icon color="primary" size="36" class="mr-4">mdi-package-variant</v-icon>
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">
          Product Management
        </h1>
        <div class="text-caption text-medium-emphasis">
          {{ filteredProducts.length }} products • {{ categories.length }} categories
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <v-container fluid class="py-6 mt-0">
      <v-row style="padding-inline: 0 !important;">
        <!-- Category Sidebar -->
        <v-col cols="12" md="3" lg="2" style="padding-inline: 0 !important;">
          <v-card class="category-card rounded-lg" elevation="0">
            <v-card-title class="d-flex align-center justify-space-between py-3 px-4">
              <span class="text-subtitle-1 font-weight-medium">Categories</span>
              <v-btn icon="mdi-refresh" variant="text" size="small" color="primary" @click="refreshCategories" />
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-0">
              <v-list v-if="categories.length" class="category-list">
                <v-list-item v-for="category in categories" :key="category.cid" :value="category"
                  :active="selectedCategory === category.cid" @click="selectCategory(category.cid)"
                  class="category-list-item" rounded="lg">
                  <template v-slot:prepend>
                    <v-avatar :color="category.color || 'primary'" size="32" class="category-avatar">
                      <v-icon color="white" size="small">
                        {{ category.icon || 'mdi-folder' }}
                      </v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-body-2">
                    {{ category.name }}
                  </v-list-item-title>
                  <template v-slot:append>
                    <v-chip size="x-small" :color="category.color || 'primary'" variant="tonal" class="product-count">
                      {{ getProductCount(category.cid) }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
              <v-list v-else>
                <v-list-item>
                  <v-list-item-title class="text-center text-medium-emphasis">
                    No categories found
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Product Content -->
        <v-col cols="12" md="9" lg="10" style="padding-inline: 0 !important;">
          <v-card class="product-card rounded-lg" elevation="0">
            <!-- Product Card Header with Controls -->
            <div class=" py-3">
              <v-row align="center" dense>
                <!-- Title and Count -->
                <v-col cols="12" sm="6" md="4" lg="6" class="px-4 py-0">
                  <div class="text-subtitle-1 font-weight-medium">
                    {{ selectedCategory ? 'Products in ' + getCategoryName(selectedCategory) : 'All Products' }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Showing {{ filteredProducts.length }} of {{ totalProducts }} products
                  </div>
                </v-col>

                <!-- Controls (Search, Filter, View Toggle) -->
                <v-col cols="12" sm="6" md="8" lg="6" class="py-6">
                  <div class="d-flex align-center justify-end gap-2">
                    <div class="d-flex align-center justify-start">
                      <!-- Search Input/Icon -->
                      <v-text-field v-if="!$vuetify.display.xs" v-model="search" density="compact" variant="solo"
                        bg-color="grey-lighten-4" class="rounded-pill premium-search-input flex-grow-1" hide-details
                        placeholder="Search products..." prepend-inner-icon="mdi-magnify" clearable>
                        <template v-slot:append-inner>
                          <v-progress-circular v-if="loading" size="20" color="primary" indeterminate />
                        </template>
                      </v-text-field>
                      <v-btn v-else icon="mdi-magnify" variant="tonal" class="rounded-pill" size="small"
                        elevation="0"></v-btn>
                    </div>
                    <div class="">

                      <!-- Filter Button (Icon only below 999px, maybe icon + caption above? - following wireframe: Icon only) -->
                      <v-btn size="small" icon="mdi-filter-variant" @click="showFilters = true" elevation="0">
                      </v-btn>
                      <!-- <v-btn class="" size="small" @click="showFilters = true" icon="mdi-apps" elevation="0"> -->
                      <!-- :class="{ 'filter-active': hasActiveFilters }" -->
                      <!-- <v-badge v-if="activeFilterCount > 0" :content="activeFilterCount" color="error"
                          location="top end" offset-x="2" offset-y="2" /> -->
                      <!-- <v-icon size="large">mdi-filter-variant</v-icon> -->
                      <!-- </v-btn> -->
                      <!-- View Mode Toggle (Icon + Caption above 669px, Icon only below) -->
                      <v-btn size="small" :icon="viewMode === 'grid' ? 'mdi-apps' : 'mdi-format-list-bulleted'"
                        @click="toggleViewMode" elevation="0">
                      </v-btn>
                      <!-- <span>
                        <v-icon size="large" v-if="viewMode === 'grid'"
                          color="primary-gradient-button">mdi-apps</v-icon>
                        <v-icon size="large" v-else>mdi-format-list-bulleted</v-icon>
                      </span> -->
                    </div>
                  </div>
                </v-col>

                <!-- Bulk Actions -->
                <v-col cols="12" v-if="selectedProducts.length > 0" class="py-0 mt-2">
                  <div class="d-flex gap-2">
                    <v-btn v-for="action in bulkActions" :key="action.id" :color="action.color" variant="tonal"
                      class="rounded-pill" :prepend-icon="action.icon" @click="action.handler" size="small">
                      {{ action.text }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </div>

            <v-divider />

            <!-- Product Grid/List -->
            <product-grid v-if="viewMode === 'grid' && filteredProducts.length > 0" :products="filteredProducts"
              :loading="loading" :search="search" :sort-by="sortBy" :sort-order="sortOrder" :page="page"
              :items-per-page="pageSize" :total-items="totalProducts" v-model:selected="selectedProducts"
              @edit="editProduct" @delete="deleteProduct" @click="editProduct" />
            <product-list v-else-if="viewMode === 'list' && filteredProducts.length > 0" :products="filteredProducts"
              :loading="loading" :search="search" :sort-by="sortBy" :sort-order="sortOrder" :page="page"
              :items-per-page="pageSize" :total-items="totalProducts" v-model:selected="selectedProducts"
              @edit="editProduct" @delete="deleteProduct" />

            <!-- No products found message -->
            <div v-else class="pa-6 text-center text-medium-emphasis">
              No products found matching your criteria.
            </div>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- Dialogs -->
    <v-dialog v-model="createDialog" max-width="1200px" persistent class="rounded-xl">
      <v-card class="rounded-xl">
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <span class="text-h5 font-weight-bold">
            {{ editingProduct ? 'Edit Product' : 'Create New Product' }}
          </span>
          <v-btn icon="mdi-close" variant="text" @click="closeCreateDialog" />
        </v-card-title>
        <v-divider />
        <v-card-text class="py-4" style="padding-inline: 0 !important;">
          <add-product-form ref="productForm" :initial-data="editingProduct" @save="saveProduct"
            @cancel="closeCreateDialog" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="categoryDialog" max-width="600px" persistent>
      <v-card class="rounded-xl pa-6">
        <v-card-title class="text-h5 font-weight-bold">
          Create New Category
        </v-card-title>
        <v-card-text>
          <add-category-form @save="saveCategory" @cancel="closeCategoryDialog" ref="categoryForm" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="attributeDialog" max-width="800px" persistent>
      <v-card class="rounded-xl pa-6">
        <v-card-title class="text-h5 font-weight-bold">
          Manage Attributes
        </v-card-title>
        <v-card-text>
          <attribute-manager @close="closeAttributeDialog" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="discountDialog" max-width="800px" persistent>
      <v-card class="rounded-xl pa-6">
        <v-card-title class="text-h5 font-weight-bold">
          Apply Discounts
        </v-card-title>
        <v-card-text>
          <discount-manager :selected-products="selectedProducts" @close="closeDiscountDialog" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Filter Panel -->
    <v-navigation-drawer v-model="showFilters" location="right" temporary width="360" class="filter-panel"
      :class="{ 'filter-panel-mobile': isMobile }">
      <template v-slot:prepend>
        <div class="filter-panel-header pa-4">
          <div class="d-flex align-center justify-space-between">
            <div class="text-h6 font-weight-bold">Filter & Sort</div>
            <v-btn icon="mdi-close" variant="text" @click="showFilters = false" class="close-btn" />
          </div>
          <div class="text-subtitle-2 text-medium-emphasis mt-1">
            Refine your product list with advanced filters
          </div>
        </div>
      </template>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form @submit.prevent class="filter-form">
          <div class="filter-section mb-6">
            <div class="filter-section-header d-flex align-center mb-3">
              <v-icon color="primary" class="mr-2">mdi-sort</v-icon>
              <div class="text-subtitle-1 font-weight-medium">Sort Options</div>
            </div>
            <v-select v-model="sortBy" :items="sortOptions" variant="outlined" density="comfortable" hide-details
              class="premium-input mb-4" placeholder="Sort by..." />
          </div>

          <div class="filter-section mb-6">
            <div class="filter-section-header d-flex align-center mb-3">
              <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
              <div class="text-subtitle-1 font-weight-medium">Filter Options</div>
            </div>
            <v-select v-model="filterStatus" :items="statusOptions" variant="outlined" density="comfortable"
              hide-details class="premium-input" placeholder="Filter by status..." />
          </div>

          <v-divider class="my-6" />

          <div class="filter-actions">
            <v-btn block color="grey-darken-1" variant="tonal" class="mb-2" @click="resetFilters">
              <v-icon start>mdi-refresh</v-icon>
              Reset Filters
            </v-btn>
            <v-btn block color="primary" @click="applyFilters" :disabled="!hasActiveFilters" class="apply-filters-btn">
              <v-icon start>mdi-check</v-icon>
              Apply Filters
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-navigation-drawer>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card class="rounded-xl pa-6">
        <v-card-title class="text-h5 font-weight-bold">
          Confirm Delete
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete {{ confirmDialogData.type === 'product' ? 'the product' : `the selected
          products`
          }}
          <strong>{{ confirmDialogData.name }}</strong>?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="tonal" @click="() => {
            confirmDialog.value = false;
            confirmDialogData.value.resolve(false);
          }">
            Cancel
          </v-btn>
          <v-btn color="error" @click="() => {
            confirmDialog.value = false;
            confirmDialogData.value.resolve(true);
          }">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Stock Update Dialog -->
    <v-dialog v-model="stockDialog" max-width="400px">
      <v-card class="rounded-xl pa-6">
        <v-card-title class="text-h5 font-weight-bold">
          Update Stock
        </v-card-title>
        <v-card-text>
          <v-form ref="stockFormRef" @submit.prevent>
            <v-row>
              <v-col cols="12">
                <v-select v-model="stockForm.operation" :items="[
                  { title: 'Set to', value: 'set' },
                  { title: 'Add', value: 'add' },
                  { title: 'Subtract', value: 'subtract' },
                ]" label="Operation" variant="outlined" density="comfortable" class="mb-4" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="stockForm.quantity" label="Quantity" type="number" :rules="[
                  v => !!v || 'Quantity is required',
                  v => v >= 0 || 'Quantity must be positive',
                ]" variant="outlined" density="comfortable" class="mb-4" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="tonal" @click="stockDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="confirmStockUpdate" :loading="updatingStock">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useProductStore, useSetupStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import AddProductForm from '../components/ProductForm.vue';
import ProductGrid from '../components/ProductGrid.vue';
import ProductList from '../components/ProductList.vue';
import AddCategoryForm from '../components/AddCategoryForm.vue';
import AttributeManager from '../components/AttributeManager.vue';
import DiscountManager from '../components/DiscountManager.vue';

// Stores
const productStore = useProductStore();
const setupStore = useSetupStore();
const { categories } = storeToRefs(setupStore);
const { products } = storeToRefs(productStore);

// State
const search = ref('');
const sortBy = ref('name');
const filterStatus = ref('All');
const viewMode = ref('grid');
const page = ref(1);
const pageSize = ref(20);
const loading = ref(false);
const selectedCategory = ref(null);
const selectedProducts = ref([]);
const showFilters = ref(false);
const isMobile = ref(false);

// Dialogs
const createDialog = ref(false);
const categoryDialog = ref(false);
const attributeDialog = ref(false);
const discountDialog = ref(false);

// Add to the state section
const editingProduct = ref(null);
const editingCategory = ref(null);
const productForm = ref(null);
const categoryForm = ref(null);
const confirmDialog = ref(false);
const confirmDialogData = ref({
  type: '',
  name: '',
  resolve: null,
});

// Add to the state section
const stockDialog = ref(false);
const stockFormRef = ref(null);
const stockForm = ref({
  quantity: 0,
  operation: 'set',
});
const updatingStock = ref(false);

// Table headers
const sortOptions = [
  { title: 'Name', value: 'name' },
  { title: 'Price', value: 'price' },
  { title: 'Stock', value: 'stock' },
  { title: 'Created Date', value: 'createdAt' }
];

const statusOptions = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

// Quick actions
const quickActions = [
  {
    id: 'new-product',
    text: 'New Product',
    icon: 'mdi-package-variant-plus',
    color: 'primary',
    handler: openCreateDialog
  },
  {
    id: 'new-category',
    text: 'New Category',
    icon: 'mdi-folder-plus',
    color: 'secondary',
    handler: openCategoryDialog
  },
  {
    id: 'manage-attributes',
    text: 'Manage Attributes',
    icon: 'mdi-tag-multiple',
    color: 'info',
    handler: openAttributeDialog
  },
  {
    id: 'apply-discounts',
    text: 'Apply Discounts',
    icon: 'mdi-tag',
    color: 'success',
    handler: openDiscountDialog
  }
];

// Bulk actions with updated styling
const bulkActions = [
  {
    id: 'delete',
    text: 'Delete Selected',
    icon: 'mdi-delete',
    color: 'error',
    handler: deleteSelectedProducts
  },
  {
    id: 'apply-discount',
    text: 'Apply Discount',
    icon: 'mdi-tag',
    color: 'success',
    handler: openDiscountDialog
  },
  {
    id: 'update-stock',
    text: 'Update Stock',
    icon: 'mdi-package-variant',
    color: 'info',
    handler: updateStock
  }
];

// Computed
const hasActiveFilters = computed(() => {
  return filterStatus.value !== 'All' || sortBy.value !== 'name';
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (filterStatus.value !== 'All') count++;
  if (sortBy.value !== 'name') count++;
  return count;
});

const filteredProducts = computed(() => {
  let filtered = products.value;

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value);
  }

  if (filterStatus.value !== 'All') {
    filtered = filtered.filter(p => {
      switch (filterStatus.value) {
        case 'In Stock':
          return p.stock > 10;
        case 'Low Stock':
          return p.stock > 0 && p.stock <= 10;
        case 'Out of Stock':
          return p.stock === 0;
        default:
          return true;
      }
    });
  }

  if (search.value) {
    const query = search.value.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }

  console.log('filteredProducts computed:', filtered.length, 'products');

  return filtered;
});

const totalProducts = computed(() => filteredProducts.value.length);

// Methods
function getProductCount(categoryId) {
  return products.value.filter(p => p.category === categoryId).length;
}

function getCategoryName(categoryId) {
  const category = categories.value.find(c => c.cid === categoryId);
  return category ? category.name : '';
}

function selectCategory(categoryId) {
  selectedCategory.value = categoryId;
  page.value = 1;
}

function refreshCategories() {
  setupStore.getCategories();
}

function resetFilters() {
  filterStatus.value = 'All';
  sortBy.value = 'name';
}

function applyFilters() {
  showFilters.value = false;
}

function toggleViewMode() {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
}

function openCreateDialog() {
  editingProduct.value = null; // Reset for create
  createDialog.value = true;
}

function closeCreateDialog() {
  createDialog.value = false;
  editingProduct.value = null;
  // Optionally reset form here if needed, depending on form component logic
}

function openCategoryDialog() {
  editingCategory.value = null;
  categoryDialog.value = true;
}

function closeCategoryDialog() {
  categoryDialog.value = false;
  editingCategory.value = null;
  // Optionally reset form here
}

function openAttributeDialog() {
  attributeDialog.value = true;
}

function closeAttributeDialog() {
  attributeDialog.value = false;
}

function openDiscountDialog() {
  if (selectedProducts.value.length === 0) {
    useToast().warning('Please select at least one product');
    return;
  }
  discountDialog.value = true;
}

function closeDiscountDialog() {
  discountDialog.value = false;
}

async function saveProduct(productData) {
  try {
    const { valid } = await productForm.value.validate();
    if (!valid) {
      useToast().error('Please fill in all required fields');
      return;
    }

    if (editingProduct.value) {
      await productStore.updateProduct({
        ...editingProduct.value,
        ...productData,
      });
      useToast().success('Product updated successfully');
    } else {
      await productStore.createProduct(productData);
      useToast().success('Product created successfully');
    }

    closeCreateDialog();
    refreshProducts();
  } catch (error) {
    console.error('Error saving product:', error);
    useToast().error('Failed to save product');
  }
}

async function saveCategory(categoryData) {
  try {
    const { valid } = await categoryForm.value.validate();
    if (!valid) {
      useToast().error('Please fill in all required fields');
      return;
    }

    if (editingCategory.value) {
      await setupStore.updateCategory({
        ...editingCategory.value,
        ...categoryData,
      });
      useToast().success('Category updated successfully');
    } else {
      await setupStore.createCategory(categoryData);
      useToast().success('Category created successfully');
    }

    closeCategoryDialog();
    refreshCategories();
  } catch (error) {
    console.error('Error saving category:', error);
    useToast().error('Failed to save category');
  }
}

async function editProduct(product) {
  try {
    editingProduct.value = product;
    createDialog.value = true;
  } catch (error) {
    console.error('Error editing product:', error);
    useToast().error('Failed to edit product');
  }
}

async function deleteProduct(product) {
  try {
    const confirmed = await confirmDeleteDialog('product', product.name);
    if (!confirmed) return;

    await productStore.deleteProduct(product.pid);
    useToast().success('Product deleted successfully');
    refreshProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
    useToast().error('Failed to delete product');
  }
}

async function deleteSelectedProducts() {
  try {
    if (selectedProducts.value.length === 0) {
      useToast().warning('Please select at least one product');
      return;
    }

    const confirmed = await confirmDeleteDialog(
      'products',
      `${selectedProducts.value.length} selected products`
    );
    if (!confirmed) return;

    await Promise.all(
      selectedProducts.value.map(id => productStore.deleteProduct(id))
    );
    useToast().success('Selected products deleted successfully');
    selectedProducts.value = [];
    refreshProducts();
  } catch (error) {
    console.error('Error deleting products:', error);
    useToast().error('Failed to delete selected products');
  }
}

async function updateStock() {
  if (selectedProducts.value.length === 0) {
    useToast().warning('Please select at least one product');
    return;
  }

  stockForm.value = {
    quantity: 0,
    operation: 'set',
  };
  stockDialog.value = true;
}

// Replace the confirmDeleteDialog function with this implementation
async function confirmDeleteDialog(type, name) {
  return new Promise((resolve) => {
    confirmDialogData.value = {
      type,
      name,
      resolve,
    };
    confirmDialog.value = true;
  });
}

async function confirmStockUpdate() {
  try {
    const { valid } = await stockFormRef.value.validate();
    if (!valid) {
      useToast().error('Please enter a valid quantity');
      return;
    }

    updatingStock.value = true;
    // Simulate API call for stock update
    await new Promise(resolve => setTimeout(resolve, 500)); // Mock delay

    // Logic to apply stock update to selected products (mock)
    console.log(`Updating stock for ${selectedProducts.value.length} products with operation: ${stockForm.value.operation} and quantity: ${stockForm.value.quantity}`);

    // You would integrate with your actual product store action here
    // await productStore.updateStock({ productIds: selectedProducts.value, ...stockForm.value });

    useToast().success('Stock updated successfully');
    stockDialog.value = false;
    selectedProducts.value = []; // Clear selection after update
    refreshProducts(); // Refresh list to show updated stock

  } catch (error) {
    console.error('Error updating stock:', error);
    useToast().error('Failed to update stock');
  } finally {
    updatingStock.value = false;
  }
}

function refreshProducts() {
  productStore.getProducts();
}

// Lifecycle
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 960;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);

  productStore.getProducts();
  setupStore.getCategories();
  console.log('onMounted: Fetching products and categories...');
});

// Watchers
watch([page, pageSize, search, sortBy, filterStatus], () => {
  // Data fetching/filtering logic should react to these changes
  // Since we are using computed properties and store data, this watcher might not be strictly needed for filtering/sorting IF the store reactivity handles it.
  // However, if pagination or server-side filtering/sorting is implemented, this watcher would trigger data fetches.
});

// Semantic HTML considerations:
// - v-app-bar can be considered a header
// - v-container as main content wrapper
// - v-col for grid layout (sections)
// - h1 for main title
// - Consider using section tags for main content areas like category sidebar and product list/grid if appropriate within the Vuetify structure.
</script>

<style scoped>
.product-management {
  background: #ffffff;
  min-height: 100vh;
  position: relative;
}

/* Modern Header Styles */
.v-app-bar {
  background: #ffffff !important;
  border-radius: 0 0 32px 32px;
  box-shadow: 0 8px 32px rgba(26, 34, 54, 0.18);
  position: relative;
  overflow: hidden;
}

.v-app-bar::after {
  content: '';
  position: absolute;
  right: -60px;
  top: 0;
  width: 160px;
  height: 100%;
  background: radial-gradient(circle, #ff6f91 0%, transparent 70%);
  opacity: 0.18;
}

/* Placeholder height to match extended app bar */
.header-placeholder {
  height: 112px;
}

/* Action Buttons */
/* Primary button style for FAB and other prominent actions */
.primary-gradient-button {
  background: linear-gradient(135deg, #7b61ff 0%, #ff6f91 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em;
  border-radius: 50% !important;
  /* Circular button */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: 2px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(8px);
  box-shadow:
    0 4px 24px rgba(123, 97, 255, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1) !important;
}

.primary-gradient-button:hover:not(:disabled) {
  transform: translateY(-5px) scale(1.05);
  box-shadow:
    0 8px 32px rgba(123, 97, 255, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.2) !important;
}

.primary-gradient-button:active:not(:disabled) {
  transform: translateY(0) scale(0.95);
}

.primary-gradient-button:disabled {
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.5) 0%, rgba(255, 111, 145, 0.5) 100%) !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Filter Button */
.filter-trigger-btn {
  background: rgba(123, 97, 255, 0.12) !important;
  border: 1px solid rgba(123, 97, 255, 0.2) !important;
  backdrop-filter: blur(8px);
  box-shadow:
    0 4px 16px rgba(26, 34, 54, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1) !important;
}

.filter-trigger-btn:hover {
  background: rgba(123, 97, 255, 0.15) !important;
  transform: translateY(-2px);
  box-shadow:
    0 6px 20px rgba(26, 34, 54, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.2) !important;
}

.filter-active {
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.2) 0%, rgba(255, 111, 145, 0.2) 100%) !important;
  border: 1px solid rgba(123, 97, 255, 0.3) !important;
}

/* Search Input */
.premium-search-input {
  background: rgba(245, 247, 255, 0.7) !important;
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

.premium-search-input:hover {
  background: rgba(245, 247, 255, 0.9) !important;
}

.premium-search-input:focus-within {
  background: #fff !important;
  box-shadow: 0 2px 12px rgba(123, 97, 255, 0.1) !important;
}

/* Cards and Containers */
.category-card,
.product-card {
  background: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(26, 34, 54, 0.08);
  transition: all 0.3s ease;
}

.category-card:hover,
.product-card:hover {
  border-color: rgba(123, 97, 255, 0.15);
  box-shadow: 0 8px 32px rgba(123, 97, 255, 0.12);
}

/* Category List Items */
.category-list-item {
  margin: 4px 8px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.category-list-item:hover {
  background: rgba(123, 97, 255, 0.04);
}

.category-list-item.v-list-item--active {
  background: rgba(123, 97, 255, 0.08);
}

.category-avatar {
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #7b61ff 0%, #ff6f91 100%);
}

/* Dialog Styles */
.v-dialog .v-card {
  border-radius: 16px !important;
  background: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 32px rgba(26, 34, 54, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1) !important;
}

/* Floating Action Button */
.quick-actions-fab {
  position: fixed !important;
  bottom: 32px !important;
  right: 32px !important;
  z-index: 100;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .product-management {
    background: #ffffff;
    /* Keep white background in dark mode */
  }

  .category-card,
  .product-card,
  .v-dialog .v-card {
    background: #ffffff !important;
    border-color: rgba(255, 255, 255, 0.08);
  }

  .category-list-item:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  .category-list-item.v-list-item--active {
    background: rgba(255, 255, 255, 0.08);
  }

  .premium-search-input {
    background: rgba(255, 255, 255, 0.08) !important;
  }

  .premium-search-input:hover {
    background: rgba(255, 255, 255, 0.12) !important;
  }

  .premium-search-input:focus-within {
    background: rgba(255, 255, 255, 0.15) !important;
  }

  /* Adjust button colors for dark mode */
  .filter-trigger-btn,
  .v-btn[prepend-icon="mdi-view-dashboard"] {
    background: rgba(255, 255, 255, 0.12) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
  }

  .filter-trigger-btn:hover,
  .v-btn[prepend-icon="mdi-view-dashboard"]:hover {
    background: rgba(255, 255, 255, 0.15) !important;
  }

  .filter-active {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
  }

  .v-app-bar .text-primary,
  .v-app-bar .v-icon[color="primary"] {
    color: #1a1a1a !important;
    /* Change to dark color for white background */
  }

  .v-app-bar .text-medium-emphasis {
    color: rgba(255, 255, 255, 0.8) !important;
  }

  /* Ensure category card title and icon are dark in dark mode with white background */
  .category-card .v-card-title span,
  .category-card .v-btn .v-icon {
    color: #1a1a1a !important;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {

  .primary-gradient-button,
  .category-card,
  .product-card,
  .v-dialog .v-card,
  .filter-trigger-btn,
  .v-btn[prepend-icon="mdi-view-dashboard"] {
    border: 2px solid CanvasText !important;
  }

  .category-list-item.v-list-item--active {
    border: 2px solid CanvasText !important;
  }

  /* Ensure text is visible on buttons in high contrast */
  .primary-gradient-button,
  .filter-trigger-btn,
  .v-btn[prepend-icon="mdi-view-dashboard"] {
    color: CanvasText !important;
    background: Canvas !important;
  }
}

/* Animations */
@keyframes pulse {
  0% {
    box-shadow: 0 4px 24px rgba(123, 97, 255, 0.25);
  }

  50% {
    box-shadow: 0 4px 32px rgba(123, 97, 255, 0.35);
  }

  100% {
    box-shadow: 0 4px 24px rgba(123, 97, 255, 0.25);
  }
}

.primary-gradient-button {
  animation: pulse 2s infinite ease-in-out;
}

/* Accessibility */
:focus-visible {
  outline: 2px solid #7b61ff;
  outline-offset: 2px;
}

/* Responsive Adjustments */
@media (max-width: 960px) {
  .v-app-bar {
    border-radius: 0 0 24px 24px;
  }

  .category-card,
  .product-card {
    border-radius: 12px;
  }

  .quick-actions-fab {
    bottom: 16px;
    right: 16px;
  }
}

@media (max-width: 600px) {
  .v-app-bar {
    border-radius: 0 0 16px 16px;
  }

  .category-card,
  .product-card {
    border-radius: 8px;
  }

  .primary-gradient-button {
    transform: scale(0.9);
  }

  .primary-gradient-button:hover:not(:disabled) {
    transform: translateY(-3px) scale(0.95);
  }

  .v-app-bar .v-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .v-app-bar .d-flex.align-center.gap-4.flex-wrap.justify-end {
    width: 100%;
    justify-content: space-between;
  }

  .v-app-bar .premium-search-input {
    flex-grow: 1;
    max-width: none !important;
  }
}
</style>