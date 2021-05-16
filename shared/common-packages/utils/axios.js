import axios from 'axios'
import Authentication from "services/authentication";
import {ERROR_CODE, SERVICE_STATUS_CODE} from "globalConstants/common";
import {Utility} from "utils/common";

axios.interceptors.request.use(function (config) {
    const token = Authentication.getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export function request(method, url, data , headers = {}, isCheck = true, responseType = '') {

    const defaultHeaders = {
        "Content-Type": "application/json",
        ...headers
    }

    const params = {
        method: method,
        url: url,
        headers: defaultHeaders,
    };

    if (responseType) {
        params['responseType'] = responseType
    }

    if (method.toUpperCase() === 'GET') {
        params['params'] = data || {};
    } else {
        params['data'] = data;
    }

    return axios(params).then(response => {
        return response;
    }).catch(error => {

        if (error?.response?.status === SERVICE_STATUS_CODE.UN_AUTHORIZE) {
            Authentication.logout()
        }

        if (error.response && error.response.data && isCheck) {
            const err = error.response.data;
            switch (err.errorCode) {
                case ERROR_CODE.USER_BLOCKED:
                    Authentication.logout()
                    break;
                case ERROR_CODE.USER_PASSWORD_EXPIRED:
                    Utility.redirect('/expired-password');
                    break;
                default:
                    break;
            }
        }

        throw error;
    });
}
