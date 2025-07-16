import { defineStore } from "pinia";
import constants from "./constants";
import { _request } from "@/service";
import AuthService from "@/packages/auth/AuthService";
import WebStorage from "@/util/storage";
import { APPNAME } from "@/environments";
import { useGlobalStore } from "./global";
import { useProductStore } from "./products";

export const useCartStore = defineStore('cart', {
    state() {
        return {
            cart: {},
            amountToPay: 0,
            subTotalAmount: 0,
            shippingAmount: 0,
        }
    },
    getters: {
        itemsInCart: (state) => state.cart?.Items?.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal: (state) => state.cart?.Items?.reduce((sum, item) => Number(sum + (Number(item.price) * Number(item.quantity))), 0),
        itemsById(state) {
            return state.cart?.Items?.reduce((acc, item) => {
                acc[item.productId] = item;
                return acc;
            }, {}) || {};
        }
    },
    actions: {
        setGlobalLoader(payload) {
            try {
                useGlobalStore().setLoading(payload);
            } catch (error) {
                console.error(error);
                this.toast.error('An error occurred.');
            }
        },
        async setCheckoutAmounToPay(params = {}) {
            const amountToPay = {
                value: 0,
                subtotal: 0,
                shipping: 0,
            };
            this
                .getCheckoutCart(params)
                .then((response) => {
                    amountToPay.value = response.data.Items.reduce(
                        (sum, runningVal) => sum + parseFloat(runningVal.totalPrice),
                        0
                    )
                    amountToPay.subtotal += amountToPay.value;
                    amountToPay.shipping += parseFloat(response.data.shippingRate);
                    amountToPay.value += parseFloat(response.data.shippingRate);
                    this.$patch({
                        amountToPay: amountToPay.value,
                        subTotalAmount: amountToPay.subtotal,
                        shippingAmount: amountToPay.shipping,
                    })
                })
                .catch((error) => {
                    console.error('Error retrieving checkout cart:', error)
                    this.toast.error('Error retrieving checkout cart')
                })
        },
        async createCart(payload) {
            try {
                this.setGlobalLoader(true);
                const cartItem = { ...payload, quantity: 1 };
                const productStore = useProductStore();
                await productStore.fetchProduct(cartItem.productId, { eager: true });
                const selectedProduct = productStore.getProduct;
                if (!selectedProduct) {
                    return;
                }
                cartItem.image = selectedProduct?.images?.[0].url;
                console.log(cartItem);
                if (!AuthService.isAuthenticated()) {
                    this.getCart();
                    if (!Object.keys(this.cart).length) {
                        this.setGlobalLoader(false);
                        return WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, { Items: [cartItem] });
                    }
                    const productExistsInCart = this.cart.Items.find((product) => product.productPid === cartItem.productPid);
                    if (productExistsInCart) {
                        productExistsInCart.quantity += cartItem.quantity;
                        this.setGlobalLoader(false);
                        return WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, this.cart);
                    }
                    WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, { Items: [...this.cart.Items, cartItem] });
                    this.toast.success("Item was successfully added to cart");
                    this.setGlobalLoader(false);
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
                        this.setGlobalLoader(false);
                    })
                    .catch((error) => {
                        console.error(error);
                        this.setGlobalLoader(false);
                    });
            } catch (error) {
                this.setGlobalLoader(false);
                return this.toast.error(error.message);
            } finally {
                this.getCart();
                this.setGlobalLoader(false);
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
        async updateCart(productID, type = 'add', oncart = false) {
            try {
                if (!oncart) {
                    this.getCart();
                    if (!Object.keys(this.cart).length) {
                        return;
                    }
                }
                if (!AuthService.isAuthenticated()) {
                    const product = this.cart.Items.find((item) => item.productId === productID);
                    if (product) {
                        if (type === 'add') {
                            product.quantity++;
                        } else if (type === 'remove') {
                            if (Number(product.quantity) === 1) {
                                this.cart.Items = this.cart.Items.filter((item) => item.productId !== productID);
                            } else {
                                product.quantity--;
                            }
                        }
                        WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, this.cart);
                    }
                    this.toast.success(type === 'add' ? 'Item was successfully added to cart' : 'Cart was successfully updated');
                    return;
                } else {
                    const product = !oncart && this.cart.Items.find((item) => item.productPid === productID);
                    _request.axiosRequest({
                        url: `${constants.cart}/${product.itemId || productID}`,
                        method: 'PATCH',
                        data: { quantity: type === 'add' ? 1 : -1 },
                    })
                        .then((response) => {
                            this.$patch({
                                cart: response.data,
                            });
                            this.toast.success(type === 'add' ? 'Item was successfully added to cart' : 'Cart was successfully updated');
                        })
                        .catch((error) => {
                            this.toast.error(error.message);
                        });
                }
            } catch (error) {
                return this.toast.error(error.message);
            } finally {
                this.getCart();
            }
        },
        async removeItemFromCart(productID, removeCache = false, initiatedOncart = false) {
            try {
                const cart = this.getCart(removeCache ?? false);
                if (!AuthService.isAuthenticated() || removeCache) {
                    if (!Object.keys(this.cart).length) {
                        return;
                    }
                    if (removeCache) {
                        cart.Items = cart.Items.filter((item) => item.productId !== productID);
                        WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, cart);
                        return;
                    }
                    this.cart.Items = this.cart.Items.filter((item) => item.productId !== productID);
                    WebStorage.storeToWebDB('local', `${APPNAME.split(" ").join("")}_cart`, this.cart);
                    return;
                }
                const id = initiatedOncart ? productID : cart.Items.find((item) => item.productPid === productID).itemId;
                _request.axiosRequest({
                    url: `${constants.cart}/${id}`,
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
        async getCheckoutCart(params = {}) {
            return await _request.axiosRequest({
                url: constants.cart,
                method: 'GET',
                params,
            });
        },
        async checkout(payload) {
            try {
                console.log('Checking...');
                // this.setLoader(true);
                _request.axiosRequest({
                    url: 'checkout',
                    method: 'POST',
                    data: payload,
                })
                    .then((res) => {
                        console.log(res);
                        this.$patch({
                            cart: {},
                        });
                        this.toast.success("We've sent you payment notification on your phone, please proceed to make payment then comeback");
                    })
                    .catch((error) => {
                        this.toast.error(error.response.data.message || error.message, "We ran into an error, please try again later.");
                    })
                    .finally(() => {
                        this.setLoader(false);
                    });
            } catch (error) {
                this.setLoader(false);
                return this.toast.error(error.message);
            } finally {
                this.getCart();
            }
        }
    },
});