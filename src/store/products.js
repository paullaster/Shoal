import { defineStore } from "pinia";
import { _request } from "@/service";
import constants from "./constants";
import { useGlobalStore } from "./global";
import { globalEventBus } from "vue-toastification";

export const useProductStore = defineStore("product", {
  state: () => {
    return {
      products: [],
      product: {},
      productActions: [
        {
          text: 'Create a new product',
          icon: 'mdi-cart-arrow-down',
          id: 'add-new-product',
          path: {name: 'createProduct'}
        },
        {
          text: 'Add new Category',
          icon:'mdi-shape-plus-outline',
          id: 'add-new-category',
          path: {name: 'createCategory'}
        }
      ],
      showProductActions: false,
    }
  },
  getters: {
    productGetter: (state) => (key) => state[key]
  },
  actions: {
    setLoading(payload){
      try {
        useGlobalStore().setLoading(payload);
      } catch (error) {
        console.error(error);
        this.toast.error('We encountered an error');
      }
    },
    setProductActionsView(){
      try {
        document.addEventListener('click', (event) =>{
          if(event.target.id === 'product_actions_activator_btn' || event.target.id === 'product_actions_activator_btn_icon') {
            this.$patch({
              showProductActions:!this.showProductActions,
            })
          }else {
            this.$patch({
              showProductActions: false,
            })
          }
        })
      } catch (error) {
        console.error(error);
        this.toast.error("An error occurred while setting product actions view.");
      }
    },
    getProducts() {
      _request.axiosRequest({
        url: constants.products,
        method: "GET",
      })
        .then(res => {
          this.$patch({
            products: res.data.rows
          })
        })
        .catch(err => {
          this.toast.error(err.message);
        });
    },
    getProduct(productId) {
      try {
        const product = this.products.find(p => p.pid === productId);
        if (!product) {
          return  _request.axiosRequest({
            url: `${constants.products}/${productId}`,
            method: "GET",

        })
           .then(res => {
                this.$patch({
                    product: res.data
                })
            })
           .catch(err => {
                this.toast.error(err.message);
            });
        }
        this.$patch({
          product: product,
        })
      } catch (error) {
        this.toast.error(error.message);
      }
    },
    async createProduct(product) {
      return await _request.axiosRequest({
        url: constants.products,
        method: "POST",
        data: product,
      })
    },
    uploadProductImages(payload, entity = ''){
      try {
        this.setLoading(true);
        _request.axiosRequest({
          url: constants.images,
          method: "POST",
          data: payload,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
         .then(() => {
           this.setLoading(false);
           this.toast.success(`${entity} uploaded successfully`)
           globalEventBus.emit('goto-manage-product')
         })
         .catch((err) => {
            console.error(err);
            this.setLoading(false);
            this.toast.error(`Error uploading ${entity}`)
          });
      } catch (error) {
        console.error(error);
        this.setLoading(false);
        this.toast.error(`Error uploading ${entity}`)
      }
    },
    async createCategory(category) {
      return await _request.axiosRequest({
        url: constants.categories,
        method: "POST",
        data: category,
      })
    },
  }
})