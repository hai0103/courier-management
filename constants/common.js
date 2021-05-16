import {AUTH_LOGIN_SERVICE_URI, LOGIN_SERVICE_URI} from "globalConstants/serviceUri";

export const APP_SETTINGS = {
    NAME: 'Reinsurance System',
};

export const IMAGES = {
    LOGO: '/app-assets/images/logo/alpaca-logo.svg',
    SHORT_LOGO: '/app-assets/images/logo/logo.svg',
    WHITE_LOGO: '/app-assets/images/logo/img_1.png',
    // WHITE_LOGO: '/app-assets/images/logo/alpaca-logo-white.png',
    ANIMATE_LOGO: '/app-assets/images/logo/logo_ani.gif',
};

export const ROUTES = {
    HOME: '/',
    LOGIN: LOGIN_SERVICE_URI,
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    PROFILE: '/profile',
    REINSURANCE: '/reinsurance',
    NEW_REINSURANCE: '/reinsurance/new',
    REINSURANCE_CLASS: '/reinsurance-class',
    NEW_REINSURANCE_CLASS: '/reinsurance-class/new',
    USER: '/users',
    NEW_USER: '/users/new',
    COMPANY: '/companies',
    NEW_COMPANY: '/companies/new',
    DEPARTMENT: '/departments',
    NEW_DEPARTMENT: '/departments/new',
    POSITION: '/position',
    NEW_POSITION: '/position/new',
    HIERARCHY: '/hierarchy',
    SYSTEM_DECENTRALIZATION: '/decentralization/system',
    BUSINESS_DECENTRALIZATION: '/decentralization/business',
    DISTRIBUTION_CHANNEL: '/distribution/distribution-channel',
    DISTRIBUTION_CHANNEL_NEW: '/distribution/distribution-channel/new',
    AGENCY: '/distribution/agency',
    NEW_AGENCY: '/distribution/agency/new',
    DISTRIBUTION_PARTNER: '/distribution/partner',
    DISTRIBUTION_PARTNER_NEW: '/distribution/partner/new',
    ALLOCATION: '/distribution/allocation',
    ALLOCATION_NEW: '/distribution/allocation/new',
    INSURANCE_COMPANY: '/partner/insurance-company',
    INSURANCE_COMPANY_NEW: '/partner/insurance-company/new',

};

export const MAIN_MENU = [
    {
        title: 'mainMenu.users',
        falIcon: 'fa-user',
        href: ROUTES.USER,
    },
    {
        title: 'mainMenu.reinsurance',
        falIcon: 'fa-user',
        href: ROUTES.REINSURANCE,
    },
    {
        title: 'mainMenu.organization',
        isLabel: true,
    },
    {
        title: 'mainMenu.company',
        falIcon: 'fa-building',
        href: ROUTES.COMPANY,
    },
    {
        title: 'mainMenu.department',
        falIcon: 'fa-warehouse-alt',
        href: ROUTES.DEPARTMENT,
    },
    {
        title: 'mainMenu.function',
        falIcon: 'fa-project-diagram',
        href: ROUTES.POSITION,
    },
    {
        title: 'mainMenu.decentralization',
        isLabel: true,
    },
    {
        title: 'mainMenu.hierarchy',
        falIcon: 'fa-layer-group',
        href: ROUTES.HIERARCHY
    },
    {
        title: 'mainMenu.systemDecentralization',
        falIcon: 'fa-sitemap',
        href: ROUTES.SYSTEM_DECENTRALIZATION,
    },
    {
        title: 'mainMenu.businessDecentralization',
        falIcon: 'fa-boxes',
        href: ROUTES.BUSINESS_DECENTRALIZATION,
    },
    {
        title: 'mainMenu.distributionChannel',
        isLabel: true,
    },
    {
        title: 'mainMenu.distributionChannel',
        falIcon: 'fa-chart-network',
        href: ROUTES.DISTRIBUTION_CHANNEL,
    },
    {
        title: 'mainMenu.agency',
        falIcon: 'fa-users',
        href: ROUTES.AGENCY,
    },
    {
        title: 'mainMenu.distributionPartner',
        falIcon: 'fa-handshake',
        href: ROUTES.DISTRIBUTION_PARTNER,
    },
    {
        title: 'mainMenu.allocation',
        falIcon: 'fa-user-plus',
        href: ROUTES.ALLOCATION,
    },
    {
        title: 'mainMenu.partner',
        isLabel: true,
    },
    {
        title: 'mainMenu.insuranceCompany',
        falIcon: 'fa-hospital-user',
        href: ROUTES.INSURANCE_COMPANY,
    },
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

