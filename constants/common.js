import {AUTH_LOGIN_SERVICE_URI} from "globalConstants/serviceUri";

export const APP_SETTINGS = {
    NAME: 'Reinsurance System',
};

export const IMAGES = {
    LOGO: '/app-assets/images/logo/alpaca-logo.svg',
    SHORT_LOGO: '/app-assets/images/logo/logo.svg',
    WHITE_LOGO: '/app-assets/images/logo/alpaca-logo-white.png',
    ANIMATE_LOGO: '/app-assets/images/logo/logo_ani.gif',
};

export const ROUTES = {
    HOME: '/reinsurance',
    LOGIN: AUTH_LOGIN_SERVICE_URI,
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    PROFILE: '/profile',
    REINSURANCE: '/reinsurance',
    NEW_REINSURANCE: '/reinsurance/new',
    REINSURANCE_CLASS: '/reinsurance-class',
    NEW_REINSURANCE_CLASS: '/reinsurance-class/new'
};

export const MAIN_MENU = [
    {
        title: 'mainMenu.reinsurance',
        falIcon: 'fa-user',
        href: ROUTES.REINSURANCE,
    },
    {
        title: 'mainMenu.reinsuranceClass',
        falIcon: 'fa-user',
        href: ROUTES.REINSURANCE_CLASS,
    }
]

export const API_HOST = process.env.API_HOST;
export const INTERNAL_API_HOST = process.env.INTERNAL_API_HOST;

export const FORMAT_DATETIME = 'MMMM DD, YYYY HH:mm'

export const ROLES = {
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
    MANAGER: 'MANAGER',
}

export const SYSTEM_PERMISSIONS = {
    ACCESS_ADMIN_CENTER: 'ACCESS_ADMIN_CENTER',
    CONFIG_SYSTEM_PERMISSION: 'CONFIG_SYSTEM_PERMISSION',
    CONFIG_BUSINESS_PERMISSION: 'CONFIG_BUSINESS_PERMISSION',
    CREATE_USER: 'CREATE_USER',
    UPDATE_USER: 'UPDATE_USER',
    BLOCK_UNBLOCK_USER: 'BLOCK_UNBLOCK_USER',
    ASSIGN_SYSTEM_PERMISSION: 'ASSIGN_SYSTEM_PERMISSION',
    CREATE_ORGANIZATION: 'CREATE_ORGANIZATION',
    UPDATE_ORGANIZATION: 'UPDATE_ORGANIZATION',
    ACTIVE_DE_ACTIVE_ORGANIZATION: 'ACTIVE_DEACTIVE_ORGANIZATION',
}

