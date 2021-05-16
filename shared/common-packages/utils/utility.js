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
}