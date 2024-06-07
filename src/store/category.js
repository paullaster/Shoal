import { defineStore } from "pinia";
import { _request } from "@/service";
import constnants from "./constnants";

export const useCategoryStore = defineStore("category", {
    state: () => {
        return {
            productList: [],
        }
    },
    getters: {
        categoryGetter: (state) => (key) => state[key]
    },
    actions: {
        setProductList() {
            console.log('setProductList');
            _request({
                url: constnants.products,
                method: "GET",
            })
                .then(res => {
                    this.$patch({
                        productList: res.data
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
})