import { defineStore } from "pinia";
import { _request } from "@/service";
import AuthService from "@/packages/auth/AuthService";
import router from "@/router";
import { useGlobalStore } from "./global";


const customError = "Sorry, We experienced an error!, Please try again later";
export const useAuth = defineStore("auth", {
    state: () => ({
        user: {},
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
            } catch (error) {
                this.setLoader(false);
                this.toast.error(error.message);
            }
        },
        async login(payload) {
            try {
                this.setLoader(true);
                _request.axiosRequest({
                    url: "/auth/login",
                    method: "POST",
                    data: payload,
                })
                    .then(async (response) => {
                        AuthService.login(response.data).then(async(user) => {
                            await this.setUser(user);
                            if(user.type === 'admin') {
                                router.push({
                                    name: 'adminUserLayout',
                                    params: { adminId: btoa(user.userId) },
                                });
                            }else {
                                router.push({
                                    name: 'admin',
                                    params: { user: btoa(user.userId) },
                                });
                            }
                        })
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
        async activateConsoltium(payload) {
            try {
                this.setLoader(true);
                _request.axiosRequest({
                    url: "/auth/activate",
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
        }
    },
});