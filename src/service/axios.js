/* eslint-disable linebreak-style */
import axios from "axios";
import { appApiBaseUrl } from "@/environments";
import AuthService  from "@/packages/auth/AuthService";

const instance = axios.create({
	baseURL: appApiBaseUrl,
	// timeout: 10000,
});


const requestInterceptor = (config) => {
	if (AuthService.isAuthenticated()) {
		config.headers.Authorization = `Bearer ${AuthService.token}`;
		!config.headers.Accept || !config.headers['Content-Type']  ? config.headers['Content-Type'] = "Application/json" : "";
	}
	config.validateStatus = function (status) {
		return status >= 200 && status < 300;
	  };
	return config;
};

const errorInterceptor = (error) => {
	console.log("ERROR INTERCEPTOR", error);
	return Promise.reject(error);
};

instance.interceptors.request.use(requestInterceptor, errorInterceptor);

const reponseInterceptor = (response) => {
	console.log("RESPONSE INTERCEPTOR",response);
	return Promise.resolve(response?.data);
};


instance.interceptors.response.use(reponseInterceptor, errorInterceptor);

export const _request  = (options) => instance.request(options);