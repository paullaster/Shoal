import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
    state: () => {
        return {
            menus: [],
        }
    },
    getters: {
        globalGetter: (state) => (key) => state[key]
    },
    actions: {
        setMenu(payload) {
            try {
                this.$patch({
                    menus: payload
                })
            } catch (error) {
                this.toast.error(error.message);
            }
        }
    }
})