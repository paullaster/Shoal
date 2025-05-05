import { defineStore } from "pinia";
import { _request } from "@/service";
import AuthService from "@/packages/auth/AuthService";
import router from "@/router";
import { useGlobalStore } from "./global";
import { globalEventBus } from "vue-toastification";


const customError = "Sorry, We experienced an error!, Please try again later";
export const useAuth = defineStore("auth", {
    state: () => ({
        user: {},
        loading: false,
    }),
    getters: {
        authGetter: (state) => (key) => state[key],
    },
    actions: {
        setLoader(payload) {
            try {
                useGlobalStore().setLoading(payload);
            } catch (error) {
                this.toast.error(error.message);
            }
        },
        async setUser(payload) {
            try {
                this.$patch({
                    user: payload,
                });
            } catch (error) {
                this.toast.error(error.message);
            }
        },
        async logout() {
            try {
                this.setLoader(true);
                this.$patch({
                    user: {},
                });
                await AuthService.logout();
                this.setLoader(false);
            } catch (error) {
                this.toast.error(error.message);
                this.setLoader(false);
            }
        },
        async login(payload) {
            try {
                this.setLoader(true);
                this.$patch({
                    loading: true,
                });
                _request.axiosRequest({
                    url: "/auth/login",
                    method: "POST",
                    data: payload,
                })
                    .then(async (response) => {
                        this.$patch({
                            loading: false,
                        });
                        this.setLoader(false);
                        AuthService.login(response.data).then(async (user) => {
                            await this.setUser(user);
                            if (user.type === 'admin') {
                                router.push({
                                    name: 'adminUserLayout',
                                    params: { adminId: btoa(user.userId) },
                                });
                            } else {
                                globalEventBus.emit('redirection')
                            }
                        })
                        this.toast.success(response.message);
                    })
                    .catch(async (error) => {
                        this.setLoader(false);
                        this.$patch({
                            loading: false,
                        });
                        this.toast.error(error?.response?.data?.message || error.message || customError);

                    });
            } catch (error) {
                this.setLoader(false);
                this.$patch({
                    loading: false,
                });
                this.toast.error(error.message);
            }
        },
        async getUser(payload) {
            try {
                this.setLoader(true);
                _request.axiosRequest({
                    url: "/auth/get-user",
                    method: "POST",
                    data: payload,
                })
                    .then(async (response) => {
                        payload['loginType'] = response.data.loginType;
                        response?.data?.otp && globalEventBus.emit("set-otp-screen", payload);
                        response?.data?.exist && globalEventBus.emit("user-credentials", response.data.user);
                        response?.data?.otp && setTimeout(() => {
                            globalEventBus.emit('start-otp-resend-timer');
                        }, 1000);
                        this.setLoader(false);
                    })
                    .catch(async (error) => {
                        this.toast.error(error?.response?.data?.message || error.message || customError);
                        this.setLoader(false);
                    });
            } catch (error) {
                this.toast.error(error.message);
                this.setLoader(false);
            }
        },
        async resetPassword(payload) {
            try {
                this.setLoader(true);
                _request.axiosRequest({
                    url: "/auth/forgot-password",
                    method: "POST",
                    data: payload,
                })
                    .then(async (response) => {
                        this.setLoader(false);
                        this.toast.success(response.message);
                    })
                    .catch(async (error) => {
                        this.setLoader(false);
                        this.toast.error(error?.response?.data?.message || error.message || customError);
                    });
            } catch (error) {
                this.setLoader(false);
                this.toast.error(error.message);
            }
        },
        async setPassword(payload) {
            try {
                this.setLoader(true);
                _request.axiosRequest({
                    url: "/auth/set-password",
                    method: "POST",
                    data: payload,
                })
                    .then(async (response) => {
                        const { token, password } = payload;
                        const user = JSON.parse(atob(token.split(".")[1]));
                        console.log(user);
                        const loginCredentials = {
                            email: user.email,
                            password: password
                        }
                        this.setLoader(false);
                        this.toast.success(response.message);
                        this.login(loginCredentials);
                    })
                    .catch(async (error) => {
                        this.setLoader(false);
                        this.toast.error(error?.response?.data?.message || error.message || customError);
                    });
            } catch (error) {
                this.toast.error(error.message);
            }
        },
        async resendOTP(payload) {
            try {
                this.setLoader(true);
                _request.axiosRequest({
                    url: "/auth/resend-otp",
                    method: "POST",
                    data: payload,
                })
                    .then(async (response) => {
                        this.setLoader(false);
                        this.toast.success(response.message);
                    })
                    .catch(async (error) => {
                        this.setLoader(false);
                        this.toast.error(error?.response?.data?.message || error.message || customError);
                    });
            } catch (error) {
                this.setLoader(false);
                this.toast.error(error.message || customError)
            }
        },
        async verifyOtp(payload) {
            try {
                this.setLoader(true);
                _request.axiosRequest({
                    url: "/auth/verify-otp",
                    method: "POST",
                    data: payload,
                })
                    .then(async (response) => {
                        this.setLoader(false);
                        this.toast.success(response.message);
                        if (response.data.user.Otps[0].type === 'newAccount') {
                            const datapoint = atob(payload.datapoint);
                            payload.datapoint = btoa(`${datapoint}:${response.data.user.Otps[0].type}`)
                            globalEventBus.emit("complete-profile", payload.datapoint)
                        };
                    })
                    .catch(async (error) => {
                        this.setLoader(false);
                        this.toast.error(error?.response?.data?.message || error.message || customError);
                    });
            } catch (error) {
                this.setLoader(false);
                this.toast.error(error.message || customError)
            }
        },
        async updateProfile(payload, datapoint) {
            try {
                this.setLoader(true);
                this.$patch({
                    loading: true,
                });
                _request.axiosRequest({
                    url: `/auth/update-profile/${btoa(datapoint[0])}`,
                    method: "PATCH",
                    data: payload,
                })
                    .then(async (response) => {
                        this.setLoader(false);
                        this.$patch({
                            loading: false,
                        });
                        this.toast.success(response.message);
                        const accountType = datapoint[3];
                        if (accountType === 'newAccount') {
                            const loginPayload = {
                                username: datapoint[0],
                                password: payload.password,
                            }
                            this.login(loginPayload);
                        }
                    })
                    .catch(async (error) => {
                        this.setLoader(false);
                        this.$patch({
                            loading: false,
                        });
                        this.toast.error(error?.response?.data?.message || error.message || customError);
                    });
            } catch (error) {
                this.setLoader(false);
                this.$patch({
                    loading: false,
                });
                this.toast.error(error.message || customError)
            }
        }
    },
});