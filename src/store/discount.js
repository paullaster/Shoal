import { _request } from "@/service";
import Helper from "@/util/Helper";
import { defineStore } from "pinia";
import constants from "./constants";
import { useGlobalStore } from "./global";
import _ from 'lodash';

export const discount = defineStore('discount', {
    state: () => ({
        dialog: false,
        discounts: [],
        totalDiscounts: 0,
        page: 1,
        pageSize: 10,
        sortOptions: ['title', 'code', 'amount', 'startPublishing', 'endPublishing'],
        statusOptions: ['All', 'Published', 'UnPublished'],
        search: '',
        sortBy: 'title',
        filterStatus: 'All',
        activeAbortController: null,
    }),
    getters: {
        getDialog: (state) => state['dialog'],
        discountsGetter: (state) => state['discounts'],
        sortByGetter: (state) => state['sortBy'],
        filterStatusGetter: (state) => state['filterStatus'],
        totalDiscountsGetter: (state) => state['totalDiscounts'],

    },
    actions: {
        setLoader(payload) {
            try {
                const globalStore = useGlobalStore();
                globalStore.setLoading(payload);
            } catch (error) {
                this.toast.error(error.message);
            }
        },
        setDialog(payload) {
            this.$patch({
                dialog: payload,
            });
        },
        setFilterStatus(payload) {
            this.$patch({
                filterStatus: payload,
            });
        },
        setSortBy(payload) {
            this.$patch({
                sortBy: payload,
            });
        },
        async createDiscount(discount) {
            this.setLoader(true);
            if (this.activeAbortController) {
                this.activeAbortController.abort();
            }
            this.activeAbortController = new AbortController();
            const signal = this.activeAbortController.signal;
            const discountsWithoutNulls = Helper.removeNullsFromObject(discount);
            await _request.axiosRequest({
                url: constants.discount,
                method: 'POST',
                data: discountsWithoutNulls,
                signal,
            });
            await this.fetchDiscounts();
            this.setLoader(false);
        },
        fetchDiscounts: _.debounce(
            async function () {
                try {
                    if (this.activeAbortController) {
                        this.activeAbortController.abort();
                    }
                    this.activeAbortController = new AbortController();
                    const signal = this.activeAbortController.signal;
                    this.setLoader(true);
                    const discounts = await _request.axiosRequest({
                        method: 'GET',
                        url: constants.discount,
                        signal,
                    });
                    let filtered = discounts.data.rows;
                    if (this.filterStatus !== 'All') filtered = filtered.filter(d => d.status === this.filterStatus);
                    if (this.search) {
                        const s = this.search.toLowerCase();
                        filtered = filtered.filter(d => d.title.toLowerCase().includes(s) || d.code.toLowerCase().includes(s));
                    }
                    filtered = filtered.sort((a, b) => String(a[this.sortBy]).localeCompare(String(b[this.sortBy])));
                    this.$patch({
                        totalDiscounts: discounts.data.count,
                        discounts: filtered,
                    });
                } catch (error) {
                    this.toast.error(error.message);
                } finally {
                    this.setLoader(false);
                }
            }, 2500)
    }
})