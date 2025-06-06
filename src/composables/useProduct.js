import { useCartStore, useProductStore } from "@/store"
import { storeToRefs } from "pinia";

export default () => {
    const cartStore = useCartStore();
    const productStore = useProductStore();
    const { getAttributes, getAttributeCount } = storeToRefs(productStore);
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
            await cartStore.updateCart(item.pid, actions[prop], false)
        }
        console.log('event', target)
    }
    return {
        addToCart,
        cartUpdate,
        getAttributeCount,
        getAttributes,
        createAttribute: async (payload) => await productStore.createAttribute(payload),
        fetchAttributes: async (query) => await productStore.fetchAttributes(query),
    }
}