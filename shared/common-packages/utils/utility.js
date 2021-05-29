import {API_HOST, INTERNAL_API_HOST} from "../../../constants/common";

export default class Utility {
    static redirect(location) {
        if (Utility.isBrowser()) {
            window.location.href = location;
        }
    }

    static isBrowser() {
        return typeof window !== 'undefined';
    }

    static getRemoteHost(useInternal) {
        return useInternal ? INTERNAL_API_HOST : API_HOST;
    }

    static trimObjValues(obj) {
        return Object.keys(obj).reduce((acc, curr) => {
            acc[curr] = typeof obj[curr] == 'string' ? obj[curr].trim() : obj[curr];
            return acc;
        }, {});
    }

    /* Be careful when use this function. It may cause infinity loop*/
    static waitForLocalStorage(key, cb, timer, times = 0) {
        if (!Utility.isBrowser() || times > 10) return
        if (!localStorage.getItem(key)) return (timer = setTimeout(Utility.waitForLocalStorage.bind(null, key, cb, null, ++times), 200))
        clearTimeout(timer)
        if (typeof cb !== 'function') return localStorage.getItem(key)
        return cb(localStorage.getItem(key))
    }
}
