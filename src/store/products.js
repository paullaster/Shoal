import { defineStore } from "pinia";
import { _request } from "@/service";
import constants from "./constants";
import { useGlobalStore } from "./global";
import { globalEventBus } from "vue-toastification";

export const useProductStore = defineStore("product", {
  state: () => {
    return {
      activeAbortController: null,
      attributes: [],
      attributesCount: 0,
      products: [],
      product: {},
      productActions: [
        {
          text: 'Create a new product',
          icon: 'mdi-cart-arrow-down',
          id: 'add-new-product',
          path: { name: 'createProduct' }
        },
        {
          text: 'Add new Category',
          icon: 'mdi-shape-plus-outline',
          id: 'add-new-category',
          path: { name: 'createCategory' }
        }
      ],
      showProductActions: false,
    }
  },
  getters: {
    productGetter: (state) => (key) => state[key],
    getAttributeCount: (state) => state['attributesCount'],
    getAttributes: (state) => state['attributes'],
  },
  actions: {
    setLoading(payload) {
      try {
        useGlobalStore().setLoading(payload);
      } catch (error) {
        console.error(error);
        this.toast.error('We encountered an error');
      }
    },
    setProductActionsView() {
      try {
        document.addEventListener('click', (event) => {
          if (event.target.id === 'product_actions_activator_btn' || event.target.id === 'product_actions_activator_btn_icon') {
            this.$patch({
              showProductActions: !this.showProductActions,
            })
          } else {
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
      // Replace API call with dummy data
      this.$patch({
        products: [
          {
            pid: 'p1', name: 'Laptop', description: 'Powerful laptop', price: 1200, stock: 50, category: 'cat1', images: [{ url: 'https://via.placeholder.com/150' }], discount: 0
          },
          {
            pid: 'p2', name: 'Keyboard', description: 'Mechanical keyboard', price: 75, stock: 20, category: 'cat2', images: [{ url: 'https://via.placeholder.com/150' }], discount: 10
          },
          {
            pid: 'p3', name: 'Mouse', description: 'Wireless mouse', price: 25, stock: 10, category: 'cat2', images: [{ url: 'https://via.placeholder.com/150' }], discount: 0
          },
          {
            pid: 'p4', name: 'Monitor', description: '4K monitor', price: 300, stock: 5, category: 'cat1', images: [{ url: 'https://via.placeholder.com/150' }], discount: 0
          },
          {
            pid: 'p5', name: 'Webcam', description: 'HD webcam', price: 50, stock: 0, category: 'cat3', images: [{ url: 'https://via.placeholder.com/150' }], discount: 0
          }
        ]
      });
      // _request.axiosRequest({
      //   url: constants.products,
      //   method: "GET",
      // })
      //   .then(res => {
      //     this.$patch({
      //       products: res.data.rows
      //     })
      //   })
      //   .catch(err => {
      //     this.toast.error(err.message);
      //   });
    },
    getProduct(productId) {
      try {
        const product = this.products.find(p => p.pid === productId);
        if (!product) {
          return _request.axiosRequest({
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
    async createAttribute(payload) {
      try {
        this.setLoading(true)
        if (this.activeAbortController) {
          this.activeAbortController.abort();
        }
        this.activeAbortController = new AbortController();
        const signal = this.activeAbortController.signal;
        await _request.axiosRequest({
          url: constants.attribute,
          method: 'POST',
          data: payload,
          signal,
        });
        await this.fetchAttributes();
      } catch (error) {
        console.error(error);
        this.toast.error(error?.message)
      } finally {
        this.setLoading(false);
      }
    },
    async fetchAttributes(query) {
      try {
        let attributes;
        attributes = await _request.axiosRequest({
          url: constants.attribute,
          method: 'GET',
          params: {
            ...query,
          }
        });
        this.$patch({
          attributesCount: attributes.data.count,
          attributes: attributes.data.rows,
        })
      } catch (error) {
        console.error(error);
        this.toast.error(error?.message)
      } finally {
        this.setLoading(false);
      }
    },
    uploadProductImages(payload, entity = '') {
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
  }
})