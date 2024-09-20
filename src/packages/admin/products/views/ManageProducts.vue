<template>
  <section>
    <v-card elevation="0">
      <div style="display: flex; align-items: center; position: relative">
        <v-card-title style="width: 80%; display: flex; align-items: center">
          <v-btn variant="text"><v-icon>mdi-arrow-left</v-icon></v-btn>
          <h5 style="width: 80%; text-align: center; font-weight: 700">Product Managment</h5>
        </v-card-title>
        <v-card-actions style="display: flex; align-items: center">
          <v-btn
            icon
            :color="ColorHelper.colorsHelper('primary')"
            block
            size="large"
            id="product_actions_activator_btn"
            @click="productStore.setProductActionsView"
          >
            <v-icon id="product_actions_activator_btn_icon">mdi-dots-vertical</v-icon>
          </v-btn>
        </v-card-actions>
        <div
          style="
            position: absolute;
            right: 12%;
            top: 20%;
            z-index: 999999999999999;
            background-color: aliceblue;
            padding: 0.8rem 0;
            border-radius: 0.4rem;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
            min-height: 8rem;
          "
          v-if="showProductActions"
        >
          <v-list-item
            v-for="action in productActions"
            :key="action.id"
            :value="action"
            :color="ColorHelper.colorsHelper('primary')"
            variant="plain"
            nav
            :to="action.path"
          >
            <template v-slot:prepend>
              <v-icon :icon="action.icon"></v-icon>
            </template>
            <!--disable rule for this line-->
            <v-list-item-title v-text="action.text"></v-list-item-title>
          </v-list-item>
        </div>
      </div>
      <v-card-text>
        <v-list>
          <v-list-item v-for="category in categories" :key="category.cid">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 2.4rem 0;
              "
            >
              <div>
                <v-list-item-title>{{ category.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ products.filter((product) => category.cid === product.category).length }} items
                </v-list-item-subtitle>
              </div>
              <v-list-item-action>
                <v-btn variant="text" @click="viewCategory(category.cid)">
                  <v-icon size="25">mdi-chevron-right</v-icon>
                </v-btn>
              </v-list-item-action>
            </div>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </section>
</template>

<script setup>
import { useProductStore, useSetupStore } from '@/store'
import ColorHelper from '@/util/ColorHelper'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
// import { useRouter } from 'vue-router'

// ROUTE & ROUTER
// const router = useRouter()

// STORES & STORE ACTIONS
const setupStore = useSetupStore()
const productStore = useProductStore()
const { categories } = storeToRefs(setupStore)
const { products, productActions, showProductActions } = storeToRefs(productStore)

// HOOKS
onMounted(() => {
  // Check if user is authenticated
  // // Check if user has required permissions
  // if (!setupStore.userHasPermission('manage_products')) {
  //   router.push({ name: 'home' })
  // }
  // // Check if product actions view is set
  // if (!productStore.productActionsView) {
  //   productStore.setProductActionsView()
  // }
  // // Check if product actions are loaded
  // if (!productActions.value.length) {
  //   productStore.getProductActions()
  // }
  // // Check if product actions are shown
  // if (!showProductActions) {
  //   productStore.setShowProductActions()
  // }
  productStore.getProducts()
  setupStore.getCategories()
})

// FUCNTIONS
function viewCategory() {}
</script>