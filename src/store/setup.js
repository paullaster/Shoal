import { defineStore } from "pinia";
import { _request } from "@/service";
import constants from "./constants";

export const useSetupStore = defineStore('setup', {
    state() {
        return {
            categories: [],
            currency: 'KSH.',
            countries: [],
            countriesLoading: true,
        }
    },
    getters: {
        setupGetter: (state) => (key) => state[key]
    },
    actions: {
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
            this.$patch({
                categories: [
                    { cid: 'cat1', name: 'Electronics', icon: 'mdi-laptop', color: 'blue' },
                    { cid: 'cat2', name: 'Accessories', icon: 'mdi-keyboard', color: 'green' },
                    { cid: 'cat3', name: 'Peripherals', icon: 'mdi-mouse', color: 'red' },
                ]
            });
        },
        getCountry(countryObj) {
            try {
                countryObj = JSON.parse(countryObj);
                return `${countryObj.flag} ${countryObj.name?.common}`;
            } catch (error) {
                this.toast.error(error.message)
            }
        }
    }
})