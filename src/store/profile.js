import { defineStore } from "pinia";
import { useGlobalStore } from "./global";
import { _request } from "@/service";

export const useProfile = defineStore('profile', {
    state() {
        return {
            profile: {},
            loading: false,
            address: [],
        }
    },
    getters: {},
    actions: {
        setLoader(payload) {
            try {
                this.$patch({
                    loading: payload
                })
                useGlobalStore().setLoading(payload);

            } catch (error) {
                this.toast.error(error.message);
            }
        },
        async updateProfile(payload) {
            try {
                // Update the profile in the backend API
                //...
            } catch (error) {
                console.error(error);
                this.toastr.error('An error occurred while updating your profile!');
            }
        },
        async updateAddress(payload) {
            try {
                // Update the address in the backend API
                //...
            } catch (error) {
                console.error(error);
                this.toastr.error('An error occurred while updating your address!');
            }
        },
        async fetchProfile() {
            try {
                // Fetch the user's profile from the backend API
                //...
            } catch (error) {
                console.error(error);
                this.toastr.error('An error occurred while fetching your profile!');
            }
        },
        async fetchAddress() {
            try {
                // Fetch the user's address from the backend API
                //...
            } catch (error) {
                console.error(error);
            }
        },
        async saveProfileAddress(payload) {
            return _request.axiosRequest({
                method: 'POST',
                url: '/user/address',
                data: payload,
            });
        },
    }
})