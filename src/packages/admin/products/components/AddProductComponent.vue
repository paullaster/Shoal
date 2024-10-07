<template>
  <section>
    <v-card elevation="0">
      <v-card-title style="display: flex; align-items: center; margin: 0.8rem 0">
        <v-btn variant="text" @click="() => router.back()"><v-icon>mdi-arrow-left</v-icon></v-btn>
        <h4 style="width: 80%; text-align: center">Add a new product</h4>
      </v-card-title>
      <v-card-text>
        <v-form ref="productForm">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="product.name"
                label="Product Name"
                :rules="rules.name"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="product.category"
                :items="categories"
                item-value="cid"
                item-title="name"
                label="Product Category"
                :rules="rules.category"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="product.description"
                label="Product Description"
                :rules="rules.description"
                variant="outlined"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="product.price"
                type="number"
                label="Product Price"
                :rules="rules.price"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="product.quantity"
                label="Product Quantity"
                :rules="rules.quantity"
                variant="outlined"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field 
              v-model="product.color" 
              label="Product Color" 
              variant="outlined"
              :rules="rules.color"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field 
              v-model="product.size" 
              label="Product Size" 
              variant="outlined"
              :rules="rules.size"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
              v-model="product.recipeTips" 
              label="Add link for recipe tips" 
              variant="outlined"
              :rules="rules.recipeTips"
              >
              </v-textarea>
            </v-col>
            <v-col cols="12">
              <v-file-input
                :rules="[(v) => v.length <= 2 || 'You can only upload up to 2 images']"
                accept="image/*"
                label="Upload Product Image"
                multiple
                chips
                counter
                variant="outlined"
                @change="productImageUpload"
                @click:clear="ImageUploadcleared"
                hint="You can select multiple images to upload"
              />
            </v-col>
            <v-col cols="12">
              <v-container v-if="product.images.length" >
                <v-row justify="center">
                  <v-col cols="auto" v-for="(file, index) in product.images" :key="index">
                    <img :src="file.preview" width="150" height="150" contain  :key="imagePreview" alt="Uploaded product"/>
                  </v-col>
                </v-row>
              </v-container>
              <v-btn
                :color="ColorHelper.colorsHelper('primary')"
                @click="addProduct"
                block
                size="large"
              >
                <v-icon class="mr-3">mdi-plus</v-icon>
                <span>Add Product</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </section>
</template>

<script setup>
import { useProductStore, useSetupStore } from '@/store'
import ColorHelper from '@/util/ColorHelper'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { globalEventBus, useToast } from 'vue-toastification'

// ROUTE & ROUTER
const router = useRouter()

// STORES AND STORES ACTIONS
const setupStore = useSetupStore()
const productStore = useProductStore()
const { categories } = storeToRefs(setupStore)

// COMPONENT REFS/INTERAL STATE
const product = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  quantity: 1,
  color: '',
  size: '',
  recipeTips: '',
  images: []
})
const imagePreview = ref(1);
const productForm = ref(null);

// COMPUTED
const rules = computed(()=>{
  return {
    name: [(v) =>!!v || 'Product Name is required'],
    price: [
      (v) => !!v || 'Price is required',
      (v) => v >= 0 || 'Price must be a positive number'
    ],
    quantity: [
      (v) =>!!v || 'Quantity is required',
      (v) => v % 1 === 0 || 'Quantity must be a whole number',
      (v) => v >= 1 || 'Quantity must be a positive number',
    ],
    color: [
      (v) =>!!v || 'Product Color is required'
    ],
    size: [
      (v) =>!!v || 'Product Size is required'
    ],
    category: [
      (v) =>!!v || 'Product Category is required',
    ],
    description: [
      (v) =>!!v || 'Product Description is required',
      (v) => v.length <= 2000 || 'Description must not exceed 1000 characters'
    ],
  }
})

// HOOKS
onMounted(()=>{
  // Initial image preview
  imagePreview.value = 1;
  setInterval(()=> imagePreview.value++, 10);
  globalEventBus.on('goto-manage-product', () => {
    router.push({ name: 'manageProducts'})
  })
})
// COMPONENT METHONDS
async function addProduct() {
  try {
    const { valid } = await productForm.value.validate();
    if (!valid) {
      useToast().error('Category information is not valid');
      return
    }
    const {images, ...productPayload} = product.value;
    productStore.createProduct(productPayload)
    .then((product)=> {
      product.value = {};
      const formData = new FormData();
      images.forEach((file) => {
        formData.append('image', file)
      })
      formData.append('id', product.data.pid);
      formData.append('type', 'Product');
      productStore.uploadProductImages(formData, 'product')
    })
    .catch((error) => {
      console.error(error);
      useToast().error('Failed to add product');
    });
  } catch (error) {
    useToast().error(error.message);
  }
}
function productImageUpload(files) {
  try {
    const filesArray = Array.from(files.target.files)
    filesArray.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        file.preview = event.target.result
      }
      reader.readAsDataURL(file)
    })
    product.value.images = filesArray
  } catch (error) {
    useToast().error(error.message)
  }
}
function ImageUploadcleared() {
  try {
    product.value.images = []
    return
  } catch (error) {
    useToast().error(error.message)
  }
}
</script>