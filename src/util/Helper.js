class Helper {
    mask(str) {
        if (!str) return '';
        const firstThree = str?.slice(0, 2);
        const lastFour = str?.slice(-2);
        return `${firstThree}*****${lastFour}`;
    }

    countDown(val) {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (val <= 0) {
                    clearInterval(interval);
                    resolve();
                } else {
                    val--;
                }
            }, 1000);
        });
    }
    countDownDisplay(time) {
        return `${Math.floor(time / 60)}:${time % 60 < 10 ? '0' : ''}${time % 60}`;
    }
    capitalizeFirstLetter(s) {
        s = s.split(" ");
        for (let i = 0; i < s.length; i++) {
            s[i] = s[i].charAt(0).toUpperCase() + s[i].slice(1);
        }
        return s.join(" ");
    }
    camelCaseToKebabCase(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }
    safeTypeChecker(input) {
        return Object.prototype.toString.call(input).slice(8, -1);
    }
    removeNullsFromObject(object) {
        const newObject = {};
        for (const [key, value] of Object.entries(object)) {
            switch (this.safeTypeChecker(value)) {
                case 'Null':
                case 'Undefined':
                    continue;
                case 'String': {
                    if (!value.length) continue;
                }
            }
            newObject[key] = value;
        }
        return newObject;
    }
    validateRequiredProperties(obj, requiredProps) {
        if (typeof obj !== 'object' || obj === null) {
            throw new TypeError('Input must be a non-null object');
        }
        if (!Array.isArray(requiredProps) || requiredProps.length === 0) {
            return { valid: true, missing: [] };
        }
        const missing = [];
        for (const prop of requiredProps) {
            if (!Object.prototype.hasOwnProperty.call(obj, prop) || obj[prop] == null) {
                missing.push(prop);
            }
        }
        return { valid: missing.length === 0, missing };
    }
    findObjectFromArray(array, key, value) {
        if (!Array.isArray(array) || !key || (value === undefined || value === null)) return
        const map = new Map(array.map((item) => [item[key], item]))
        return map.get(value)
    }
    getRandomNumber(length = 4) {
        if (typeof length !== 'number' || length <= 0 || !Number.isInteger(length)) {
            throw new TypeError('Length must be a positive integer');
        }
        const digits = '0123456789';
        let result = '';
        let getRandomInt;
        if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
            getRandomInt = (max) => {
                const array = new Uint32Array(1);
                window.crypto.getRandomValues(array);
                return array[0] % max;
            };
        } else if (typeof self !== 'undefined' && self.crypto && self.crypto.getRandomValues) {
            getRandomInt = (max) => {
                const array = new Uint32Array(1);
                self.crypto.getRandomValues(array);
                return array[0] % max;
            };
        } else {
            getRandomInt = (max) => Math.floor(Math.random() * max);
        }
        for (let i = 0; i < length; i++) {
            result += digits[getRandomInt(digits.length)];
        }
        return result;
    }
}

export default new Helper();