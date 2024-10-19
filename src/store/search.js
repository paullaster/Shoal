import { _request } from "@/service";
import { defineStore } from "pinia";

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
        search(term) {
            try {
                term = term.trim();
                if (term === '' || term === null || term === undefined) {
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
                })
                .catch((error) => {
                    this.toast.error(error.response.data.message || "Error searching...");
                });
            } catch (error) {
                this.toast.error(error.message || "Error searching...");
            }
        },
    },
})