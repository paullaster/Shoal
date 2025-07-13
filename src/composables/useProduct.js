import { useCartStore, useProductStore } from "@/store"
import { storeToRefs } from "pinia";

export default () => {

    // Stores
    const cartStore = useCartStore();
    const productStore = useProductStore();
    const { getAttributes, getAttributeCount, getProduct, getProducts } = storeToRefs(productStore);

    const addToCart = async (item) => {
        await cartStore.createCart(item)
    }
    const cartUpdate = async (item, e) => {
        const target = e.target.dataset
        for (let prop in target) {
            const actions = {
                typeAdd: 'add',
                typeRemove: 'remove'
            }
            await cartStore.updateCart(item.productId, actions[prop], false)
        }
    }
    return {
        addToCart,
        cartUpdate,
        getAttributeCount,
        getAttributes,
        getProduct,
        getProducts,
        createAttribute: async (payload) => await productStore.createAttribute(payload),
        updateAttribute: async (payload) => await productStore.updateAttribute(payload),
        fetchAttributes: async (query) => await productStore.fetchAttributes(query),
        deleteAttributeValue: async (payload) => await productStore.deleteAttributeValue(payload),
        deleteAttribute: async (payload) => await productStore.deleteAttribute(payload),
        setProduct: (product) => productStore.setProduct(product),
        onProductChange: (field, value, type = 'string') => productStore.onProductFormchange(field, value, type),
        setLoader: (payload) => productStore.setLoading(payload),
        createProduct: async (product) => await productStore.createProduct(product),
        fetchProducts: async (query) => await productStore.fetchProducts(query),
        fetchProduct: async (productId, query) => await productStore.fetchProduct(productId, query),
    }
}