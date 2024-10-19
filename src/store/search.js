import { _request } from "@/service";
import { defineStore } from "pinia";
import { useGlobalStore } from "./global";

export const useSearch = defineStore('search', {
    state() {
        return {
            results: [],
        }
    },
    getters: {
        searchQueryGetter: (state) => state.searchQuery,
    },
    actions: {
        setGlobalLoader(payload){
            try {
                useGlobalStore().setLoading(payload);
            } catch (error) {
                console.error(error);
                this.toast.error('An error occurred.');
            }
        },
        search(term) {
            try {
                this.setGlobalLoader(true);
                term = term.trim();
                if (term === '' || term === null || term === undefined) {
                    this.setGlobalLoader(false);
                    return;
                }
                _request.axiosRequest({
                    url: 'search/orama',
                    method: 'GET',
                    params: { q: term },
                })
                .then((response) => {
                    this.$patch({
                        results: response.data,
                    });
                    this.setGlobalLoader(false);
                })
                .catch((error) => {
                    this.toast.error(error.response.data.message || "Error searching...");
                    this.setGlobalLoader(false);
                });
            } catch (error) {
                this.toast.error(error.message || "Error searching...");
                this.setGlobalLoader(false);
            }
        },
    },
})