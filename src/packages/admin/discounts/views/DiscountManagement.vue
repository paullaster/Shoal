<template>
    <v-container fluid class="pa-0 discount-management">
        <!-- Header Section with Gradient Background -->
        <v-row class="header-section py-6 px-4" align="center" justify="space-between">
            <v-col cols="12" md="6">
                <h1 class="text-h4 font-weight-bold white--text animate__animated animate__fadeIn">
                    Discount Management
                </h1>
                <div
                    class="text-subtitle-1 white--text opacity-80 mt-2 animate__animated animate__fadeIn animate__delay-1s">
                    Manage all your discounts efficiently and creatively.
                </div>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-end align-center">
                <v-btn color="pink" class="white--text elevation-3 rounded-lg px-6" size="large"
                    @click="openCreateDialog">
                    <v-icon start>mdi-plus</v-icon>
                    Create Discount
                </v-btn>
            </v-col>
        </v-row>

        <!-- Filters and Search -->
        <v-row class="filter-section px-4 py-4 d-flex justify-center align-center"
            style="margin-top: -48px; z-index: 2; position: relative;">
            <v-col cols="12" md="10" lg="8">
                <v-card class="premium-filter-card glassy-card px-6 py-4" elevation="10">
                    <v-row class="d-flex align-center" dense>
                        <v-col cols="12" md="4" class="mb-2 mb-md-0">
                            <v-text-field v-model="search" label="Search Discounts" prepend-inner-icon="mdi-magnify"
                                variant="solo-filled" density="comfortable" clearable hide-details
                                class="premium-input" />
                        </v-col>
                        <v-col cols="12" md="4" class="mb-2 mb-md-0">
                            <v-select v-model="sortBy" :items="sortOptions" label="Sort By" variant="solo-filled"
                                density="comfortable" hide-details class="premium-input" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select v-model="filterStatus" :items="statusOptions" label="Filter by Status"
                                variant="solo-filled" density="comfortable" hide-details class="premium-input" />
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <!-- Data Table with Modern Card Design -->
        <v-row class="px-4">
            <v-col cols="12">
                <v-card class="premium-table-card pa-0" elevation="8">
                    <div class="premium-table-header d-flex align-center px-6 py-4">
                        <v-icon color="primary" size="36" class="mr-3">mdi-tag-multiple</v-icon>
                        <div>
                            <div class="text-h5 font-weight-bold premium-table-title">Discounts Overview</div>
                            <div class="premium-table-subtitle">All discounts at a glance. Use search, sort, or filter
                                for quick access.</div>
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
                                size="small" class="premium-chip">
                                {{ item.status }}
                            </v-chip>
                        </template>
                        <template #[`item.amount`]="{ item }">
                            <span class="premium-amount"
                                :class="item.type === 'Percentage' ? 'amount-percentage' : 'amount-fixed'">
                                <v-icon v-if="item.type === 'Percentage'" color="primary" size="18"
                                    class="mr-1">mdi-percent</v-icon>
                                <v-icon v-else color="deep-purple" size="18" class="mr-1">mdi-currency-usd</v-icon>
                                <span>{{ item.type === 'Percentage' ? `${item.amount}%` : `$${item.amount}` }}</span>
                            </span>
                        </template>
                        <template #[`item.type`]="{ item }">
                            <v-chip :color="item.type === 'Percentage' ? 'primary' : 'deep-purple'"
                                class="premium-type-chip" size="small" variant="elevated">
                                <v-icon start size="16">{{ item.type === 'Percentage' ? 'mdi-percent' :
                                    'mdi-currency-usd' }}</v-icon>
                                {{ item.type }}
                            </v-chip>
                        </template>
                        <template #[`item.usageLimit`]="{ item }">
                            <v-chip
                                :color="item.usageLimit > 100 ? 'success' : item.usageLimit > 0 ? 'warning' : 'grey'"
                                class="premium-usage-chip" size="small" variant="elevated">
                                <v-icon start size="16">mdi-counter</v-icon>
                                <span v-if="item.usageLimit > 0">{{ item.usageLimit }} left</span>
                                <span v-else>Unlimited</span>
                            </v-chip>
                        </template>
                        <template #[`item.actions`]="{ item }">
                            <div class="premium-actions-row">
                                <v-btn icon color="primary" class="mr-1" variant="text"
                                    @click="viewDetails(item)"><v-icon>mdi-eye</v-icon></v-btn>
                                <v-btn icon color="deep-purple" class="mr-1" variant="text"
                                    @click="editDiscount(item)"><v-icon>mdi-pencil</v-icon></v-btn>
                                <v-btn icon color="error" variant="text"
                                    @click="deleteDiscount(item)"><v-icon>mdi-delete</v-icon></v-btn>
                            </div>
                        </template>
                        <template #no-data>
                            <v-row class="pa-8" align="center" justify="center">
                                <v-col cols="12" class="text-center">
                                    <v-icon size="48" color="grey">mdi-tag-off-outline</v-icon>
                                    <div class="text-h6 mt-2">No Discounts Found</div>
                                    <div class="text-body-2">
                                        Click "Create Discount" to add your first discount.
                                    </div>
                                </v-col>
                            </v-row>
                        </template>
                    </v-data-table>
                    <div class="d-flex justify-center mt-4 pb-4">
                        <v-btn :disabled="page === 1" @click="page--" class="mr-2" color="primary"
                            variant="tonal">Previous</v-btn>
                        <span class="px-2 align-self-center font-weight-bold">Page {{ page }} of {{ Math.max(1,
                            Math.ceil(totalDiscounts /
                                pageSize)) }}</span>
                        <v-btn :disabled="page >= Math.ceil(totalDiscounts / pageSize)" @click="page++" color="primary"
                            variant="tonal">Next</v-btn>
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
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
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

// Responsive: detect mobile
const isMobile = ref(false);
if (typeof window !== 'undefined') {
    const checkMobile = () => {
        isMobile.value = window.innerWidth < 900;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
}

const mobileList = ref(null);
const infinitePage = ref(1);
const infiniteLoading = ref(false);
const infiniteDone = ref(false);

// Fetch discounts from server (mocked)
async function fetchDiscounts({ append = false } = {}) {
    if (isMobile.value && append) infiniteLoading.value = true;
    else loading.value = true;
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
        if (isMobile.value) {
            // Infinite scroll: append next page
            const start = (infinitePage.value - 1) * pageSize.value;
            const next = filtered.slice(start, start + pageSize.value);
            if (append) {
                if (next.length === 0) infiniteDone.value = true;
                else discounts.value = discounts.value.concat(next);
            } else {
                discounts.value = next;
                infiniteDone.value = false;
            }
        } else {
            // Desktop: normal pagination
            discounts.value = filtered.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
        }
    } catch (e) {
        error.value = 'Failed to load discounts.';
    } finally {
        if (isMobile.value && append) infiniteLoading.value = false;
        else loading.value = false;
    }
}

// Infinite scroll handler for mobile
async function handleMobileScroll() {
    if (infiniteLoading.value || infiniteDone.value) return;
    const el = mobileList.value?.$el || mobileList.value;
    if (!el) return;
    const scrollBottom = el.scrollTop + el.clientHeight;
    if (scrollBottom >= el.scrollHeight - 50) {
        infinitePage.value++;
        await fetchDiscounts({ append: true });
    }
}

// Watchers
watch([page, pageSize, search, sortBy, filterStatus, isMobile], async ([, , , , , mobile]) => {
    if (mobile) {
        infinitePage.value = 1;
        discounts.value = [];
        await fetchDiscounts();
        await nextTick();
        setTimeout(() => {
            const el = mobileList.value?.$el || mobileList.value;
            if (el) el.addEventListener('scroll', handleMobileScroll);
        }, 100);
    } else {
        await fetchDiscounts();
    }
});

onMounted(async () => {
    await fetchDiscounts();
    if (isMobile.value) {
        await nextTick();
        setTimeout(() => {
            const el = mobileList.value?.$el || mobileList.value;
            if (el) el.addEventListener('scroll', handleMobileScroll);
        }, 100);
    }
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
    padding-bottom: 32px;
}

.header-section {
    background: linear-gradient(120deg, #1a2236 0%, #2d3652 100%);
    border-radius: 0 0 32px 32px;
    box-shadow: 0 8px 32px rgba(26, 34, 54, 0.18);
    position: relative;
    overflow: hidden;
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

.filter-section {
    margin: 0 0 24px 0;
}

.premium-filter-card {
    background: rgba(255, 255, 255, 0.85);
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(123, 97, 255, 0.10), 0 1.5px 8px rgba(26, 34, 54, 0.07);
    border: 1px solid #e3e8ee;
    backdrop-filter: blur(8px);
    transition: box-shadow 0.3s, border 0.3s;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.premium-input {
    border-radius: 12px !important;
    background: rgba(245, 247, 255, 0.7) !important;
    box-shadow: 0 1px 4px rgba(123, 97, 255, 0.04);
    font-size: 1.08rem;
}

.premium-filter-card .v-field__outline {
    border-radius: 12px !important;
}

@media (max-width: 900px) {
    .premium-filter-card {
        border-radius: 12px;
        padding: 10px 4px !important;
    }

    .premium-input {
        font-size: 0.98rem;
    }
}

@media (max-width: 600px) {
    .premium-filter-card {
        border-radius: 8px;
        padding: 8px 2px !important;
    }

    .premium-input {
        font-size: 0.92rem;
    }
}

.premium-table-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(26, 34, 54, 0.10);
    overflow: hidden;
    border: 1px solid #e3e8ee;
}

.premium-table-header {
    background: linear-gradient(90deg, #1a2236 0%, #2d3652 100%);
    color: #fff;
    border-bottom: 1px solid #e3e8ee;
}

.premium-table-title {
    font-size: 1.5rem;
    font-weight: 700;
}

.premium-table-subtitle {
    font-size: 1rem;
    opacity: 0.8;
}

.premium-table {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(26, 34, 54, 0.10);
    overflow: hidden;
    border: 1px solid #e3e8ee;
}

.premium-table :deep(.v-data-table__wrapper) {
    overflow-x: auto;
}

.premium-table :deep(.v-data-table__tr:nth-child(even)) {
    background: #f4f8fd !important;
    /* soft blue */
}

.premium-table :deep(.v-data-table__tr:nth-child(odd)) {
    background: #fff !important;
}

.premium-table :deep(.v-data-table__tr) {
    transition: background-color 0.3s, box-shadow 0.3s, border-left 0.3s;
    border-left: 4px solid transparent;
}

.premium-table :deep(.v-data-table__tr:hover) {
    background: #f0eaff !important;
    border-left: 4px solid #7b61ff;
    box-shadow: 0 2px 12px rgba(123, 97, 255, 0.08);
}

.premium-table :deep(.v-data-table__th),
.premium-table :deep(.v-data-table__td) {
    font-size: 1.08rem;
    font-family: 'Inter', 'Roboto', Arial, sans-serif;
    color: #232946;
    padding: 16px 12px !important;
    background: transparent !important;
}

.premium-table :deep(.v-data-table__th) {
    font-weight: 700;
    background: #f8fafc !important;
    border-bottom: 1px solid #e3e8ee;
}

.premium-table :deep(.v-data-table__td) {
    border-bottom: 1px solid #f0f1f6;
    padding-top: 20px !important;
    padding-bottom: 20px !important;
}

.premium-table :deep(.v-data-table__td:last-child),
.premium-table :deep(.v-data-table__th:last-child) {
    border-right: none;
}

.premium-chip {
    font-weight: 700;
    letter-spacing: 0.5px;
    border-radius: 8px;
    font-size: 1rem;
    box-shadow: 0 1px 4px rgba(26, 34, 54, 0.07);
}

.premium-sn {
    font-weight: 700;
    color: #7b61ff;
    font-size: 1.08rem;
    letter-spacing: 0.02em;
}

.premium-actions-row {
    display: flex;
    flex-direction: row;
    gap: 4px;
    justify-content: flex-start;
    align-items: center;
}

.premium-amount {
    font-weight: 700;
    color: #232946;
}

.amount-percentage {
    color: #7b61ff;
    background: rgba(123, 97, 255, 0.08);
    border-radius: 6px;
    padding: 4px 10px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
}

.amount-fixed {
    color: #e91e63;
    background: rgba(233, 30, 99, 0.08);
    border-radius: 6px;
    padding: 4px 10px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
}

.premium-type-chip {
    font-weight: 700;
    letter-spacing: 0.5px;
    border-radius: 8px;
    font-size: 0.98rem;
    box-shadow: 0 1px 4px rgba(26, 34, 54, 0.07);
    text-transform: capitalize;
}

.premium-usage-chip {
    font-weight: 700;
    border-radius: 8px;
    font-size: 0.98rem;
    box-shadow: 0 1px 4px rgba(26, 34, 54, 0.07);
    text-transform: capitalize;
}

.v-btn {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(26, 34, 54, 0.08);
    border-radius: 10px;
    font-weight: 600;
    font-size: 1.02rem;
}

.v-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 16px rgba(255, 111, 145, 0.18);
}

.v-card.rounded-xl.pa-6 {
    border-radius: 24px !important;
    box-shadow: 0 8px 32px rgba(26, 34, 54, 0.13);
    background: #fff;
    border: 1px solid #e3e8ee;
}

.v-dialog>.v-overlay__content {
    border-radius: 24px;
    overflow: visible;
    box-shadow: 0 8px 32px rgba(26, 34, 54, 0.18);
    transition: box-shadow 0.3s;
}

.opacity-80 {
    opacity: 0.8;
}

.text-h4,
.text-h5,
.text-h6 {
    letter-spacing: 0.01em;
    font-family: 'Inter', 'Roboto', Arial, sans-serif;
    color: #fff;
}

.v-data-table__th,
.v-data-table__td {
    font-size: 1.08rem;
    font-family: 'Inter', 'Roboto', Arial, sans-serif;
}

.v-data-table__td {
    padding-top: 18px !important;
    padding-bottom: 18px !important;
}

.v-icon {
    vertical-align: middle;
}

/* Dialog transitions */
.v-dialog-transition-enter-active,
.v-dialog-transition-leave-active {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-dialog-transition-enter-from,
.v-dialog-transition-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

/* Responsive tweaks */
@media (max-width: 900px) {
    .header-section {
        border-radius: 0 0 18px 18px;
    }

    .filter-section {
        margin: 0 4px 16px 4px;
    }

    .premium-table-card {
        border-radius: 12px;
    }

    .premium-table :deep(.v-data-table__th),
    .premium-table :deep(.v-data-table__td) {
        font-size: 0.98rem;
        padding: 10px 6px !important;
    }
}

@media (max-width: 600px) {
    .header-section {
        padding: 24px 8px !important;
    }

    .filter-section {
        padding: 12px 4px !important;
    }

    .premium-table-card {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(26, 34, 54, 0.08);
    }

    .premium-table :deep(.v-data-table__wrapper) {
        overflow-x: auto;
    }

    .premium-table :deep(.v-data-table__th),
    .premium-table :deep(.v-data-table__td) {
        font-size: 0.92rem;
        padding: 8px 4px !important;
    }
}
</style>