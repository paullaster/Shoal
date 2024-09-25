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
        itemsInCart: (state) => state.cart?.Items?.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal: (state) => state.cart?.Items?.reduce((sum, item) => Number(sum + (Number(item.price) * Number(item.quantity))), 0),
    },
    actions: {
        async createCart(payload) {
            try {
                this.getCart();
                const cartItem = {...payload};
                cartItem.image = cartItem.Images[0].url;
                delete cartItem.Images;
                if (!AuthService.isAuthenticated()) {
                    cartItem.quantity = 1;
                    cartItem.productId = cartItem.pid;
                    if (!Object.keys(this.cart).length) {
                        return WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, { Items: [cartItem] });
                    }
                    const productExistsInCart = this.cart.Item.find((product) => product.productId === cartItem.productId);
                    if (productExistsInCart) {
                        productExistsInCart.quantity += cartItem.quantity;
                        return WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, this.cart);
                    }
                    WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, { Items: [...this.cart.Item, cartItem] });
                    this.toast.success("Item was successfully added to cart");
                    return;
                }
                _request.axiosRequest({
                    url: constants.cart,
                    method: 'POST',
                    data: {item: cartItem},
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
                .then((response) => {
                    this.$patch({
                        cart: response.data,
                    });
                })
                .catch((error) => {
                    this.toast.error(error.message);
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
                            if (Number(product.quantity) === 1) {
                                this.cart.Item = this.cart.Item.filter((item) => item.productId !== productID);
                            }else {
                                product.quantity--;
                            }
                        }
                        WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, this.cart);
                    }
                    this.toast.success(type === 'add' ? 'Item was successfully added to cart' : 'Cart was successfully updated');                    
                    return;
                }
            } catch (error) {
                return this.toast.error(error.message);
            }finally {
                this.getCart();
            }
        },
        async removeItemFromCart(productID) {
            try {
                this.getCart();
                if (!AuthService.isAuthenticated()) {
                    if (!Object.keys(this.cart).length) {
                        return;
                    }
                    this.cart.Item = this.cart.Item.filter((item) => item.productId !== productID);
                    WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, this.cart);
                    return;
                }
                _request.axiosRequest({
                    url: constants.cart,
                    method: 'DELETE',
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
    },
});