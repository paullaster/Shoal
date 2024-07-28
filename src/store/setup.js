import { defineStore } from "pinia";
import { _request } from "@/service";
import constnants from "./constants";

export const useSetupStore = defineStore('setup', {
    state(){
        return {
            categories: [],
            currency: 'KSH.',
        }
    },
    getters: {
        setupGetter: (state) => (key) => state[key]
    },
    actions: {
        getCategories(){
            _request.axiosRequest({
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