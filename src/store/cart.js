import { defineStore } from "pinia";
import { _request } from "@/service";

export const useCartStore = defineStore('cart', {
    state(){
        return {
            cart: [],
        }
    },
    getters: {
        cartGetter: (state) => (key) => state[key]
    },
    actions: {
        getCartItems() {
            _request({
                url: constants.cart,
                method: 'GET',
            })
        }
    },
});