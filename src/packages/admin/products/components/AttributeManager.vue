<template>
    <div class="attribute-manager">
        <!-- Header -->
        <div class="mb-6" style="display:flex; flex-direction: column;">
            <div>
                <div class="text-h6 font-weight-bold">Product Attributes</div>
                <div class="text-subtitle-2 text-medium-emphasis">
                    Manage attributes and their values for product variants
                </div>
            </div>
            <v-btn class="primary-gradient-button ma-4" variant="elevated" prepend-icon="mdi-plus"
                @click="openCreateDialog">
                New Attribute
            </v-btn>
        </div>

        <!-- Attributes List -->
        <v-card class="attribute-list mb-6" variant="outlined">
            <v-list>
                <v-list-item v-for="attribute in attributes" :key="attribute.id" :value="attribute"
                    class="attribute-list-item">
                    <template v-slot:prepend>
                        <v-avatar :color="attribute.color || 'primary'" size="36" class="attribute-icon">
                            <v-icon color="white" size="small">
                                {{ attribute.icon || 'mdi-tag' }}
                            </v-icon>
                        </v-avatar>
                    </template>

                    <v-list-item-title class="text-subtitle-1 font-weight-medium">
                        {{ attribute.name }}
                    </v-list-item-title>

                    <v-list-item-subtitle class="text-caption">
                        {{ attribute.values.length }} values
                    </v-list-item-subtitle>

                    <template v-slot:append>
                        <div class="d-flex align-center gap-2">
                            <v-btn icon="mdi-pencil" variant="text" color="primary" size="small"
                                @click="editAttribute(attribute)" />
                            <v-btn icon="mdi-delete" variant="text" color="error" size="small"
                                @click="confirmDelete(attribute)" />
                        </div>
                    </template>
                </v-list-item>
            </v-list>
        </v-card>

        <!-- Attribute Values -->
        <v-expand-transition>
            <div v-if="selectedAttribute" class="attribute-values">
                <div class="d-flex align-center justify-space-between mb-4">
                    <div>
                        <div class="text-subtitle-1 font-weight-medium">
                            Values for {{ selectedAttribute.name }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                            Add or remove values for this attribute
                        </div>
                    </div>
                    <v-btn color="primary" variant="tonal" prepend-icon="mdi-plus" @click="openValueDialog">
                        Add Value
                    </v-btn>
                </div>

                <v-card class="value-list" variant="outlined">
                    <v-list>
                        <v-list-item v-for="value in selectedAttribute.values" :key="value.id" :value="value"
                            class="value-list-item">
                            <template v-slot:prepend>
                                <v-chip :color="selectedAttribute.color || 'primary'" variant="tonal" size="small">
                                    {{ value.name }}
                                </v-chip>
                            </template>

                            <v-list-item-subtitle class="text-caption">
                                {{ value.description || 'No description' }}
                            </v-list-item-subtitle>

                            <template v-slot:append>
                                <div class="d-flex align-center gap-2">
                                    <v-btn icon="mdi-pencil" variant="text" color="primary" size="small"
                                        @click="editValue(value)" />
                                    <v-btn icon="mdi-delete" variant="text" color="error" size="small"
                                        @click="confirmDeleteValue(value)" />
                                </div>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-card>
            </div>
        </v-expand-transition>

        <!-- Dialogs -->
        <v-dialog v-model="createDialog" max-width="500px">
            <v-card class="rounded-xl pa-6">
                <v-card-title class="text-h5 font-weight-bold">
                    {{ editingAttribute ? 'Edit Attribute' : 'New Attribute' }}
                </v-card-title>
                <v-card-text>
                    <v-form ref="attributeFormRef" @submit.prevent="saveAttribute">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="attributeForm.name" label="Attribute Name" :rules="rules.name"
                                    variant="outlined" density="comfortable" class="mb-4" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="attributeForm.description" label="Description" variant="outlined"
                                    density="comfortable" class="mb-4" rows="2" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-autocomplete v-model="attributeForm.icon" :items="iconOptions" label="Icon"
                                    variant="outlined" density="comfortable" class="mb-4">
                                    <template v-slot:item="{ item }">
                                        <v-list-item>
                                            <template v-slot:prepend>
                                                <v-icon :icon="item.raw" />
                                            </template>
                                            <v-list-item-title>{{ item.raw }}</v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-color-picker v-model="attributeForm.color" mode="hex" hide-inputs class="mb-4" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" @click="createDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveAttribute" :loading="saving" :disabled="!isFormValid">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="valueDialog" max-width="500px">
            <v-card class="rounded-xl pa-6">
                <v-card-title class="text-h5 font-weight-bold">
                    {{ editingValue ? 'Edit Value' : 'New Value' }}
                </v-card-title>
                <v-card-text>
                    <v-form ref="valueFormRef" @submit.prevent="saveValue">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="valueForm.name" label="Value Name" :rules="rules.valueName"
                                    variant="outlined" density="comfortable" class="mb-4" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="valueForm.description" label="Description" variant="outlined"
                                    density="comfortable" class="mb-4" rows="2" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" @click="valueDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="saveValue" :loading="saving" :disabled="!isValueFormValid">
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
                    Are you sure you want to delete
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
import useGlobal from '@/composables/useGlobal';

// Emits
const emit = defineEmits(['close', 'update']);

// Stores
const productStore = useProductStore();
const { attributes } = storeToRefs(productStore);

// Form refs
const attributeFormRef = ref(null);
const valueFormRef = ref(null);
const saving = ref(false);
const deleting = ref(false);

// State
const selectedAttribute = ref(null);
const editingAttribute = ref(null);
const editingValue = ref(null);
const itemToDelete = ref(null);

// Compsables
const { iconOptions } = useGlobal();

// Dialogs
const createDialog = ref(false);
const valueDialog = ref(false);
const deleteDialog = ref(false);

// Form state
const attributeForm = ref({
    name: '',
    description: '',
    icon: 'mdi-tag',
    color: '#7b61ff',
});

const valueForm = ref({
    name: '',
    description: '',
});



// Validation rules
const rules = {
    name: [(v) => !!v || 'Attribute name is required'],
    valueName: [(v) => !!v || 'Value name is required'],
};

// Computed
const isFormValid = computed(() => {
    return attributeFormRef.value?.validate() ?? false;
});

const isValueFormValid = computed(() => {
    return valueFormRef.value?.validate() ?? false;
});

// Methods
function openCreateDialog() {
    editingAttribute.value = null;
    attributeForm.value = {
        name: '',
        description: '',
        icon: 'mdi-tag',
        color: '#7b61ff',
    };
    createDialog.value = true;
}

function editAttribute(attribute) {
    editingAttribute.value = attribute;
    attributeForm.value = { ...attribute };
    createDialog.value = true;
}

function openValueDialog() {
    editingValue.value = null;
    valueForm.value = {
        name: '',
        description: '',
    };
    valueDialog.value = true;
}

function editValue(value) {
    editingValue.value = value;
    valueForm.value = { ...value };
    valueDialog.value = true;
}

function confirmDelete(item) {
    itemToDelete.value = item;
    deleteDialog.value = true;
}

function confirmDeleteValue(value) {
    itemToDelete.value = {
        ...value,
        type: 'value',
        attributeId: selectedAttribute.value.id,
    };
    deleteDialog.value = true;
}

async function saveAttribute() {
    try {
        const { valid } = await attributeFormRef.value.validate();
        if (!valid) {
            useToast().error('Please fill in all required fields');
            return;
        }

        saving.value = true;

        if (editingAttribute.value) {
            // Update existing attribute
            await productStore.updateAttribute({
                ...editingAttribute.value,
                ...attributeForm.value,
            });
            useToast().success('Attribute updated successfully');
        } else {
            // Create new attribute
            await productStore.createAttribute(attributeForm.value);
            useToast().success('Attribute created successfully');
        }

        createDialog.value = false;
        emit('update', attributes.value);
    } catch (error) {
        console.error('Error saving attribute:', error);
        useToast().error('Failed to save attribute');
    } finally {
        saving.value = false;
    }
}

async function saveValue() {
    try {
        const { valid } = await valueFormRef.value.validate();
        if (!valid) {
            useToast().error('Please fill in all required fields');
            return;
        }

        saving.value = true;

        if (editingValue.value) {
            // Update existing value
            await productStore.updateAttributeValue({
                ...editingValue.value,
                ...valueForm.value,
                attributeId: selectedAttribute.value.id,
            });
            useToast().success('Value updated successfully');
        } else {
            // Create new value
            await productStore.createAttributeValue({
                ...valueForm.value,
                attributeId: selectedAttribute.value.id,
            });
            useToast().success('Value created successfully');
        }

        valueDialog.value = false;
        emit('update', attributes.value);
    } catch (error) {
        console.error('Error saving value:', error);
        useToast().error('Failed to save value');
    } finally {
        saving.value = false;
    }
}

async function confirmDeleteAction() {
    try {
        deleting.value = true;

        if (itemToDelete.value.type === 'value') {
            await productStore.deleteAttributeValue({
                id: itemToDelete.value.id,
                attributeId: itemToDelete.value.attributeId,
            });
            useToast().success('Value deleted successfully');
        } else {
            await productStore.deleteAttribute(itemToDelete.value.id);
            useToast().success('Attribute deleted successfully');
        }

        deleteDialog.value = false;
        emit('update', attributes.value);
    } catch (error) {
        console.error('Error deleting item:', error);
        useToast().error('Failed to delete item');
    } finally {
        deleting.value = false;
    }
}

// Lifecycle
onMounted(() => {
    productStore.getAttributes();
});
</script>

<style scoped>
.attribute-manager {
    padding: 24px;
}

.attribute-list,
.value-list {
    border-radius: 12px !important;
    overflow: hidden;
}

.attribute-list-item,
.value-list-item {
    border-radius: 8px !important;
    margin: 4px 8px !important;
    transition: all 0.2s ease !important;
}

.attribute-list-item:hover,
.value-list-item:hover {
    background: rgba(123, 97, 255, 0.04) !important;
}

.attribute-icon {
    border: 2px solid rgba(255, 255, 255, 0.1);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {

    .attribute-list,
    .value-list {
        background: #1a1a1a !important;
        border-color: rgba(255, 255, 255, 0.12) !important;
    }

    .attribute-list-item:hover,
    .value-list-item:hover {
        background: rgba(255, 255, 255, 0.04) !important;
    }
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .attribute-manager {
        padding: 16px;
    }
}

/* Accessibility */
.attribute-list-item:focus-visible,
.value-list-item:focus-visible {
    outline: 2px solid #7b61ff;
    outline-offset: 2px;
}

/* High contrast mode */
@media (forced-colors: active) {

    .attribute-list,
    .value-list {
        border: 2px solid CanvasText !important;
    }
}
</style>