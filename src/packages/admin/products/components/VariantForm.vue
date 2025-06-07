<template>
    <div class="w-full max-w-xl mx-auto pa-6 bg-white rounded-lg shadow-lg">
        <button @click="() => globalEventBus.emit('closeVariantForm')" aria-label="Close"
            class="absolute top-4 right-4 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-black rounded-full">
            <XCircle />
        </button>
        <h2 class="text-xl font-semibold text-center mb-6" id="form-title">
            {{ isVariantEdit ? 'Edit Variant' : 'Add Variant' }}
        </h2>

        <form @submit.prevent="updateVariant" aria-labelledby="form-title">
            <!-- Variant Name -->
            <div class="mb-4">
                <label for="variantName" class="block text-sm font-medium text-gray-700">Variant Name</label>
                <input type="text" id="variantName" v-model="form.variantName"
                    class="mt-1 block w-full h-12 rounded-md border border-gray-300 px-3 text-sm focus:ring-black focus:border-black"
                    required aria-required="true" />
            </div>

            <!-- SKU -->
            <div class="mb-4">
                <label for="sku" class="block text-sm font-medium text-gray-700">SKU</label>
                <input type="text" id="sku" v-model="form.sku"
                    class="mt-1 block w-full h-12 rounded-md border border-gray-300 px-3 text-sm focus:ring-black focus:border-black"
                    required aria-required="true" />
            </div>

            <!-- Price & Stock -->
            <div class="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
                    <div class="relative mt-1">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                        <input type="number" id="price" v-model.number="form.price"
                            class="pl-7 pr-3 h-12 rounded-md w-full border border-gray-300 text-sm focus:ring-black focus:border-black"
                            required aria-required="true" min="0" />
                    </div>
                </div>

                <div>
                    <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
                    <input type="number" id="stock" v-model.number="form.stock"
                        class="mt-1 block w-full h-12 rounded-md border border-gray-300 px-3 text-sm focus:ring-black focus:border-black"
                        required aria-required="true" min="0" />
                </div>
            </div>

            <hr class="my-6 border-gray-200" />

            <!-- Attributes -->
            <div class="mb-4" v-if="form?.attributes?.length">
                <h3 class="text-sm font-semibold mb-2">Attributes</h3>
                <div class="space-y-4">
                    <div v-for="(attribute, index) in form.attributes" :key="index" class="w-full">
                        <label :for="`attribute-${index}`" class="block text-sm font-medium text-gray-700 mb-1">
                            {{ attribute.name }}
                        </label>
                        <select :id="`attribute-${index}`" v-model="selectedAttributes[attribute.name]"
                            class="block w-full h-12 px-3 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-black focus:border-black"
                            :placeholder="`Select ${attribute.name}`">
                            <option selected value="">Select {{ attribute.name }}
                            </option>
                            <option v-for="option in attribute.value" :key="option.value" :value="option.value">
                                {{ option.value }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Submit -->
            <div>
                <button type="submit"
                    class="w-full h-12 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    aria-label="Update Variant">
                    {{ isVariantEdit ? 'Update Variant' : 'Add Variant' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { XCircle } from 'lucide-vue-next'
import { inject, reactive, ref } from 'vue'
import { globalEventBus } from 'vue-toastification'

// Injections
const isVariantEdit = inject('isVariantEdit')
// Macros


const form = reactive({
    variantName: '',
    sku: '',
    price: 0,
    stock: 0,
    attributes: [],
})
const selectedAttributes = ref({})

function updateVariant() {
    console.log('Updating Variant:', form)
}
</script>
