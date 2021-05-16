export const LOGIN_SERVICE_URI =  `${process.env.API_HOST}api/user/login`;
export const LOGOUT_SERVICE_URI =  `${process.env.AUTH_HOST}oauth/logout?redirect=${process.env.AUTH_LOGOUT_CALLBACK}`;
export const AUTH_LOGIN_SERVICE_URI =  `${process.env.AUTH_HOST}oauth/authorize?client_id=${process.env.AUTH_CLIENT_ID}&redirect_uri=${process.env.AUTH_CALLBACK}&response_type=code`;
export const AUTH_TOKEN_SERVICE_URI =  `${process.env.AUTH_HOST}oauth/token`;
