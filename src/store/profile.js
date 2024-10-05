import { defineStore } from "pinia";
import { useGlobalStore } from "./global";
import { _request } from "@/service";

export const useProfile = defineStore('profile', {
    state() {
        return {
            profile: {},
            loading: false,
            address: [],
            addressSelected: {},
            editAddressform: false,
            addAnotherAddress: false,
            forceChangeUpgate: 1,
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
        async setSelectedAddress(value) {
            try {
                this.setLoader(true);
                if (value?.data) {
                    this.$patch({
                        addressSelected: value.data
                    })
                }
                else {
                    this.$patch({
                        addressSelected: value
                    })
                }
            } catch (error) {
                console.error(error)
                this.toast.error('An error occurred while selecting your address!');
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
                this.setLoader(true);
                _request.axiosRequest({
                    url: '/user/address',
                    method: 'GET',
                })
                    .then((response) => {
                        this.$patch({
                            address: response.data,
                        });
                        this.setLoader(false);
                    })
                    .catch((error) => {
                        console.error(error);
                        this.toast.error(error.response.data.message || error.message || 'An error occurred while fetching your address!');
                        this.setLoader(false);
                    })
            } catch (error) {
                console.error(error);
                this.toast.error('An error occurred while fetching your address!');
            }
        },
        async fetchAddressById(address) {
            if (typeof address === 'object') {
                address = address.addressId;
            }
            _request.axiosRequest({
                url: `/user/address/${address}`,
                method: 'GET',
            })
                .then((response) => {
                    this.setSelectedAddress(response)
                })
                .catch((error) => {
                    console.error(error);
                    this.toast.error('An error occurred while fetching your address!');
                });
        },
        async saveProfileAddress(payload) {
            return _request.axiosRequest({
                method: 'POST',
                url: '/user/address',
                data: payload,
            });
        },
        async updateProfileAddress(payload) {
            const { addressId } = payload;
            delete payload.default;
            delete payload.userId;
            delete payload.updatedAt;
            delete payload.createdAt;

            return _request.axiosRequest({
                method: 'PATCH',
                url: `/user/address/${addressId}`,
                data: payload,
            });
        },
        async setDefaultAddress(address) {
            try {
                switch (typeof address) {
                    case 'object':
                        address = address.addressId;
                        break;
                    case 'string':
                        break;
                    case 'number':
                        break;
                    default:
                        return this.toast.error('Invalid address type.');
                }

                // Set the user's profile as default in the backend API
                _request.axiosRequest({
                    method: 'PATCH',
                    url: `/user/address/default/${address}`,
                })
                    .then((address) => {
                        this.$patch({
                            address: address.data,
                        })
                        this.toast.success('Address set as default successfully!');
                    })
                    .catch((error) => {
                        console.error(error);
                        this.toast.error('An error occurred while setting your address as default!');
                    });
            } catch (error) {
                console.error(error);
                this.toast.error('An error occurred while setting your address as default!');
            }
        },
        async deleteProfileAddress(address) {
            try {
                // Delete the user's profile from the backend API
                switch (typeof address) {
                    case 'object':
                        address = address.addressId;
                        break;
                    case 'string':
                        break;
                    case 'number':
                        break;
                    default:
                        return this.toast.error('Invalid address type.');
                }
                _request.axiosRequest({
                    method: 'DELETE',
                    url: `/user/address/${address}`,
                })
                    .then((response) => {
                        this.$patch({
                            address: response.data,
                        })
                        this.toast.success(response.message);
                    })
                    .catch((error) => {
                        console.error(error);
                        this.toast.error('An error occurred while deleting your address!');
                    });
            } catch (error) {
                console.error(error);
                this.toast.error('An error occurred while deleting your profile!');
            }
        }
    }
})