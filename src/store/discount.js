import { _request } from "@/service";
import Helper from "@/util/Helper";
import { defineStore } from "pinia";
import constants from "./constants";
import { useGlobalStore } from "./global";

export const discount = defineStore('discount', {
    state: () => ({
        discounts: [],
        totalDiscounts: 0,
        page: 1,
        pageSize: 10,
        sortOptions: ['title', 'code', 'amount', 'startPublishing', 'endPublishing'],
        statusOptions: ['All', 'Published', 'UnPublished'],
        search: '',
        sortBy: 'title',
        filterStatus: 'All',
    }),
    getters: {
        discountGetters: (state) => (key) => state[key],
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
        async createDiscount(discount) {
            try {
                this.setLoader(true);
                const discountsWithoutNulls = Helper.removeNullsFromObject(discount);
                await _request.axiosRequest({
                    method: 'POST',
                    url: constants.discount,
                    body: discountsWithoutNulls,
                });
                this.toast.success(`Discount created successfully.`);
            } catch (error) {
                this.toast.error(error.message);
            } finally {
                this.setLoader(false);
            }
        },
        async fetchDiscounts() {
            try {
                this.setLoader(true);
                const discounts = await _request.axiosRequest({
                    method: 'GET',
                    url: constants.discount,
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
        }
    }
})