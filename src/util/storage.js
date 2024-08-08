class WebStorage {

    cookies = document.cookie;
    /**
     * 
     * @param {*} storageType local, session, cookie
     * @param {*} resourceName 
     * @param {*} resource 
     * @returns 
     */
    storeToWebDB(storageType, resourceName, resource) {
        let foundResource = '';
        switch (storageType) {
            case 'local':
                return localStorage.setItem(resourceName, JSON.stringify(resource));
            case 'session':
                return sessionStorage.setItem(resourceName, JSON.stringify(resource));
            case 'cookie':
                foundResource = this.CheckItemIfExist(this.cookies.split(';'), `${resourceName}=`, 'array', '', true);
                if (!foundResource) {
                    document.cookie = `${resourceName}=${resource}`
                }
                this.cookies = this.cookies.filter((ft) => {
                    return `${ft}=` !== `${resourceName}=`;
                });
                this.cookies += `${resourceName}=${resource}`;
                return document.cookie = this.cookies;

            default: return new Error("Unknown Web storage");
        }
    }
    CheckItemIfExist(tray, item, typeOfTray, keyInTrayItem = '', isCookie = false) {
        let obj = {}
        switch (typeOfTray) {
            case 'array':
                obj = tray.find((i) => {
                    if (keyInTrayItem !== '') {
                        return i[keyInTrayItem] === item;
                    }
                    if (isCookie) {
                        return `${i}=` === item;
                    }
                    return i === item;
                });
                return obj;
            case 'object':
                return tray[item];
            default: return new Error("Undefied Type");
        }
    }
    /**
     * 
     * @param {*} storageType - 'local, session, cookie'
     * @param {*} resourceName 
     * @returns 
     */
    GetFromWebStorage(storageType, resourceName) {
        let resource = '';
        switch (storageType) {
            case 'local':
                resource = localStorage.getItem(resourceName) || 'null';
                resource = JSON.parse(resource);
                return resource;
            case 'session':
                resource = sessionStorage.getItem(resourceName) || 'null';
                resource = JSON.parse(resource);
                return resource;
            case 'cookie':
                resource = this.CheckItemIfExist(this.cookies.split(';'), `${resourceName}=`, 'array', '', true);
                return resource;
        }
    }
    RemoveFromStorage(storageType, resourceName) {
        switch (storageType) {
            case 'local':
                localStorage.removeItem(resourceName);
                break;
            case 'session':
                sessionStorage.removeItem(resourceName);
                break;
            case 'cookie':
                this.CheckItemIfExist(this.cookies.split(';'), `${resourceName}=`, 'array', '', true);
                break;
        }
    }

}

export default new WebStorage();