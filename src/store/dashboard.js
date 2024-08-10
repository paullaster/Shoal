import { defineStore } from "pinia";
import _ from "lodash";

export const useDashboard = defineStore("dashboard", {
    state: () => ({
        links: [],
        toggleNavBar: null,
    }),
    getters: {
        dashboardDataGetter: (state) =>(key) =>state[key],
    },
    actions: {
        addLinks(payload) {
            try {
                Array.isArray(payload) ?
                '' : payload = [payload];
                for (const item of payload){
                    const foundIndex = _.findIndex(this.links, (link)=> link.id === item.id);
                    if(foundIndex === -1){
                        this.links.push(item);
                    } else {
                        this.links[foundIndex] = item;
                    }
                }
                this.$patch({
                    links: _.sortBy(this.links, (link)=>link.order),
                });
            } catch (error) {
                this.toast.error(error.message);
            }
        },
        setToggleNavbar(payload) {
            try {
                this.$patch({
                    toggleNavBar: payload,
                });
            } catch (error) {
                this.toast.error(error.message);
            }
        }
    },
});