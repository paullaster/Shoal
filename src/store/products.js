import { defineStore } from "pinia";
import { _request } from "@/service";
import constants from "./constants";
import router from "@/router";

export const useProductStore = defineStore("product", {
  state: () => {
    return {
      products: [
        {
          pid: 'AAA084LGOVUAM',
          name: "Ng'ege",
          price: 35,
          description: "Fried Ng'ege ",
          image: 'http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png',
          category: 'Fried',
          quantity: '6',
          color: 'shinny gold',
          size: '900g',
          lastPid: 'AAA084LGOVUAM',
          createdAt: '2024-06-23 16:06:22',
          updatedAt: '2024-06-23 16:06:22'
        },
        {
          pid: 'AAA15CJYHDNSR',
          name: 'Omena',
          price: 15,
          description: 'Smoked Omena',
          image: 'http://192.168.0.103:3500/public/image/products/AAA15CJYHDNSR.png',
          category: 'Smoked',
          quantity: '6',
          color: 'shinny gold',
          size: '900g',
          lastPid: 'AAA15CJYHDNSR',
          createdAt: '2024-06-23 16:08:02',
          updatedAt: '2024-06-23 16:08:02'
        },
        {
          pid: 'AAA6XYNL50MAQ',
          name: "Ng'ege",
          price: 35,
          description: "Smoked Ng'ege ",
          image: 'http://192.168.0.103:3500/public/image/products/AAA6XYNL50MAQ.png',
          category: 'Smoked',
          quantity: '6',
          color: 'shinny gold',
          size: '900g',
          lastPid: 'AAA6XYNL50MAQ',
          createdAt: '2024-06-23 16:07:09',
          updatedAt: '2024-06-23 16:07:09'
        },
        {
          pid: 'AAA70GIZE5AUV',
          name: "Ng'ege",
          price: 35,
          description: "Cooked Ng'ege ",
          image: 'http://192.168.0.103:3500/public/image/products/AAA70GIZE5AUV.png',
          category: 'Cooked Meals',
          quantity: '6',
          color: 'shinny gold',
          size: '900g',
          lastPid: 'AAA70GIZE5AUV',
          createdAt: '2024-06-23 16:04:43',
          updatedAt: '2024-06-23 16:04:43'
        },
        {
          pid: 'AAA71SLDUZPGE',
          name: 'Nileperch',
          price: 15,
          description: 'cooked Nileperch',
          image: 'http://192.168.0.103:3500/public/image/products/AAA71SLDUZPGE.png',
          category: 'Cooked Meals',
          quantity: '6',
          color: 'shinny gold',
          size: '1200g',
          lastPid: 'AAA71SLDUZPGE',
          createdAt: '2024-06-23 16:10:23',
          updatedAt: '2024-06-23 16:10:23'
        },
        {
          pid: 'AAA7P0QIB5ODG',
          name: 'Nileperch',
          price: 15,
          description: 'cooked Nileperch',
          image: 'http://192.168.0.103:3500/public/image/products/AAA7P0QIB5ODG.png',
          category: 'Cooked Meals',
          quantity: '6',
          color: 'shinny gold',
          size: '1200g',
          lastPid: 'AAA7P0QIB5ODG',
          createdAt: '2024-06-23 16:13:42',
          updatedAt: '2024-06-23 16:13:42'
        },
        {
          pid: 'AAAJ678XOSHEU',
          name: 'Omena',
          price: 15,
          description: 'cooked Omena',
          image: 'http://192.168.0.103:3500/public/image/products/AAAJ678XOSHEU.png',
          category: 'Cooked Meals',
          quantity: '6',
          color: 'shinny gold',
          size: '400g',
          lastPid: 'AAAJ678XOSHEU',
          createdAt: '2024-06-23 16:09:20',
          updatedAt: '2024-06-23 16:09:20'
        },
        {
          pid: 'AAAK9NF5RL8VZ',
          name: 'Omena',
          price: 15,
          description: 'Fried Omena',
          image: 'http://192.168.0.103:3500/public/image/products/AAAK9NF5RL8VZ.png',
          category: 'Fried',
          quantity: '6',
          color: 'shinny gold',
          size: '400g',
          lastPid: 'AAAK9NF5RL8VZ',
          createdAt: '2024-06-23 16:08:38',
          updatedAt: '2024-06-23 16:08:38'
        }
      ],
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
    setProductActionsView(){
      try {
        document.addEventListener('click', (event) =>{
          if(event.target.id === 'product_actions_activator_btn' || event.target.id === 'product_actions_activator_btn_icon') {
            this.$patch({
              showProductActions:!this.showProductActions,
            })
            return;
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
          return router.back();
        }
        this.$patch({
          product: product,
        })
        // _request.axiosRequest({
        //     url: `${constants.products}/${productId}`,
        //     method: "GET",

        // })
        //    .then(res => {
        //         this.$patch({
        //             product: res.data
        //         })
        //     })
        //    .catch(err => {
        //         this.toast.error(err.message);
        //     });
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