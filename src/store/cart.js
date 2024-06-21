import { defineStore } from "pinia";
import constants from "./constants";
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
            _request.axiosRequest({
                url: constants.cart,
                method: 'GET',
            })
        }
    },
});