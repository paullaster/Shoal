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
                const cartItem = { ...payload };
                cartItem.image = cartItem.Images[0].url;
                if (!AuthService.isAuthenticated()) {
                    this.getCart();
                    cartItem.productId = cartItem.pid;
                    cartItem.productPid = cartItem.productId
                    if (!Object.keys(this.cart).length) {
                        return WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, { Items: [cartItem] });
                    }
                    const productExistsInCart = this.cart.Items.find((product) => product.productPid === cartItem.productPid);
                    if (productExistsInCart) {
                        productExistsInCart.quantity += cartItem.quantity;
                        return WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, this.cart);
                    }
                    WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, { Items: [...this.cart.Items, cartItem] });
                    this.toast.success("Item was successfully added to cart");
                    return;
                }
                delete cartItem.Images;
                _request.axiosRequest({
                    url: constants.cart,
                    method: 'POST',
                    data: { item: cartItem },
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
        getCart(getFromCashe = false) {
            try {
                if (!AuthService.isAuthenticated() || getFromCashe) {
                    const cart = WebStorage.GetFromWebStorage('local', `${APPNAME.split(" ").join("")}_cart`);
                    if (cart) {
                        !getFromCashe && this.$patch({
                            cart: cart,
                        });
                    }
                    return getFromCashe ? cart : "";
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
        checkLocalCacheCart() {
            try {
                const cart = WebStorage.GetFromWebStorage('local', `${APPNAME.split(" ").join("")}_cart`);
                console.log(cart);
                if (cart) {
                    cart.Items.forEach((item) => {
                        this.createCart(item).then(() => {
                            this.removeItemFromCart(item.productId, true);
                        });
                    })
                }
            } catch (error) {
                return this.toast.error(error.message);
            }
        },
        async updateCart(productID, type = 'add') {
            try {
                if (!AuthService.isAuthenticated()) {
                    this.getCart();
                    if (!Object.keys(this.cart).length) {
                        return;
                    }
                    const product = this.cart.Item.find((item) => item.productId === productID);
                    if (product) {
                        if (type === 'add') {
                            product.quantity++;
                        } else if (type === 'remove') {
                            if (Number(product.quantity) === 1) {
                                this.cart.Item = this.cart.Item.filter((item) => item.productId !== productID);
                            } else {
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
            } finally {
                this.getCart();
            }
        },
        async removeItemFromCart(productID, removeCache = false) {
            try {
                if (!AuthService.isAuthenticated() || removeCache) {
                    const cart = this.getCart(removeCache ?? false);
                    if (!Object.keys(this.cart).length) {
                        return;
                    }
                    if (removeCache) {
                        cart.Items = cart.Items.filter((item) => item.productId !== productID);
                        WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, cart);
                        return;
                    }
                    this.cart.Item = this.cart.Items.filter((item) => item.productId !== productID);
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