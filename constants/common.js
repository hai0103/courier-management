import {AUTH_LOGIN_SERVICE_URI, LOGIN_SERVICE_URI} from "globalConstants/serviceUri";

export const APP_SETTINGS = {
    NAME: 'Reinsurance System',
};

export const IMAGES = {
    // LOGO: '/app-assets/images/logo/alpaca-logo.svg',
    LOGO: '/app-assets/images/logo/img_2.png',
    SHORT_LOGO: '/app-assets/images/logo/logo.svg',
    WHITE_LOGO: '/app-assets/images/logo/img_1.png',
    // WHITE_LOGO: '/app-assets/images/logo/alpaca-logo-white.png',
    ANIMATE_LOGO: '/app-assets/images/logo/logo_ani.gif',
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    PROFILE: '/profile',
    EMPLOYEE: '/organization/employee',
    NEW_EMPLOYEE: '/organization/employee/new',
    POST_OFFICE: '/organization/post-office',
    NEW_POST_OFFICE: '/organization/post-office/new',
    DEALER: '/organization/dealer',
    NEW_DEALER: '/organization/dealer/new',
    ORDER: '/delivery/order',
    NEW_ORDER: '/delivery/order/new',
    CONFIG_FORMULA: '/delivery/config-formula',
    CRM_DASHBOARD: '/crm/dashboard',
    CRM_NEW_ORDER: '/crm/order/new',
    CRM_ORDER:'/crm/order',
    CRM_MONEY:'/crm/money',
    CRM_SEARCH_POST_OFFICE:'/crm/search-post-office',
    CRM_SEARCH_POSTAGE:'/crm/estimate-postage',
    CRM_ADDRESS:'/crm/address',
    CRM_RECEIVER:'/crm/receiver',
    CRM_PACKAGE:'/crm/package',



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
        title: 'mainMenu.dashboard',
        falIcon: 'fa-tachometer-alt',
        href: ROUTES.HOME,
    },
    {
        title: 'mainMenu.organizationsManagement',
        isLabel: true,
    },
    {
        title: 'mainMenu.employee',
        falIcon: 'fa-user',
        href: ROUTES.EMPLOYEE,
    },
    {
        title: 'mainMenu.postOffice',
        falIcon: 'fa-mailbox',
        href: ROUTES.POST_OFFICE,
    },
    {
        title: 'mainMenu.dealer',
        falIcon: 'fa-users',
        href: ROUTES.DEALER,
    },
    {
        title: 'mainMenu.deliveryManagement',
        isLabel: true,
    },
    {
        title: 'mainMenu.order',
        falIcon: 'fa-truck-loading',
        href: ROUTES.ORDER,
    },
    // {
    //     title: 'mainMenu.processStatus',
    //     falIcon: 'fa-signal',
    //     href: ROUTES.ORDER,
    // },
    {
        title: 'mainMenu.configFormula',
        falIcon: 'fa-calculator-alt',
        href: ROUTES.CONFIG_FORMULA,
    },
    {
        title: 'mainMenu.permissionManagement',
        isLabel: true,
    },
    {
        title: 'mainMenu.userType',
        falIcon: 'fa-user-tag',
        href: ROUTES.HIERARCHY
    },
    {
        title: 'mainMenu.configPermission',
        falIcon: 'fa-user-shield',
        href: ROUTES.SYSTEM_DECENTRALIZATION,
    },
    {
        title: 'mainMenu.otherManagement',
        isLabel: true,
    },
    {
        title: 'mainMenu.service',
        falIcon: 'fa-chart-network',
        href: ROUTES.DISTRIBUTION_CHANNEL,
    },
    {
        title: 'mainMenu.voucher',
        falIcon: 'fa-percentage',
        href: ROUTES.AGENCY,
    },
    {
        title: 'mainMenu.dispatch',
        falIcon: 'fa-file-alt',
        href: ROUTES.DISTRIBUTION_PARTNER,
    },
    {
        title: 'mainMenu.post',
        falIcon: 'fa-newspaper',
        href: ROUTES.ALLOCATION,
    },
    {
        title: 'mainMenu.feedback',
        falIcon: 'fa-file-chart-line',
        href: ROUTES.ALLOCATION,
    },
    {
        title: 'mainMenu.report',
        falIcon: 'fa-user-plus',
        href: ROUTES.ALLOCATION,
    }
]


export const MAIN_MENU_CRM = [
    {
        title: 'mainMenu.dashboard',
        falIcon: 'fa-tachometer-alt',
        href: ROUTES.CRM_DASHBOARD,
    },
    {
        title: 'mainMenu.newOrder',
        falIcon: 'fa-newspaper',
        href: ROUTES.CRM_NEW_ORDER,
    },
    {
        title: 'mainMenu.manage',
        isLabel: true,
    },
    {
        title: 'mainMenu.order',
        falIcon: 'fa-truck-loading',
        href: ROUTES.CRM_ORDER,
    },
    {
        title: 'mainMenu.orderMoney',
        falIcon: 'fa-money-check-alt',
        href: ROUTES.CRM_MONEY,
    },
    {
        title: 'mainMenu.address',
        falIcon: 'fa-mailbox',
        href: ROUTES.CRM_ADDRESS,
    },
    {
        title: 'mainMenu.receiver',
        falIcon: 'fa-users',
        href: ROUTES.CRM_RECEIVER,
    },
    {
        title: 'mainMenu.package',
        falIcon: 'fa-box-open',
        href: ROUTES.CRM_PACKAGE,
    },
    {
        title: 'mainMenu.search',
        isLabel: true,
    },
    {
        title: 'mainMenu.postOffice',
        falIcon: 'fa-mailbox',
        href: ROUTES.CRM_SEARCH_POST_OFFICE
    },
    {
        title: 'mainMenu.postage',
        falIcon: 'fa-search-dollar',
        href: ROUTES.CRM_SEARCH_POSTAGE
    }
]

export const MAIN_MENU_EMPLOYEE = [
    {
        title: 'mainMenu.dashboard',
        falIcon: 'fa-tachometer-alt',
        href: ROUTES.HOME,
    },
    {
        title: 'mainMenu.deliveryManagement',
        isLabel: true,
    },
    {
        title: 'mainMenu.order',
        falIcon: 'fa-truck-loading',
        href: ROUTES.ORDER,
    },

]

export const MAIN_MENU_SHIPPER = [
    {
        title: 'mainMenu.dashboard',
        falIcon: 'fa-tachometer-alt',
        href: ROUTES.HOME,
    },
    {
        title: 'mainMenu.deliveryManagement',
        isLabel: true,
    },
    {
        title: 'mainMenu.order',
        falIcon: 'fa-truck-loading',
        href: ROUTES.ORDER,
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

