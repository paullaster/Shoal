import { useCartStore } from "@/store"

export default () => {
    const cartStore = useCartStore()
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
    }
}