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
      product: {
        name: '',
        description: '',
        recipeTips: '',
        price: 0,
        hasVariants: false,
        categories: [],
        variants: [],
        discounts: [],
      },
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
    getAttributeCount: (state) => state['attributesCount'],
    getAttributes: (state) => state['attributes'],
    getProduct: (state) => state['product'],
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
    setProduct(product) {
      this.$patch({
        product: product,
      });
    },
    onProductFormchange(field, value, type = 'string') {
      switch (type) {
        case 'number': {
          value = Number(value);
          break;
        };
        case 'boolean': {
          value = Boolean(value);
          break;
        }
      }
      this.$patch({
        product: {
          ...this.product,
          [field]: value,
        }
      })
    },
    getProducts(query) {
      _request.axiosRequest({
        url: constants.products,
        method: "GET",
        params: query
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
    fetchProduct(productId) {
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
          product: product
        });
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
        this.setLoading(true);
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
        this.toast.success('Attribute created successfully!');
        await this.fetchAttributes({ eager: true });
      } catch (error) {
        console.error(error);
        this.toast.error(error?.message)
      } finally {
        this.setLoading(false);
      }
    },
    async updateAttribute(payload) {
      try {
        console.log('payload in store:', payload)
        this.setLoading(true);
        if (this.activeAbortController) {
          this.activeAbortController.abort();
        }
        this.activeAbortController = new AbortController();
        const signal = this.activeAbortController.signal;
        if (!payload.attributeId) throw new Error('Missing attribute ID');
        const { attributeId, ...update } = payload;

        await _request.axiosRequest({
          url: `${constants.attribute}/${attributeId}`,
          method: 'PUT',
          data: update,
          signal,
        });
        await this.fetchAttributes({ eager: true });
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },
    async deleteAttribute(payload) {
      try {
        this.setLoading(true);
        if (this.activeAbortController) {
          this.activeAbortController.abort();
        }
        this.activeAbortController = new AbortController();
        const signal = this.activeAbortController.signal;
        if (!payload.attributeId) throw new Error('Missing attribute ID');
        await _request.axiosRequest({
          url: `${constants.attribute}/${payload.attributeId}`,
          method: 'DELETE',
          signal,
        });
        await this.fetchAttributes({ eager: true });
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },
    async deleteAttributeValue(payload) {
      try {
        this.setLoading(true);
        if (this.activeAbortController) {
          this.activeAbortController.abort();
        }
        this.activeAbortController = new AbortController();
        const signal = this.activeAbortController.signal;
        if (!payload.attributeId) throw new Error('Missing attribute ID');
        const { attributeId, ...archivedValues } = payload;

        await _request.axiosRequest({
          url: `${constants.attribute}/${attributeId}/value`,
          method: 'DELETE',
          data: archivedValues,
          signal,
        });
        await this.fetchAttributes({ eager: true });
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },
    async fetchAttributes(query) {
      try {
        this.setLoading(true);
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