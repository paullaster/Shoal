/* eslint-disable linebreak-style */
import axios from "axios";
import { APP_API_BASE_URL } from "@/env";
import { AuthService } from "@/packages/Auth";

const instance = axios.create({
	baseURL: APP_API_BASE_URL,
	// timeout: 10000,
});


const requestInterceptor = (config) => {
	if (AuthService.Check()) {
		config.headers.Authorization = `Bearer ${AuthService.Token()}`;
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

export const _request  = (options) => {
    return instance.request(options);
}