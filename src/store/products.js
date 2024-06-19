import { defineStore } from "pinia";
import { _request } from "@/service";
import constants from "./constants";

export const useProductStore = defineStore("product", {
    state: () => {
        return {
            products: [],
            product: {},
        }
    },
    getters: {
        productGetter: (state) => (key) => state[key]
    },
    actions: {
        getProducts() {
            _request({
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
            _request({
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