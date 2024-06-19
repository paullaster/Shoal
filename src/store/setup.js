import { defineStore } from "pinia";
import { _request } from "@/service";
import constnants from "./constants";

export const useSetupStore = defineStore('setup', {
    state(){
        return {
            categories: [],
        }
    },
    getters: {
        setupGetter: (state) => (key) => state[key]
    },
    actions: {
        getCategories(){
            _request({
                method: 'GET',
                url: constnants.categories,
            })
            .then((res) => {
                this.$patch({
                    categories: res.data.rows,
                });
            })
            .catch((err) => {
                this.toast.error(err.message);
            })
        }
    }
})