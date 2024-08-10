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
                this.$patch({
                    links: _.sortedUniq(_.sortBy([...this.links, ...payload], (link)=>link.order)),
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