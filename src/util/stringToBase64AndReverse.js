class Base64Util{
    toBase64String(value) {
        return btoa(value);
    }
    fromBase64String(value) {
        return atob(value);
    }
}

export default new Base64Util();