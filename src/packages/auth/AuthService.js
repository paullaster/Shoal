import WebStorage from "@/util/storage";
import { APPNAME } from "@/environments";
import { useToast } from "vue-toastification";
class AuthService {
    #token = null;
    #user = null;
    constructor() {
        this.setToken = this.setToken.bind(this);
        this.setUser = this.setUser.bind(this);
        this.init = this.init.bind(this);
        this.getToken = this.getToken.bind(this);
        this.getUser = this.getUser.bind(this);
        this.login = this.login.bind(this);
        this.tokenResourcename = `${APPNAME.split(" ").join("")}_token`;
        this.userResourcename = `${APPNAME.split(" ").join("")}_user`;
        this.init();
    }

    init() {
        this.#token = WebStorage.GetFromWebStorage('local', this.tokenResourcename);
        this.#user = WebStorage.GetFromWebStorage('local', this.userResourcename);
    }
    /*
    *isAuthenticated: boolean
    */

    //If you don't call this method isAuthenticated, you must give it this alias how you
    //prefer
    isAuthenticated() {
        return this.#token && this.#user;
    }
    //If you don't call this method getToken, you must give it this alias how you
    //prefer
    getToken() {

        return this.#token;
    }
    getUser() {
        return this.#user;
    }
    async setUser(user) {
        this.#user = user;
        WebStorage.storeToWebDB('local', this.userResourcename, this.#user);
    }
    async setToken(token) {
        this.#token = token;
        WebStorage.storeToWebDB('local', this.tokenResourcename, this.#token);
    }
    async login(payload) {
        try {
            await this.setToken(payload);
            await this.setUser(JSON.parse(atob(payload.split(".")[1])));
            return this.getUser();
        } catch (error) {
            useToast().error(error.message);
        }
    }
    //If you don't call this method logout, you must give it this alias how you
    //prefer
    async logout() {
        this.#token = null;
        this.#user = null;
        WebStorage.RemoveFromStorage('local', this.tokenResourcename);
        WebStorage.RemoveFromStorage('local', this.userResourcename);
        window.location.reload(true)  // You may also want to remove token from cookies.
    }
}

export default new AuthService();