<template>
  <v-container fluid class="product-management">
    <!-- Header Section with Gradient Background -->
    <v-row class="header-section py-6 px-4" align="center" justify="space-between">
      <v-col cols="12" md="6" class="header-content">
        <div class="d-flex align-center mb-2">
          <v-icon color="primary" size="36" class="mr-3">mdi-package-variant</v-icon>
          <h1 class="text-h4 font-weight-bold white--text animate__animated animate__fadeIn mb-0">
            Product Management
          </h1>
        </div>
        <div class="text-subtitle-1 white--text opacity-80 animate__animated animate__fadeIn animate__delay-1s">
          {{ filteredProducts?.length }} products • {{ categories?.length }} categories
        </div>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end align-center header-actions">
        <v-text-field v-model="search" placeholder="Search products..." prepend-inner-icon="mdi-magnify"
          variant="outlined" density="comfortable" clearable hide-details class="premium-search-input"
          :style="isMobile ? 'width: 100%;' : 'max-width: 320px;'" role="search" type="text" rounded="pill" />
        <v-btn icon="mdi-filter-variant" color="white" variant="tonal" class="filter-trigger-btn"
          @click="showFilters = true" :class="{ 'filter-active': hasActiveFilters }"
          :style="isMobile ? 'position: fixed; bottom: 100px; right: 24px; z-index: 99;' : ''">
          <div class="filter-btn-backdrop"></div>
          <v-icon>mdi-filter-variant</v-icon>
          <v-badge v-if="activeFilterCount > 0" :content="activeFilterCount" color="error" location="top end"
            offset-x="2" offset-y="2" />
        </v-btn>
      </v-col>
    </v-row>

    <!-- Main Content Area -->
    <v-container fluid class="py-6 mt-0">
      <v-row>
        <!-- Category Sidebar -->
        <v-col cols="12" md="3" lg="2" class="category-sidebar">
          <v-card class="category-card rounded-lg" elevation="0">
            <v-card-title class="d-flex align-center justify-space-between py-3 px-4">
              <span class="text-subtitle-1 font-weight-medium">Categories</span>
              <v-btn icon="mdi-plus" variant="text" size="small" color="primary" @click="openCategoryDialog" />
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-0">
              <v-list v-if="categories?.length" class="category-list">
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
        <v-col cols="12" md="9" lg="10">
          <v-card class="product-card rounded-lg" elevation="0">
            <!-- Product Card Header -->
            <div class="premium-table-header d-flex align-center justify-space-between px-4 py-3">
              <div class="d-flex align-center">
                <div>
                  <div class="text-subtitle-1 font-weight-medium premium-table-title">
                    {{ selectedCategory ? 'Products in ' + getCategoryName(selectedCategory) : 'All Products' }}
                  </div>
                  <div class="text-caption premium-table-subtitle">
                    Showing {{ filteredProducts?.length }} of {{ totalProducts }} products
                  </div>
                </div>
              </div>
              <div class="d-flex align-center gap-2">
                <v-btn :icon="viewMode === 'grid' ? 'mdi-apps' : 'mdi-format-list-bulleted'" variant="tonal"
                  @click="toggleViewMode" class="view-toggle-btn" />
                <v-btn icon="mdi-plus" color="primary" class="create-product-btn" @click="openCreateDialog">
                  <v-icon color="white">mdi-plus</v-icon>
                </v-btn>
              </div>
            </div>

            <v-divider />

            <!-- Bulk Actions -->
            <div v-if="selectedProducts?.length > 0" class="bulk-actions px-4 py-2">
              <div class="d-flex gap-2">
                <v-btn v-for="action in bulkActions" :key="action.id" :color="action.color" variant="tonal"
                  class="rounded-pill" :prepend-icon="action.icon" @click="action.handler" size="small">
                  {{ action.text }}
                </v-btn>
              </div>
            </div>

            <!-- Product Grid/List -->
            <div class="product-content pa-4">
              <product-grid v-if="viewMode === 'grid' && filteredProducts?.length > 0" :products="filteredProducts"
                :loading="loading" :search="search" :sort-by="sortBy" :sort-order="sortOrder" :page="page"
                :items-per-page="pageSize" :total-items="totalProducts" v-model:selected="selectedProducts"
                @edit="editProduct" @delete="deleteProduct" @click="editProduct" />
              <product-list v-else-if="viewMode === 'list' && filteredProducts?.length > 0" :products="filteredProducts"
                :loading="loading" :search="search" :sort-by="sortBy" :sort-order="sortOrder" :page="page"
                :items-per-page="pageSize" :total-items="totalProducts" v-model:selected="selectedProducts"
                @edit="editProduct" @delete="deleteProduct" />

              <!-- No products found message -->
              <div v-else class="no-products pa-6 text-center">
                <v-icon size="48" color="grey" class="mb-2">mdi-package-variant-off</v-icon>
                <div class="text-h6 mb-2">No Products Found</div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ search ? 'No products match your search criteria' : 'Click the + button to add your first product'
                  }}
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-space-between align-center px-4 py-3 premium-table-footer">
              <div class="text-caption text-medium-emphasis">
                Showing {{ (page - 1) * pageSize + 1 }} to {{ Math.min(page * pageSize, totalProducts) }}
                of {{ totalProducts }} entries
              </div>
              <div class="d-flex align-center">
                <v-btn :disabled="page === 1" @click="page--" class="mr-2" color="primary" variant="tonal" size="small">
                  <v-icon start>mdi-chevron-left</v-icon>
                  Previous
                </v-btn>
                <v-btn :disabled="page >= Math.ceil(totalProducts / pageSize)" @click="page++" color="primary"
                  variant="tonal" size="small">
                  Next
                  <v-icon end>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialogs -->
    <v-dialog v-model="createDialog" max-width="1200px" persistent class="rounded-xl" scrollable>
      <v-card class="rounded-xl">
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <span class="text-h5 font-weight-bold">
            {{ editingProduct ? 'Edit Product' : 'Create New Product' }}
          </span>
          <v-btn icon="mdi-close" variant="text" @click="closeCreateDialog" />
        </v-card-title>
        <v-divider />
        <v-card-text style="padding: 0 !important;">
          <add-product-form ref="productForm" :initial-data="editingProduct" @submit="handleProductSubmit"
            @cancel="closeCreateDialog" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="categoryDialog" max-width="600px" persistent scrollable>
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

    <!-- Upload Status -->
    <v-snackbar v-model="showUploadStatus" :color="uploadStatus?.color" location="bottom" timeout="-1">
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ uploadStatus.icon }}</v-icon>
        <span>{{ uploadStatus.message }}</span>
      </div>
      <template v-slot:actions>
        <v-progress-circular v-if="uploadStatus.isUploading" indeterminate :size="24" :width="2" class="mr-2" />
        <v-btn v-if="uploadStatus.isUploading" variant="text" @click="cancelUpload">
          Cancel
        </v-btn>
      </template>
    </v-snackbar>
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
import { useDisplay } from 'vuetify';
import useProduct from '@/composables/useProduct';



// Composables
const { isMobile } = useDisplay();
const { setLoader, createProduct, setProduct, fetchProducts } = useProduct();

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

// Add upload status state
const showUploadStatus = ref(false);
const uploadStatus = ref({
  isUploading: false,
  message: '',
  color: 'primary',
  icon: 'mdi-cloud-upload',
  progress: 0
});

// Table headers
const sortOptions = [
  { title: 'Name', value: 'name' },
  { title: 'Price', value: 'price' },
  { title: 'Stock', value: 'stock' },
  { title: 'Created Date', value: 'createdAt' }
];

const statusOptions = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

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

  console.log('filteredProducts computed:', filtered?.length, 'products');

  return filtered;
});

const totalProducts = computed(() => filteredProducts.value?.length);

// Methods
function getProductCount(categoryId) {
  return products.value.filter(p => p.category === categoryId)?.length;
}

function getCategoryName(categoryId) {
  const category = categories.value.find(c => c.cid === categoryId);
  return category ? category.name : '';
}

function selectCategory(categoryId) {
  selectedCategory.value = categoryId;
  page.value = 1;
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
  setProduct(
    {
      name: '',
      description: '',
      recipeTips: '',
      price: 0,
      categories: [],
      variants: [],
      discounts: [],
      images: [],
    }
  );
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

function closeAttributeDialog() {
  attributeDialog.value = false;
}

function openDiscountDialog() {
  if (selectedProducts.value?.length === 0) {
    useToast().warning('Please select at least one product');
    return;
  }
  discountDialog.value = true;
}

function closeDiscountDialog() {
  discountDialog.value = false;
}

async function handleProductSubmit({ productData, images }) {
  try {
    // First, create/update the product
    setLoader(true);
    const createdProduct = editingProduct.value?.productId
      ? await productStore.updateProduct(productData)
      : await createProduct(productData);
    if (images && images?.length > 0) {
      await uploadProductImages(createdProduct?.data?.productId, images);
    }
    useToast().success(`Product ${editingProduct.value ? 'updated' : 'created'} successfully`);

    // Close dialog and refresh products
    closeCreateDialog();
    await refreshProducts(true);
  } catch (error) {
    console.error('Error handling product submission:', error);
    useToast().error('Failed to save product');
  } finally {
    setLoader(false);
  }
}

async function uploadProductImages(productId, images) {
  const formData = new FormData();
  formData.append('id', productId);
  formData.append('type', 'Product');

  images.forEach(image => {
    if (image.file) {
      formData.append('image', image.file);
    }
  });

  try {
    uploadStatus.value = {
      isUploading: true,
      message: 'Uploading images...',
      color: 'primary',
      icon: 'mdi-cloud-upload',
      progress: 0
    };
    showUploadStatus.value = true;

    await productStore.uploadProductImages(formData, (progress) => {
      uploadStatus.value.progress = progress;
      uploadStatus.value.message = `Uploading images... ${progress}%`;
    });

    uploadStatus.value = {
      isUploading: false,
      message: 'Images uploaded successfully',
      color: 'success',
      icon: 'mdi-check-circle',
      progress: 100
    };

    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      showUploadStatus.value = false;
    }, 3000);
  } catch (error) {
    console.error('Error uploading images:', error);
    uploadStatus.value = {
      isUploading: false,
      message: 'Failed to upload images',
      color: 'error',
      icon: 'mdi-alert-circle',
      progress: 0
    };
    throw error;
  }
}

function cancelUpload() {
  // Implement cancel upload logic if needed
  showUploadStatus.value = false;
  uploadStatus.value.isUploading = false;
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
    if (selectedProducts.value?.length === 0) {
      useToast().warning('Please select at least one product');
      return;
    }

    const confirmed = await confirmDeleteDialog(
      'products',
      `${selectedProducts.value?.length} selected products`
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
  if (selectedProducts.value?.length === 0) {
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
    console.log(`Updating stock for ${selectedProducts.value?.length} products with operation: ${stockForm.value.operation} and quantity: ${stockForm.value.quantity}`);

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

async function refreshProducts(hydrate = false) {
  await fetchProducts({ eager: hydrate });
}

// Lifecycle
onMounted(async () => {
  await Promise.allSettled([
    fetchProducts({ eager: true }),
    setupStore.getCategories(),
  ]);
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
  background: linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%);
  min-height: 100vh;
  padding-bottom: 2rem;
}

.header-section {
  background: linear-gradient(135deg, #7b61ff1a 0%, #ff6f9113 100%);
  border-radius: 0 0 32px 32px;
  box-shadow: 0 8px 32px rgba(26, 34, 54, 0.048);
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
}

.header-section::after {
  content: '';
  position: absolute;
  right: -60px;
  top: 0;
  width: 160px;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  opacity: 0.18;
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-content .text-h4 {
  font-size: 2.25rem !important;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.header-content .text-subtitle-1 {
  font-size: 1.1rem !important;
  line-height: 1.5;
  max-width: 600px;
}

.header-actions {
  position: relative;
  z-index: 1;
}

/* Category Sidebar Styles */
.category-sidebar {
  position: sticky;
  top: 24px;
}

.category-card {
  background: #ffffff !important;
  border: 1px solid rgba(123, 97, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(26, 34, 54, 0.08);
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: rgba(123, 97, 255, 0.15);
  box-shadow: 0 8px 32px rgba(123, 97, 255, 0.12);
}

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

/* Product Card Styles */
.product-card {
  background: #ffffff !important;
  border: 1px solid rgba(123, 97, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(26, 34, 54, 0.08);
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: rgba(123, 97, 255, 0.15);
  box-shadow: 0 8px 32px rgba(123, 97, 255, 0.12);
}

.premium-table-header {
  background: #f8fafc;
  border-bottom: 1px solid rgba(123, 97, 255, 0.08);
}

.premium-table-title {
  color: #1a2236;
  font-size: 0.95rem !important;
  line-height: 1.4;
  margin-bottom: 2px;
}

.premium-table-subtitle {
  color: #4a5568;
  font-size: 0.85rem !important;
  line-height: 1.4;
}

/* Button Styles */
.create-product-btn {
  background: linear-gradient(135deg, #7b61ff 0%, #ff6f91 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: 2px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(8px);
  box-shadow:
    0 4px 24px rgba(123, 97, 255, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1) !important;
}

.create-product-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow:
    0 8px 32px rgba(123, 97, 255, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.2) !important;
}

.view-toggle-btn {
  background: rgba(123, 97, 255, 0.08) !important;
  border: 1px solid rgba(123, 97, 255, 0.12) !important;
  transition: all 0.3s ease;
}

.view-toggle-btn:hover {
  background: rgba(123, 97, 255, 0.12) !important;
  transform: translateY(-2px);
}

/* Bulk Actions */
.bulk-actions {
  background: rgba(123, 97, 255, 0.04);
  border-bottom: 1px solid rgba(123, 97, 255, 0.08);
}

/* Search Input */
.premium-search-input {
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 32px !important;
  transition: all 0.3s ease;
}

.premium-search-input:hover {
  background: rgba(255, 255, 255, 0.15) !important;
}

.premium-search-input:focus-within {
  background: rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

/* No Products State */
.no-products {
  background: rgba(123, 97, 255, 0.02);
  border-radius: 16px;
  border: 1px dashed rgba(123, 97, 255, 0.2);
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .product-management {
    background: #f5f5f7;
  }

  .header-section {
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.08) 0%, rgba(255, 111, 145, 0.08) 100%);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }

  .header-content .text-h4,
  .header-content .text-subtitle-1 {
    color: #1a1a1a !important;
  }

  .category-card,
  .product-card {
    background: #ffffff !important;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .category-card:hover,
  .product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .premium-table-header {
    background: #fafafa;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .premium-table-title {
    color: #1a1a1a;
    font-weight: 500;
  }

  .premium-table-subtitle {
    color: rgba(0, 0, 0, 0.7);
  }

  .category-list-item {
    color: #1a1a1a;
    margin: 2px 0;
    border-radius: 8px;
  }

  .category-list-item:hover {
    background: rgba(123, 97, 255, 0.06);
  }

  .category-list-item.v-list-item--active {
    background: rgba(123, 97, 255, 0.08);
    color: #1a1a1a;
    font-weight: 500;
  }

  .category-avatar {
    background: linear-gradient(135deg, #7b61ff 0%, #ff6f91 100%);
    border: none;
  }

  .bulk-actions {
    background: #fafafa;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .no-products {
    background: #fafafa;
    border: 1px dashed rgba(0, 0, 0, 0.1);
  }

  .premium-search-input {
    background: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
  }

  .premium-search-input:hover {
    border-color: rgba(123, 97, 255, 0.3) !important;
  }

  .premium-search-input:focus-within {
    border-color: #7b61ff !important;
    box-shadow: 0 0 0 2px rgba(123, 97, 255, 0.1) !important;
  }

  .premium-search-input :deep(.v-field__input) {
    color: #1a1a1a !important;
  }

  .premium-search-input :deep(.v-icon) {
    color: rgba(0, 0, 0, 0.5) !important;
  }

  .create-product-btn {
    background: linear-gradient(135deg, #7b61ff 0%, #ff6f91 100%) !important;
    border: none !important;
    box-shadow: 0 2px 8px rgba(123, 97, 255, 0.2) !important;
  }

  .create-product-btn:hover {
    box-shadow: 0 4px 12px rgba(123, 97, 255, 0.3) !important;
  }

  .view-toggle-btn {
    background: #f5f5f7 !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    color: #1a1a1a !important;
  }

  .view-toggle-btn:hover {
    background: #f0f0f2 !important;
  }

  .premium-table-footer {
    background: #fafafa;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    color: rgba(0, 0, 0, 0.7);
  }

  /* Dialog styles */
  .v-dialog .v-card {
    background: #ffffff !important;
    border: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
    overflow: hidden;
  }

  .v-dialog .v-card-title {
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: -0.01em;
    padding: 20px 24px;
  }

  .v-dialog .v-card-text {
    color: rgba(0, 0, 0, 0.8);
    padding: 24px;
  }

  .v-dialog .v-card-actions {
    padding: 16px 24px;
    background: rgba(0, 0, 0, 0.03);
  }

  .v-dialog .v-btn {
    text-transform: none;
    font-weight: 500;
    letter-spacing: 0.01em;
    height: 40px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .v-dialog .v-btn.v-btn--variant-tonal {
    background: rgba(0, 0, 0, 0.06) !important;
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
  }

  .v-dialog .v-btn.v-btn--variant-tonal:hover {
    background: rgba(0, 0, 0, 0.1) !important;
  }

  .v-dialog .v-btn.v-btn--color-primary {
    background: linear-gradient(135deg, #7b61ff 0%, #ff6f91 100%) !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(123, 97, 255, 0.2) !important;
  }

  .v-dialog .v-btn.v-btn--color-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(123, 97, 255, 0.3) !important;
  }

  .v-dialog .v-btn.v-btn--color-primary:active {
    transform: translateY(0);
  }

  .v-dialog .v-btn.v-btn--disabled {
    opacity: 0.6;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Filter panel */
  .filter-panel {
    background: #ffffff !important;
    border: none;
  }

  .filter-section {
    background: #fafafa;
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .filter-section:hover {
    background: #f5f5f7;
    border-color: rgba(123, 97, 255, 0.2);
  }

  .filter-section-header .text-subtitle-1 {
    color: #1a1a1a;
    font-weight: 500;
  }

  .filter-form .premium-input {
    background: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
  }

  .filter-form .premium-input:hover {
    border-color: rgba(123, 97, 255, 0.3) !important;
  }

  .filter-form .premium-input:focus-within {
    border-color: #7b61ff !important;
    box-shadow: 0 0 0 2px rgba(123, 97, 255, 0.1) !important;
  }

  /* Text improvements */
  .text-medium-emphasis {
    color: rgba(0, 0, 0, 0.7) !important;
  }

  .text-caption {
    color: rgba(0, 0, 0, 0.7) !important;
  }

  .v-list-item-title {
    color: #1a1a1a !important;
  }

  .v-list-item-subtitle {
    color: rgba(0, 0, 0, 0.7) !important;
  }

  /* Button improvements */
  .v-btn {
    color: #1a1a1a !important;
  }

  .v-btn.v-btn--variant-tonal {
    background: #f5f5f7 !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
  }

  .v-btn.v-btn--variant-tonal:hover {
    background: #f0f0f2 !important;
  }

  /* Spacing improvements */
  .category-sidebar {
    padding-right: 16px;
    padding-left: 0;
  }

  .category-list {
    padding: 8px 0;
  }

  .product-content {
    padding: 24px 16px;
  }

  .premium-table-header {
    padding: 16px;
  }

  .bulk-actions {
    padding: 12px 16px;
  }

  .premium-table-footer {
    padding: 16px;
  }
}

/* Responsive Adjustments */
@media (max-width: 960px) {
  .header-section {
    border-radius: 0 0 24px 24px;
  }

  .category-sidebar {
    position: static;
    margin-bottom: 24px;
  }

  .category-card,
  .product-card {
    border-radius: 12px;
  }
}

@media (max-width: 600px) {
  .header-section {
    border-radius: 0 0 16px 16px;
  }

  .category-card,
  .product-card {
    border-radius: 8px;
  }

  .premium-table-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 16px;
    padding: 16px !important;
  }

  .premium-table-header>div:last-child {
    width: 100%;
    justify-content: space-between;
  }

  .premium-search-input {
    width: 100% !important;
    max-width: none !important;
  }
}

/* Accessibility */
:focus-visible {
  outline: 2px solid #7b61ff;
  outline-offset: 2px;
}

/* High Contrast Mode */
@media (forced-colors: active) {

  .category-card,
  .product-card,
  .create-product-btn,
  .view-toggle-btn {
    border: 2px solid CanvasText !important;
  }

  .category-list-item.v-list-item--active {
    border: 2px solid CanvasText !important;
  }
}

/* Add styles for upload status */
.v-snackbar {
  z-index: 1000;
}

.v-snackbar :deep(.v-snackbar__content) {
  padding: 12px 16px;
}

.v-snackbar :deep(.v-snackbar__wrapper) {
  min-width: 300px;
}
</style>