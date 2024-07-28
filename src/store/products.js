import { defineStore } from "pinia";
import { _request } from "@/service";
import constants from "./constants";

export const useProductStore = defineStore("product", {
    state: () => {
        return {
            products: [
                {
                  pid: 'AAA084LGOVUAM',
                  name: "Ng'ege",
                  price: '35',
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
                  price: '15',
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
                  price: '35',
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
                  price: '35',
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
                  price: '15',
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
                  price: '15',
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
                  price: '15',
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
                  price: '15',
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
            categories: [],
        }
    },
    getters: {
        productGetter: (state) => (key) => state[key]
    },
    actions: {
        getCategories() {
            _request.axiosRequest({
                url: constants.categories,
                method: "GET",
            })
               .then(res => {
                    this.$patch({
                        categories: res.data
                    })
                })
               .catch(err => {
                    this.toast.error(err.message);
                });
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
        getProduct(params) {
            _request.axiosRequest({
                url: `${constants.products}/${params}`,
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
        },
    }
})