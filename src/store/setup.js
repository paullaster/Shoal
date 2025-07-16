import { defineStore } from "pinia";
import { _request } from "@/service";
import constants from "./constants";
import { useGlobalStore } from "./global";

export const useSetupStore = defineStore('setup', {
    state() {
        return {
            categories: [],
            categoriesCount: 0,
            currency: 'KSH.',
            countries: [],
            countriesLoading: true,
            activeAbortController: null,
        }
    },
    getters: {
        setupGetter: (state) => (key) => state[key],
        getCurrency: (state) => state['currency'],
    },
    actions: {
        setLoader(payload) {
            try {
                useGlobalStore().setLoading(payload);
            } catch (error) {
                console.error(error);
                this.toast.error('We encountered an error');
            }
        },
        getCountriesList() {
            this.$patch({
                countriesLoading: true,
            });
            _request.axiosRequest({
                method: 'GET',
                url: constants.setup('countries'),
            })
                .then((res) => {
                    this.$patch({
                        countriesLoading: false,
                        countries: res.data,
                    });

                }).catch((error) => {
                    this.toast.error(error.response.data.message || error.message);
                    this.$patch({
                        countriesLoading: false,
                    });
                });
        },
        getCategories() {
            try {
                this.setLoader(true);
                _request.axiosRequest({
                    method: 'GET',
                    url: constants.categories,
                })
                    .then((res) => {
                        console.log('categories', res);
                        this.$patch({
                            categories: res.data.rows,
                            categoriesCount: res.data.count,
                        });
                    })
                    .catch((error) => {
                        this.toast.error(error?.response?.data?.message || error?.message);
                    }).finally(() => {
                        this.setLoader(false);
                    })
            } catch (error) {
                this.toast.error(error.message);
            }
        },
        getCountry(countryObj) {
            try {
                countryObj = JSON.parse(countryObj);
                return `${countryObj.flag} ${countryObj.name?.common}`;
            } catch (error) {
                this.toast.error(error.message)
            }
        },
        async createCategory(category) {
            try {
                this.setLoader(true);
                if (this.activeAbortController) {
                    this.activeAbortController.abort();
                }
                this.activeAbortController = new AbortController();
                const signal = this.activeAbortController.signal;
                await _request.axiosRequest({
                    url: constants.categories,
                    method: "POST",
                    data: category,
                    signal,
                });

            } catch (error) {
                this.setLoader(false);
                this.toast.error(error.message);
            }
        },
    }
})