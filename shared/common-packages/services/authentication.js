import {AUTH_TOKEN_SERVICE_URI, LOGIN_SERVICE_URI, LOGOUT_SERVICE_URI} from "globalConstants/serviceUri";
import Cookies from 'js-cookie';
import qs from "querystring"
import Axios from "axios";
import {removeUserPermissions, removeUserProfile, storeUserProfile} from "utils/localStorage";
import {UserApi} from "services/user";
import {Response, Utility} from "utils/common";

class Authentication {
    static tokenKey = 'access_token';

    static login(user) {
        const payload = {
            // grant_type: process.env.SERVICE_CLIENT_GRANT_TYPE,
            // username: user.username,
            // password: user.password,
            // client_id: process.env.SERVICE_CLIENT_ID,
            // client_secret: process.env.SERVICE_CLIENT_SECRET

            emailOrPhone: user.username,
            password: user.password,

        };

        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        return Axios.post(LOGIN_SERVICE_URI, qs.stringify(payload), header).then(response => {
            // const accessToken = response.data.access_token;
            const accessToken = 'b2b767e4-7206-4903-bbc5-f692cbdedd45';
            Cookies.set(this.tokenKey, accessToken);
            UserApi.findById(response.data.data).then(res => {
                console.log(res)
                const userProfile = res.data.data;
                if (userProfile) {
                    storeUserProfile(userProfile)
                } else {
                    console.error('Can not get user profile when logged in')
                }
            }).catch(() => {
                console.error('Can not get user profile when logged in')
            })
            return response.data;
        }).catch(error => {
            throw error;
        });
    }

    static loginSso(code) {
        const payload = {
            grant_type: 'authorization_code',
            client_id: process.env.AUTH_CLIENT_ID,
            client_secret: process.env.AUTH_CLIENT_SECRET,
            redirect_uri: process.env.AUTH_CALLBACK,
            code: code
        };

        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        return Axios.post(AUTH_TOKEN_SERVICE_URI, qs.stringify(payload), header).then(response => {
            const accessToken = response.data.access_token;

            return UserApi.getProfile({
                Authorization:`Bearer ${accessToken}`
            }).then(res => {
                const userProfile = Response.getAPIData(res);
                if (userProfile) {
                    storeUserProfile(userProfile)
                    Cookies.set(this.tokenKey, accessToken);
                } else {
                    console.error('Can not get user profile when logged in')
                }

                return res
            }).catch(() => {
                console.error('Can not get user profile when logged in')
            })
        }).catch(error => {
            throw error;
        });
    }

    static logout() {
        Authentication.removeAuthentication()
        Utility.redirect('/login');
    }

    static removeAuthentication() {
        Cookies.remove(this.tokenKey);
        removeUserProfile();
        removeUserPermissions();
    }

    static isAuthenticated() {
        const token = Cookies.get(this.tokenKey);
        return token;
    }

    static getAccessToken() {
        const token = Cookies.get(this.tokenKey);
        return token;
    }
}

export default Authentication;
