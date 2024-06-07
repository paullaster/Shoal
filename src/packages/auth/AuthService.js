class AuthService {
    constructor() {
        this.isLoggedIn = false;
        this.token = null;
        this.user = null;
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
    }
    login(user, token) {
        this.user = user;
        this.token = token;
        this.isLoggedIn = true;
    }
    logout() {}
    isAuthenticated() {
        return this.isLoggedIn;
    }
}

export default new AuthService();