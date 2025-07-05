<template>
    <div class="rounded-2xl w-full max-w-md pa-6">
        <div class="flex justify-between items-center mb-4">
            <h2 id="add-attribute-title" class="text-lg font-semibold">{{ isAttributeEdit ? 'Edit ' : 'Add ' }}
                Attribute
            </h2>
            <button @click="onClose" aria-label="Close" class="text-gray-500 hover:text-black focus:outline-none">
                <X class="w-5 h-5" />
            </button>
        </div>

        <form @submit.prevent="saveAttribute" class="space-y-4">
            <div class="mb-4">
                <label for="attribute-name" class="block text-md font-medium text-gray-700">Attribute Name</label>
                <input id="attribute-name" v-model="attributeForm.attributeName" type="text" required
                    class="mt-1 block w-full h-12 rounded-md border border-gray-300 px-3 text-sm focus:ring-black focus:border-black"
                    aria-required="true" />
            </div>

            <div class="mb-4">
                <label for="add-values" class="block text-md font-medium text-gray-700">Add Values</label>
                <div class="flex mt-1 gap-2">
                    <input id="add-values" v-model="attributeForm.valueInput" type="text"
                        placeholder="e.g., Small, Red, Cotton"
                        class="flex-1 block w-full h-12 px-3  text-sm rounded-md border border-gray-300 shadow-sm focus:ring-black focus:border-black"
                        @keydown.enter.prevent="addValue" aria-describedby="values-description" />
                    <button @click="addValue" type="button"
                        class="bg-black text-white px-3 py-2 rounded hover:bg-gray-800 focus:outline-none"
                        aria-label="Add value">
                        <Plus class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div class="mb-4" v-if="attributeForm.values">
                <p id="values-description" class="text-sm text-gray-500">Values ({{ attributeForm.values.length }})</p>
                <div class="flex flex-wrap gap-2 mt-2">
                    <span v-for="(val, index) in attributeForm.values" :key="val + index"
                        class="inline-flex items-center px-3 py-1 bg-gray-100 text-sm rounded-full">
                        {{ val.value }}
                        <button @click="removeValue(index)" type="button"
                            class="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                            :aria-label="`Remove value ${val}`">
                            <X class="w-4 h-4" />
                        </button>
                    </span>
                </div>
            </div>

            <button type="submit"
                class="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 focus:outline-none">
                {{ isAttributeEdit ? 'Update Attribute' : 'Save Attribute' }}
            </button>
        </form>
    </div>
</template>

<script setup>
import { inject, ref, watchEffect } from 'vue'
import { X, Plus } from 'lucide-vue-next'
import { globalEventBus, useToast } from 'vue-toastification'
import useProduct from '@/composables/useProduct'

// Injections
const isAttributeEdit = inject('isAttributeEdit');
const editableAttribute = inject('editableAttribute');


// Composables
const { createAttribute, updateAttribute, deleteAttributeValue } = useProduct();

// refs
const attributeForm = ref(
    {
        attributeName: '',
        valueInput: '',
        values: [],
    }
);
const archivedAttributeValues = ref([]);

function addValue() {
    const raw = attributeForm.value.valueInput.trim()
    if (!raw) return

    raw.split(',').map(v => v.trim()).forEach(val => {
        if (val && !attributeForm.value.values.includes(val)) {
            attributeForm.value.values.push({ value: val })
        }
    })
    attributeForm.value.valueInput = ''
}

function removeValue(index) {
    archivedAttributeValues.value.push(...attributeForm.value.values.splice(index, 1));
}

async function saveAttribute() {
    try {
        if (isAttributeEdit.value) {
            const payload = {
                attributeId: editableAttribute.value.attributeId,
                values: attributeForm.value.values.filter((val) => !val.valueId),

            };
            if (attributeForm.value.attributeName !== editableAttribute.value.name) {
                payload['name'] = attributeForm.value.attributeName;
            }
            if (!payload.values.length && !payload.name) {
                return;
            }
            await updateAttribute(payload);
            // Implement optimized bulk handling logic here if needed
            useToast().success('Attribute updated successfully.');
        } else {
            const payload = {
                name: attributeForm.value.attributeName,
                values: attributeForm.value.values,
            }
            for (const prop in payload) {
                if (!payload[prop]) {
                    return useToast().error(`Please add attribute ${prop}`);
                }
            }
            await createAttribute(payload);
            // Implement optimized bulk handling logic here if needed
            useToast().success('Attribute created successfully.');
        }
        onClose();

    } catch (error) {
        useToast().error('Error creating attribute.');
    }
}

async function onClose() {
    try {
        attributeForm.value = {
            attributeName: "",
            valueInput: "",
            values: [],
        }
        globalEventBus.emit('closeVariantForm');
        if (editableAttribute?.value?.attributeId && archivedAttributeValues.value?.length) {
            await deleteAttributeValue({
                attributeId: editableAttribute.value.attributeId,
                archivedValues: archivedAttributeValues.value.filter((arch) => arch.valueId).map((val) => ({ id: val.valueId })),
            });
            this.toast.success('Attribute value(s) deleted!');
            archivedAttributeValues.value = [];
        }
    } catch (error) {
        useToast().error(error.message);
    }
}

// Effects

watchEffect(() => {
    if (isAttributeEdit && editableAttribute && Object.keys(editableAttribute).length) {
        attributeForm.value.attributeName = editableAttribute.value.name ?? "";
        attributeForm.value.values = editableAttribute.value.values ?? [];
    } else {
        attributeForm.value = {
            attributeName: "",
            valueInput: "",
            values: [],
        };
    }
});

</script>

<style scoped>
/* Improve keyboard focus accessibility */
input:focus,
button:focus {
    outline: 2px solid black;
    outline-offset: 2px;
}
</style>
