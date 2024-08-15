<template>
    <section>
      <v-card elevation="0">
        <v-card-title style="display: flex; align-items: center; margin: 0.8rem 0">
          <v-btn variant="text" @click="() => router.back()"><v-icon>mdi-arrow-left</v-icon></v-btn>
          <h4 style="width: 80%; text-align: center">Add a new category</h4>
        </v-card-title>
        <v-card-text>
          <v-form ref="categoryForm">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="category.name"
                  label="Category Name"
                  :rules="rules.name"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="category.description"
                  label="Category Description"
                  :rules="rules.description"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-file-input
                  :rules="[(v) => v.length <= 1 || 'You can only upload up to 1 images']"
                  accept="image/*"
                  label="Upload Category Image"
                  chips
                  counter
                  variant="outlined"
                  @change="productImageUpload"
                  @click:clear="ImageUploadcleared"
                />
              </v-col>
              <v-col cols="12">
                <v-container v-if="category.images.length" >
                  <v-row justify="center">
                    <v-col cols="auto" v-for="(file, index) in category.images" :key="index">
                      <img :src="file.preview" width="150" height="150" contain  :key="imagePreview" alt="Uploaded product"/>
                    </v-col>
                  </v-row>
                </v-container>
                <v-btn
                  :color="ColorHelper.colorsHelper('primary')"
                  @click="addCategory"
                  block
                  size="large"
                >
                  <v-icon class="mr-3">mdi-plus</v-icon>
                  <span>Add Category</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </section>
  </template>
  
  <script setup>
  import { useProductStore } from '@/store'
  import ColorHelper from '@/util/ColorHelper'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vue-toastification'
  
  // ROUTE & ROUTER
  const router = useRouter()
  
  // STORES AND STORES ACTIONS
  const productStore = useProductStore()
  
  // COMPONENT REFS/INTERAL STATE
  const category = ref({
    name: '',
    description: '',
    images: []
  })
  const imagePreview = ref(1);
  const categoryForm = ref(null);
  
  // COMPUTED
  const rules = computed(()=>{
    return {
      name: [(v) =>!!v || 'Category Name is required'],
      description: [
        (v) =>!!v || 'Category Description is required',
        (v) => v.length <= 2000 || 'Description must not exceed 1000 characters'
      ]
    }
  })
  
  // HOOKS
  onMounted(()=>{
    // Initial image preview
    imagePreview.value = 1;
    setInterval(()=> imagePreview.value++, 10);
  })
  // COMPONENT METHONDS
  async function addCategory() {
    try {
      const { valid } = await categoryForm.value.validate();
      if (!valid) {
        useToast().error('Category information is not valid');
        return
      }
      const {images, ...categoryPayload} = category.value;
      productStore.createCategory(categoryPayload)
      .then((category)=> {
        category.value = {};
        const formData = new FormData();
        images.forEach((file) => {
          formData.append('image', file)
        })
        formData.append('id', category.data.cid);
        formData.append('type', 'Category');
        productStore.uploadProductImages(formData, 'category')
      })
      .catch((error) => {
        console.error(error);
        useToast().error('Failed to add category');
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
      category.value.images = filesArray
    } catch (error) {
      useToast().error(error.message)
    }
  }
  function ImageUploadcleared() {
    try {
        category.value.images = []
      return
    } catch (error) {
      useToast().error(error.message)
    }
  }
  </script>