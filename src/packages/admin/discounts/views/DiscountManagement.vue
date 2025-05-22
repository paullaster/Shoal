<template>
    <v-container fluid class="pa-0 discount-management">
        <!-- Header Section with Gradient Background -->
        <v-row class="header-section py-6 px-4" align="center" justify="space-between">
            <v-col cols="12" md="6" class="header-content">
                <div class="d-flex align-center mb-2">
                    <v-icon color="white" size="36" class="mr-3">mdi-tag-multiple</v-icon>
                    <h1 class="text-h4 font-weight-bold white--text animate__animated animate__fadeIn mb-0">
                        Discount Management
                    </h1>
                </div>
                <div class="text-subtitle-1 white--text opacity-80 animate__animated animate__fadeIn animate__delay-1s">
                    Create, manage, and track all your discounts in one place
                </div>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-end align-center header-actions">
                <v-text-field v-model="search" label="Search Discounts" prepend-inner-icon="mdi-magnify"
                    variant="solo-filled" density="comfortable" clearable hide-details class="premium-search-input mr-4"
                    :style="isMobile ? 'width: 100%;' : 'max-width: 320px;'" />
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

        <!-- Add the floating action button -->
        <v-tooltip location="left" :open-delay="300" :close-delay="100" transition="fade-transition" activator="parent"
            class="create-discount-tooltip">
            <span class="tooltip-content">Create a new discount</span>
        </v-tooltip>
        <v-btn icon="mdi-plus" color="primary" size="x-large" elevation="8"
            class="create-discount-fab animate__animated animate__fadeIn animate__delay-1s" @click="openCreateDialog"
            aria-label="Create new discount">
            <v-icon size="large">mdi-plus</v-icon>
        </v-btn>

        <!-- Data Table with Modern Card Design -->
        <v-row class="px-0 mt-4">
            <v-col cols="12" class="pa-0">
                <v-card class="premium-table-card" elevation="0">
                    <div class="premium-table-header d-flex align-center justify-space-between px-4 py-3">
                        <div class="d-flex align-center">
                            <div>
                                <div class="text-subtitle-1 font-weight-medium premium-table-title">Active Discounts
                                </div>
                                <div class="text-caption premium-table-subtitle">Showing {{ filteredDiscounts.length }}
                                    of {{ totalDiscounts }} discounts</div>
                            </div>
                        </div>
                        <div class="d-flex align-center">
                            <v-chip color="primary" variant="tonal" class="mr-2" size="small">
                                <v-icon start size="small">mdi-clock-outline</v-icon>
                                Last updated: {{ new Date().toLocaleTimeString() }}
                            </v-chip>
                        </div>
                    </div>

                    <v-data-table :headers="headers" :items="filteredDiscounts" :loading="loading" :search="search"
                        class="premium-table" item-key="id" density="comfortable" hover fixed-header height="auto"
                        :sort-by="[{ key: sortBy, order: 'asc' }]" :page="page" :items-per-page="pageSize"
                        :server-items-length="totalDiscounts" hide-default-footer>
                        <template #[`item.sn`]="{ item }">
                            <span class="premium-sn">#{{ item.id }}</span>
                        </template>
                        <template #[`item.status`]="{ item }">
                            <v-chip :color="item.status === 'Published' ? 'success' : 'warning'" variant="elevated"
                                size="small" class="premium-chip"
                                :class="item.status === 'Published' ? 'status-published' : 'status-unpublished'">
                                <v-icon start size="small">{{ item.status === 'Published' ? 'mdi-check-circle' :
                                    'mdi-clock-outline' }}</v-icon>
                                {{ item.status }}
                            </v-chip>
                        </template>
                        <template #[`item.amount`]="{ item }">
                            <span class="premium-amount"
                                :class="item.type === 'Percentage' ? 'amount-percentage' : 'amount-fixed'">
                                <v-icon v-if="item.type === 'Percentage'" color="primary" size="small"
                                    class="mr-1">mdi-percent</v-icon>
                                <v-icon v-else color="deep-purple" size="small" class="mr-1">mdi-currency-usd</v-icon>
                                <span>{{ item.type === 'Percentage' ? `${item.amount}%` : `$${item.amount}` }}</span>
                            </span>
                        </template>
                        <template #[`item.type`]="{ item }">
                            <v-chip :color="item.type === 'Percentage' ? 'primary' : 'deep-purple'"
                                class="premium-type-chip" size="small" variant="elevated"
                                :class="item.type === 'Percentage' ? 'type-percentage' : 'type-fixed'">
                                <v-icon start size="small">{{ item.type === 'Percentage' ? 'mdi-percent' :
                                    'mdi-currency-usd' }}</v-icon>
                                {{ item.type }}
                            </v-chip>
                        </template>
                        <template #[`item.usageLimit`]="{ item }">
                            <v-chip
                                :color="item.usageLimit > 100 ? 'success' : item.usageLimit > 0 ? 'warning' : 'grey'"
                                class="premium-usage-chip" size="small" variant="elevated">
                                <v-icon start size="small">mdi-counter</v-icon>
                                <span v-if="item.usageLimit > 0">{{ item.usageLimit }} left</span>
                                <span v-else>Unlimited</span>
                            </v-chip>
                        </template>
                        <template #[`item.actions`]="{ item }">
                            <div class="premium-actions-row">
                                <v-tooltip location="top" :open-delay="300">
                                    <template v-slot:activator="{ props }">
                                        <v-btn icon color="primary" class="mr-1" variant="text" v-bind="props"
                                            @click="viewDetails(item)">
                                            <v-icon>mdi-eye</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>View Details</span>
                                </v-tooltip>
                                <v-tooltip location="top" :open-delay="300">
                                    <template v-slot:activator="{ props }">
                                        <v-btn icon color="deep-purple" class="mr-1" variant="text" v-bind="props"
                                            @click="editDiscount(item)">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Edit Discount</span>
                                </v-tooltip>
                                <v-tooltip location="top" :open-delay="300">
                                    <template v-slot:activator="{ props }">
                                        <v-btn icon color="error" variant="text" v-bind="props"
                                            @click="deleteDiscount(item)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Delete Discount</span>
                                </v-tooltip>
                            </div>
                        </template>
                        <template #no-data>
                            <v-row class="pa-8" align="center" justify="center">
                                <v-col cols="12" class="text-center">
                                    <v-icon size="48" color="grey" class="mb-2">mdi-tag-off-outline</v-icon>
                                    <div class="text-h6 mb-2">No Discounts Found</div>
                                    <div class="text-body-2 text-medium-emphasis">
                                        Click the + button to create your first discount
                                    </div>
                                </v-col>
                            </v-row>
                        </template>
                    </v-data-table>

                    <div class="d-flex justify-space-between align-center px-4 py-3 premium-table-footer">
                        <div class="text-caption text-medium-emphasis">
                            Showing {{ (page - 1) * pageSize + 1 }} to {{ Math.min(page * pageSize, totalDiscounts) }}
                            of {{ totalDiscounts
                            }} entries
                        </div>
                        <div class="d-flex align-center">
                            <v-btn :disabled="page === 1" @click="page--" class="mr-2" color="primary" variant="tonal"
                                size="small">
                                <v-icon start>mdi-chevron-left</v-icon>
                                Previous
                            </v-btn>
                            <v-btn :disabled="page >= Math.ceil(totalDiscounts / pageSize)" @click="page++"
                                color="primary" variant="tonal" size="small">
                                Next
                                <v-icon end>mdi-chevron-right</v-icon>
                            </v-btn>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Create/Edit Discount Dialog -->
        <v-dialog v-model="dialog" max-width="600px" persistent>
            <v-card class="rounded-xl pa-6">
                <v-card-title class="text-h5 font-weight-bold">
                    {{ editMode ? 'Edit Discount' : 'Create Discount' }}
                </v-card-title>
                <v-card-text>
                    <discount-form :discount="selectedDiscount" @save="saveDiscount" @cancel="closeDialog" />
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Discount Details Dialog -->
        <v-dialog v-model="detailsDialog" max-width="600px">
            <v-card class="rounded-xl pa-6">
                <v-card-title class="text-h5 font-weight-bold">Discount Details</v-card-title>
                <v-card-text>
                    <discount-details :discount="selectedDiscount" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue" text @click="detailsDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Filter Panel for Desktop -->
        <v-navigation-drawer v-model="showFilters" location="right" temporary width="360" class="filter-panel"
            :class="{ 'filter-panel-mobile': isMobile }">
            <template v-slot:prepend>
                <div class="filter-panel-header pa-4">
                    <div class="d-flex align-center justify-space-between">
                        <div class="text-h6 font-weight-bold">Filter & Sort</div>
                        <v-btn icon="mdi-close" variant="text" @click="showFilters = false" class="close-btn" />
                    </div>
                    <div class="text-subtitle-2 text-medium-emphasis mt-1">
                        Refine your discount list with advanced filters
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
                        <v-select v-model="sortBy" :items="sortOptions" variant="outlined" density="comfortable"
                            hide-details class="premium-input mb-4" placeholder="Sort by..." />
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
                        <v-btn block color="primary" @click="applyFilters" :disabled="!hasActiveFilters"
                            class="apply-filters-btn">
                            <v-icon start>mdi-check</v-icon>
                            Apply Filters
                        </v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </v-navigation-drawer>

        <!-- Mobile Bottom Sheet for Filters -->
        <v-bottom-sheet v-model="showFilters" :class="{ 'filter-bottom-sheet': isMobile }" v-if="isMobile">
            <v-card class="filter-bottom-sheet-content">
                <v-card-title class="d-flex align-center justify-space-between pa-4">
                    <div>
                        <span class="text-h6 font-weight-bold">Filter & Sort</span>
                        <div class="text-subtitle-2 text-medium-emphasis mt-1">
                            Refine your discount list
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" @click="showFilters = false" />
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-4">
                    <v-form @submit.prevent class="filter-form">
                        <div class="filter-section mb-6">
                            <div class="filter-section-header d-flex align-center mb-3">
                                <v-icon color="primary" class="mr-2">mdi-sort</v-icon>
                                <div class="text-subtitle-1 font-weight-medium">Sort Options</div>
                            </div>
                            <v-select v-model="sortBy" :items="sortOptions" variant="outlined" density="comfortable"
                                hide-details class="premium-input mb-4" placeholder="Sort by..." />
                        </div>

                        <div class="filter-section mb-6">
                            <div class="filter-section-header d-flex align-center mb-3">
                                <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
                                <div class="text-subtitle-1 font-weight-medium">Filter Options</div>
                            </div>
                            <v-select v-model="filterStatus" :items="statusOptions" variant="outlined"
                                density="comfortable" hide-details class="premium-input"
                                placeholder="Filter by status..." />
                        </div>

                        <v-divider class="my-6" />

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
            </v-card>
        </v-bottom-sheet>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import DiscountForm from '../components/DiscountForm.vue';
import DiscountDetails from '../components/DiscountDetails.vue';

// Server-driven state
const discounts = ref([]);
const totalDiscounts = ref(0);
const page = ref(1);
const pageSize = ref(20);
const loading = ref(false);
const error = ref(null);

const headers = ref([
    { title: 'S/N', key: 'sn', align: 'center', sortable: false },
    { title: 'Title', key: 'title', align: 'start' },
    { title: 'Code', key: 'code' },
    { title: 'Amount', key: 'amount' },
    { title: 'Type', key: 'type' },
    { title: 'Usage Limit', key: 'usageLimit' },
    { title: 'Status', key: 'status' },
    { title: 'Start', key: 'startPublishing' },
    { title: 'End', key: 'endPublishing' },
    { title: 'Actions', key: 'actions', sortable: false },
]);

const search = ref('');
const sortBy = ref('title');
const filterStatus = ref('All');
const dialog = ref(false);
const detailsDialog = ref(false);
const editMode = ref(false);
const selectedDiscount = ref(null);

const sortOptions = ['title', 'code', 'amount', 'startPublishing', 'endPublishing'];
const statusOptions = ['All', 'Published', 'UnPublished'];

// Add these new refs
const showFilters = ref(false);
const isMobile = ref(false);

// Add computed properties for filter state
const hasActiveFilters = computed(() => {
    return filterStatus.value !== 'All' || sortBy.value !== 'title';
});

const activeFilterCount = computed(() => {
    let count = 0;
    if (filterStatus.value !== 'All') count++;
    if (sortBy.value !== 'title') count++;
    return count;
});

// Add methods for filter management
function resetFilters() {
    filterStatus.value = 'All';
    sortBy.value = 'title';
}

function applyFilters() {
    showFilters.value = false;
    fetchDiscounts();
}

// Update the mobile detection
onMounted(() => {
    const checkMobile = () => {
        isMobile.value = window.innerWidth < 960;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
});

// Fetch discounts from server (mocked)
async function fetchDiscounts() {
    loading.value = true;
    error.value = null;
    try {
        // Simulate API
        await new Promise(r => setTimeout(r, 500));
        // Mocked data (replace with real fetch)
        const all = [
            { id: 1, title: 'Summer Sale', code: 'SUMMER2025', amount: 20.0, type: 'Percentage', usageLimit: 100, startPublishing: '2025-06-01T00:00:00Z', endPublishing: '2025-06-30T23:59:59Z', status: 'UnPublished', createdAt: '2025-05-01T10:00:00Z', updatedAt: '2025-05-10T12:00:00Z' },
            { id: 2, title: 'Welcome Discount', code: 'WELCOME10', amount: 10.0, type: 'Fixed', usageLimit: 50, startPublishing: '2025-05-15T00:00:00Z', endPublishing: '2025-12-31T23:59:59Z', status: 'Published', createdAt: '2025-05-14T09:00:00Z', updatedAt: '2025-05-14T09:00:00Z' },
            { id: 3, title: 'Black Friday', code: 'BLACKFRIDAY', amount: 50.0, type: 'Percentage', usageLimit: 500, startPublishing: '2025-11-28T00:00:00Z', endPublishing: '2025-11-29T23:59:59Z', status: 'UnPublished', createdAt: '2025-05-12T08:00:00Z', updatedAt: '2025-05-13T08:00:00Z' },
            { id: 1, title: 'Summer Sale', code: 'SUMMER2025', amount: 20.0, type: 'Percentage', usageLimit: 100, startPublishing: '2025-06-01T00:00:00Z', endPublishing: '2025-06-30T23:59:59Z', status: 'Published', createdAt: '2025-05-01T10:00:00Z', updatedAt: '2025-05-10T12:00:00Z' },
            { id: 2, title: 'Welcome Discount', code: 'WELCOME10', amount: 10.0, type: 'Fixed', usageLimit: 50, startPublishing: '2025-05-15T00:00:00Z', endPublishing: '2025-12-31T23:59:59Z', status: 'Published', createdAt: '2025-05-14T09:00:00Z', updatedAt: '2025-05-14T09:00:00Z' },
            { id: 3, title: 'Black Friday', code: 'BLACKFRIDAY', amount: 50.0, type: 'Percentage', usageLimit: 500, startPublishing: '2025-11-28T00:00:00Z', endPublishing: '2025-11-29T23:59:59Z', status: 'UnPublished', createdAt: '2025-05-12T08:00:00Z', updatedAt: '2025-05-13T08:00:00Z' },
        ];
        // Filter, sort, and paginate (mock)
        let filtered = all;
        if (filterStatus.value !== 'All') filtered = filtered.filter(d => d.status === filterStatus.value);
        if (search.value) {
            const s = search.value.toLowerCase();
            filtered = filtered.filter(d => d.title.toLowerCase().includes(s) || d.code.toLowerCase().includes(s));
        }
        filtered = filtered.sort((a, b) => String(a[sortBy.value]).localeCompare(String(b[sortBy.value])));
        totalDiscounts.value = filtered.length;
        discounts.value = filtered.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
    } catch (e) {
        error.value = 'Failed to load discounts.';
    } finally {
        loading.value = false;
    }
}

// Watchers
watch([page, pageSize, search, sortBy, filterStatus], async () => {
    await fetchDiscounts();
});

onMounted(async () => {
    await fetchDiscounts();
});

// Computed property for filtered discounts (now just the current page)
const filteredDiscounts = computed(() => discounts.value);

// Methods
function openCreateDialog() {
    editMode.value = false;
    selectedDiscount.value = null;
    dialog.value = true;
}

function editDiscount(item) {
    editMode.value = true;
    selectedDiscount.value = { ...item };
    dialog.value = true;
}

function viewDetails(item) {
    selectedDiscount.value = { ...item };
    detailsDialog.value = true;
}

function deleteDiscount(item) {
    // Add confirmation dialog in production
    discounts.value = discounts.value.filter((discount) => discount.id !== item.id);
    fetchDiscounts();
}

function saveDiscount(discountData) {
    if (editMode.value) {
        const index = discounts.value.findIndex((d) => d.id === discountData.id);
        if (index !== -1) {
            discounts.value[index] = { ...discountData };
        }
    } else {
        discounts.value.push({
            ...discountData,
            id: discounts.value.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }
    closeDialog();
    fetchDiscounts();
}

function closeDialog() {
    dialog.value = false;
    selectedDiscount.value = null;
}
</script>

<style scoped>
.discount-management {
    background: linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%);
    min-height: 100vh;
    padding-bottom: 2rem;
}

.header-section {
    background: #fff;
    /* border-radius: 0 0 32px 32px; */
    /* box-shadow: 0 8px 32px rgba(26, 34, 54, 0.18); */
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
    background: radial-gradient(circle, #ff6f91 0%, transparent 70%);
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

.premium-search-input {
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 12px !important;
    transition: all 0.3s ease;
}

.premium-search-input:hover {
    background: rgba(255, 255, 255, 0.15) !important;
}

.premium-search-input:focus-within {
    background: rgba(255, 255, 255, 0.2) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.premium-search-input :deep(.v-field__input) {
    color: white !important;
}

.premium-search-input :deep(.v-field__label) {
    color: rgba(255, 255, 255, 0.7) !important;
}

.premium-search-input :deep(.v-icon) {
    color: rgba(255, 255, 255, 0.7) !important;
}

/* Updated Table Styles */
.premium-table-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(26, 34, 54, 0.08);
    overflow: hidden;
    border: 1px solid rgba(123, 97, 255, 0.08);
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

.premium-table {
    background: transparent !important;
}

.premium-table :deep(.v-data-table__wrapper) {
    overflow-x: auto;
}

.premium-table :deep(.v-data-table__tr) {
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
}

.premium-table :deep(.v-data-table__tr:hover) {
    background: rgba(123, 97, 255, 0.04) !important;
    border-left: 3px solid #7b61ff;
}

.premium-table :deep(.v-data-table__th) {
    background: #f8fafc !important;
    color: #1a2236 !important;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
    padding: 12px 16px !important;
    border-bottom: 1px solid rgba(123, 97, 255, 0.08) !important;
    white-space: nowrap;
}

.premium-table :deep(.v-data-table__td) {
    padding: 12px 16px !important;
    font-size: 0.9rem !important;
    color: #2d3748 !important;
    border-bottom: 1px solid rgba(123, 97, 255, 0.04) !important;
}

.premium-sn {
    font-weight: 600;
    color: #7b61ff;
    font-size: 0.9rem;
}

.premium-chip {
    font-weight: 500;
    font-size: 0.85rem;
    padding: 0 8px;
    height: 24px;
}

.status-published {
    background: rgba(16, 185, 129, 0.1) !important;
    color: #059669 !important;
}

.status-unpublished {
    background: rgba(245, 158, 11, 0.1) !important;
    color: #d97706 !important;
}

.premium-amount {
    font-weight: 600;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 6px;
}

.amount-percentage {
    color: #7b61ff;
    background: rgba(123, 97, 255, 0.08);
}

.amount-fixed {
    color: #8b5cf6;
    background: rgba(139, 92, 246, 0.08);
}

.premium-type-chip {
    font-weight: 500;
    font-size: 0.85rem;
    padding: 0 8px;
    height: 24px;
}

.type-percentage {
    background: rgba(123, 97, 255, 0.1) !important;
    color: #7b61ff !important;
}

.type-fixed {
    background: rgba(139, 92, 246, 0.1) !important;
    color: #8b5cf6 !important;
}

.premium-usage-chip {
    font-weight: 500;
    font-size: 0.85rem;
    padding: 0 8px;
    height: 24px;
}

.premium-actions-row {
    display: flex;
    gap: 4px;
    justify-content: flex-start;
    align-items: center;
}

.premium-actions-row .v-btn {
    opacity: 0.7;
    transition: all 0.2s ease;
}

.premium-actions-row .v-btn:hover {
    opacity: 1;
    transform: translateY(-2px);
}

.premium-table-footer {
    background: #f8fafc;
    border-top: 1px solid rgba(123, 97, 255, 0.08);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .premium-table-card {
        background: #1a1a1a;
        border-color: rgba(255, 255, 255, 0.08);
    }

    .premium-table-header,
    .premium-table-footer {
        background: rgba(255, 255, 255, 0.03);
        border-color: rgba(255, 255, 255, 0.08);
    }

    .premium-table-title {
        color: #fff;
    }

    .premium-table-subtitle {
        color: rgba(255, 255, 255, 0.7);
    }

    .premium-table :deep(.v-data-table__th) {
        background: rgba(255, 255, 255, 0.03) !important;
        color: #fff !important;
        border-color: rgba(255, 255, 255, 0.08) !important;
    }

    .premium-table :deep(.v-data-table__td) {
        color: rgba(255, 255, 255, 0.9) !important;
        border-color: rgba(255, 255, 255, 0.04) !important;
    }

    .premium-table :deep(.v-data-table__tr:hover) {
        background: rgba(123, 97, 255, 0.08) !important;
    }

    .status-published {
        background: rgba(16, 185, 129, 0.15) !important;
    }

    .status-unpublished {
        background: rgba(245, 158, 11, 0.15) !important;
    }

    .amount-percentage {
        background: rgba(123, 97, 255, 0.12);
    }

    .amount-fixed {
        background: rgba(139, 92, 246, 0.12);
    }

    .type-percentage {
        background: rgba(123, 97, 255, 0.15) !important;
    }

    .type-fixed {
        background: rgba(139, 92, 246, 0.15) !important;
    }
}

/* Responsive adjustments */
@media (max-width: 960px) {
    .premium-table-card {
        border-radius: 12px;
    }

    .premium-table :deep(.v-data-table__th),
    .premium-table :deep(.v-data-table__td) {
        padding: 10px 12px !important;
        font-size: 0.85rem !important;
    }

    .premium-table-footer {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
}

@media (max-width: 600px) {
    .premium-table-card {
        border-radius: 8px;
    }

    .premium-table :deep(.v-data-table__th),
    .premium-table :deep(.v-data-table__td) {
        padding: 8px 10px !important;
        font-size: 0.8rem !important;
    }

    .premium-chip,
    .premium-type-chip,
    .premium-usage-chip {
        font-size: 0.8rem !important;
        height: 22px !important;
    }

    .premium-actions-row .v-btn {
        width: 32px !important;
        height: 32px !important;
    }
}

/* Floating Action Button Styles */
.create-discount-fab {
    position: fixed !important;
    bottom: 32px !important;
    right: 32px !important;
    z-index: 100;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    background: linear-gradient(135deg, #7b61ff 0%, #ff6f91 100%) !important;
    border: 2px solid rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(8px);
    box-shadow:
        0 4px 24px rgba(123, 97, 255, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.1) !important;
}

.create-discount-fab:hover {
    transform: translateY(-4px) scale(1.05) !important;
    box-shadow:
        0 8px 32px rgba(123, 97, 255, 0.35),
        0 0 0 1px rgba(255, 255, 255, 0.2) !important;
}

.create-discount-fab:active {
    transform: translateY(0) scale(0.95) !important;
}

.create-discount-fab .v-icon {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.create-discount-fab:hover .v-icon {
    transform: rotate(90deg);
}

/* Tooltip Styles */
.create-discount-tooltip {
    --v-overlay-opacity: 0.95;
}

.tooltip-content {
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    padding: 4px 8px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .create-discount-fab {
        bottom: 24px !important;
        right: 24px !important;
        transform: scale(0.9) !important;
    }

    .create-discount-fab:hover {
        transform: translateY(-4px) scale(0.95) !important;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .create-discount-fab {
        background: linear-gradient(135deg, #8b6dff 0%, #ff7b9d 100%) !important;
        box-shadow:
            0 4px 24px rgba(123, 97, 255, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.15) !important;
    }
}

/* Animation keyframes */
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

.create-discount-fab {
    animation: pulse 2s infinite ease-in-out;
}

/* Accessibility focus styles */
.create-discount-fab:focus-visible {
    outline: 2px solid #7b61ff;
    outline-offset: 4px;
}

/* High contrast mode support */
@media (forced-colors: active) {
    .create-discount-fab {
        border: 2px solid CanvasText !important;
    }
}

/* Enhanced Filter Button Styles */
.filter-trigger-btn {
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    background: rgba(123, 97, 255, 0.12) !important;
    border: 1px solid rgba(123, 97, 255, 0.2) !important;
    backdrop-filter: blur(8px);
    box-shadow:
        0 4px 16px rgba(26, 34, 54, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.1) !important;
}

.filter-btn-backdrop {
    position: absolute;
    inset: -8px;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 70%);
    border-radius: 50%;
    z-index: -1;
    opacity: 0.8;
    backdrop-filter: blur(4px);
}

.filter-trigger-btn:hover {
    background: rgba(123, 97, 255, 0.15) !important;
    transform: translateY(-2px);
    box-shadow:
        0 6px 20px rgba(26, 34, 54, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.2) !important;
}

.filter-trigger-btn:hover .filter-btn-backdrop {
    opacity: 1;
    transform: scale(1.1);
}

.filter-active {
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.2) 0%, rgba(255, 111, 145, 0.2) 100%) !important;
    border: 1px solid rgba(123, 97, 255, 0.3) !important;
    box-shadow:
        0 4px 20px rgba(123, 97, 255, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.2) !important;
}

.filter-active .filter-btn-backdrop {
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 70%);
    opacity: 0.9;
}

/* Mobile specific enhancements */
@media (max-width: 600px) {
    .filter-trigger-btn {
        position: fixed !important;
        bottom: 100px !important;
        right: 24px !important;
        z-index: 99 !important;
        width: 56px !important;
        height: 56px !important;
        background: rgba(123, 97, 255, 0.15) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        box-shadow:
            0 4px 20px rgba(26, 34, 54, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.15) !important;
    }

    .filter-btn-backdrop {
        background: radial-gradient(circle at center, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 70%);
        opacity: 0.9;
    }

    .filter-trigger-btn:hover {
        transform: translateY(-3px) scale(1.05) !important;
    }

    .filter-trigger-btn:active {
        transform: translateY(0) scale(0.95) !important;
    }
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
    .filter-trigger-btn {
        background: rgba(123, 97, 255, 0.15) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1) !important;
    }

    .filter-btn-backdrop {
        background: radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 70%);
    }

    .filter-active {
        background: linear-gradient(135deg, rgba(123, 97, 255, 0.25) 0%, rgba(255, 111, 145, 0.25) 100%) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
    }

    .filter-active .filter-btn-backdrop {
        background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 70%);
    }
}

/* High contrast mode */
@media (forced-colors: active) {
    .filter-trigger-btn {
        border: 2px solid CanvasText !important;
        background: Canvas !important;
    }

    .filter-btn-backdrop {
        display: none;
    }

    .filter-active {
        border: 3px solid CanvasText !important;
    }
}

/* Animation for filter button */
@keyframes filterPulse {
    0% {
        box-shadow:
            0 4px 16px rgba(26, 34, 54, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    50% {
        box-shadow:
            0 4px 24px rgba(123, 97, 255, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.2);
    }

    100% {
        box-shadow:
            0 4px 16px rgba(26, 34, 54, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.1);
    }
}

.filter-trigger-btn {
    animation: filterPulse 2s infinite ease-in-out;
}

.filter-active {
    animation: none;
}

/* Search Input Styles */
.premium-search-input {
    border-radius: 12px !important;
    background: rgba(245, 247, 255, 0.7) !important;
    transition: all 0.3s ease;
}

.premium-search-input:hover {
    background: rgba(245, 247, 255, 0.9) !important;
}

.premium-search-input:focus-within {
    background: #fff !important;
    box-shadow: 0 2px 12px rgba(123, 97, 255, 0.1) !important;
}

/* Updated Filter Panel Styles */
.filter-panel {
    background: #f8fafc !important;
    border-left: 1px solid rgba(123, 97, 255, 0.12) !important;
    box-shadow: -4px 0 24px rgba(26, 34, 54, 0.15) !important;
}

.filter-panel-header {
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.08) 0%, rgba(255, 111, 145, 0.08) 100%);
    border-bottom: 1px solid rgba(123, 97, 255, 0.12);
}

.filter-section {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px !important;
    border: 1px solid rgba(123, 97, 255, 0.08);
    transition: all 0.3s ease;
}

.filter-section:hover {
    background: #fff;
    border-color: rgba(123, 97, 255, 0.15);
    box-shadow: 0 4px 12px rgba(123, 97, 255, 0.08);
}

.filter-section-header {
    color: #1a2236;
    margin-bottom: 16px;
}

.filter-section-header .text-subtitle-1 {
    font-weight: 600 !important;
    color: #1a2236;
}

.filter-form .premium-input {
    border-radius: 12px !important;
    background: rgba(245, 247, 255, 0.9) !important;
    border: 1px solid rgba(123, 97, 255, 0.12) !important;
    transition: all 0.3s ease;
}

.filter-form .premium-input:hover {
    background: #fff !important;
    border-color: rgba(123, 97, 255, 0.2) !important;
}

.filter-form .premium-input:focus-within {
    background: #fff !important;
    border-color: #7b61ff !important;
    box-shadow: 0 2px 12px rgba(123, 97, 255, 0.15) !important;
}

.apply-filters-btn {
    background: linear-gradient(135deg, #7b61ff 0%, #ff6f91 100%) !important;
    color: white !important;
    font-weight: 600 !important;
    letter-spacing: 0.01em;
    height: 44px !important;
    border-radius: 12px !important;
    transition: all 0.3s ease !important;
}

.apply-filters-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(123, 97, 255, 0.25) !important;
}

.apply-filters-btn:disabled {
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.5) 0%, rgba(255, 111, 145, 0.5) 100%) !important;
    transform: none !important;
    box-shadow: none !important;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .filter-panel {
        background: #1a1a1a !important;
    }

    .filter-section {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
    }

    .filter-section:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.15);
    }

    .filter-section-header .text-subtitle-1 {
        color: #fff;
    }

    .filter-form .premium-input {
        background: rgba(255, 255, 255, 0.08) !important;
        border-color: rgba(255, 255, 255, 0.12) !important;
    }

    .filter-form .premium-input:hover {
        background: rgba(255, 255, 255, 0.12) !important;
        border-color: rgba(255, 255, 255, 0.2) !important;
    }
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .premium-table-header {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 16px;
        padding: 16px !important;
    }

    .premium-table-header>div:last-child {
        width: 100%;
        flex-direction: column;
        gap: 12px;
    }

    .premium-search-input {
        width: 100% !important;
        max-width: none !important;
    }

    .filter-bottom-sheet-content {
        border-radius: 20px 20px 0 0 !important;
    }

    .filter-section {
        padding: 12px;
        margin-bottom: 16px !important;
    }
}

/* Accessibility */
.filter-trigger-btn:focus-visible {
    outline: 2px solid #7b61ff;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(123, 97, 255, 0.2) !important;
}

/* High contrast mode */
@media (forced-colors: active) {

    .filter-trigger-btn,
    .filter-panel,
    .filter-bottom-sheet-content,
    .premium-search-input,
    .filter-form .premium-input {
        border: 2px solid CanvasText !important;
    }

    .filter-panel-header,
    .filter-bottom-sheet-content .v-card-title {
        border-bottom: 2px solid CanvasText !important;
    }
}
</style>