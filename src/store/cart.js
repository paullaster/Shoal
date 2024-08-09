import { defineStore } from "pinia";
import constants from "./constants";
import { _request } from "@/service";
import AuthService from "@/packages/auth/AuthService";
import WebStorage from "@/util/storage";
import { APPNAME } from "@/environments";

export const useCartStore = defineStore('cart', {
    state() {
        return {
            cart: {},
        }
    },
    getters: {
        cartGetter: (state) => (key) => state[key]
    },
    actions: {
        async createCart(payload) {
            try {
                this.getCart();
                if (!AuthService.isAuthenticated()) {
                    payload.quantity = 1;
                    payload.productId = payload.pid;
                    if (!Object.keys(this.cart).length) {
                        return WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, { Item: [payload] });
                    }
                    const productExistsInCart = this.cart.Item.find((product) => product.productId === payload.productId);
                    if (productExistsInCart) {
                        productExistsInCart.quantity += payload.quantity;
                        return WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, this.cart);
                    }
                    return WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, { Item: [...this.cart.Item, payload] });
                }
                _request.axiosRequest({
                    url: constants.cart,
                    method: 'POST',
                    data: payload,
                })
                    .then((res) => {
                        this.$patch({
                            cart: res.data,
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } catch (error) {
                return this.toast.error(error.message);
            } finally {
                this.getCart();
            }
        },
        getCart() {
            try {
                if (!AuthService.isAuthenticated()) {
                    const cart = WebStorage.GetFromWebStorage('local', `${APPNAME.split(" ").join("")}_cart`);
                    if (cart) {
                        this.$patch({
                            cart: cart,
                        });
                    }
                    return;
                }
                _request.axiosRequest({
                    url: constants.cart,
                    method: 'GET',
                })
            } catch (error) {
                return this.toast.error(error.message);
            }
        },
        async updateCart(productID, type = 'add') {
            try {
                this.getCart();
                if (!AuthService.isAuthenticated()) {
                    if (!Object.keys(this.cart).length) {
                        return;
                    }
                    const product = this.cart.Item.find((item) => item.productId === productID);
                    if (product) {
                        if (type === 'add') {
                            product.quantity++;
                        } else if (type ==='remove') {
                            product.quantity--;
                        }
                        WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, this.cart);
                    }
                    return;
                }
            } catch (error) {
                return this.toast.error(error.message);
            }finally {
                this.getCart();
            }
        }
    },
});