const path = require('path')
module.exports = {
    env: {
        SERVICE_HOST: process.env.SERVICE_HOST,
        SERVICE_X_API_KEY: process.env.SERVICE_X_API_KEY,
        SERVICE_CLIENT_SECRET: process.env.SERVICE_CLIENT_SECRET,
        SERVICE_CLIENT_ID: process.env.SERVICE_CLIENT_ID,
        SERVICE_CLIENT_GRANT_TYPE: process.env.SERVICE_CLIENT_GRANT_TYPE,
        // API_HOST: process.env.API_HOST,
        API_HOST: 'http://localhost:49981/',
        // INTERNAL_API_HOST: process.env.USE_INTERNAL ? process.env.INTERNAL_API_HOST : process.env.API_HOST,
        INTERNAL_API_HOST: 'http://localhost:49981/',
        AUTH_HOST: 'http://localhost:49981/',
        // AUTH_HOST: process.env.AUTH_HOST,
        AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
        AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
        AUTH_CALLBACK: process.env.AUTH_CALLBACK,
        AUTH_LOGOUT_CALLBACK: process.env.AUTH_LOGOUT_CALLBACK,
        SOCKET_HOST: process.env.SOCKET_HOST
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    // async redirects() {
    //     return [
    //         {
    //             source: '/',
    //             destination: '/',
    //             permanent: false
    //         }
    //     ]
    // },
};
