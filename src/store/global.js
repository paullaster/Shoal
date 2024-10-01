import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
    state: () => {
        return {
            menus: [],
            showsidebarNavigation: false,
            loading: false,
            dynamicDialog: {
                show: true,
            },
        }
    },
    getters: {
        globalGetter: (state) => (key) => state[key]
    },
    actions: {
        setLoading(payload){
            try {
                this.$patch({
                    loading: payload
                })
            } catch (error) {
                console.error(error);
                this.toastr.error('We encountered an error!');
            }
        },
        setMenu(payload) {
            try {
                this.$patch({
                    menus: payload
                })
            } catch (error) {
                this.toast.error(error.message);
            }
        },
        toggleSidebarNavigation(payload) {
            try {
                this.$patch({
                    showsidebarNavigation: payload
                })
            } catch (error) {
                this.toast.error(error.message);
            }
        },
         setDynamicDialog(payload) {
            try {
                this.$patch({
                    dynamicDialog: payload
                })
            } catch (error) {
                this.toast.error(error.message);
            }
        }
    }
})