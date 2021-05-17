import {Utility} from "utils/common";
import {request} from "utils/axios";

export const UserApi = {
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/user/search`,
            data,
            headers
        )
    },
    async getAll(data, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/user/all`,
            {},
            headers
        )
    },
    async create(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}api/user/create`,
            data
        )
    },
    async update(id, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}api/user/update/${id}`,
            data
        )
    },
    async updateEmail(id, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}auth-command/user/change-email/${id}`,
            data
        )
    },
    async updateSystemRole(id, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}auth-command/user/${id}/update-system-role`,
            data
        )
    },
    async delete(id) {
        return await request(
            'POST',
            `${process.env.API_HOST}auth-command/user/delete-user/${id}`
        )
    },
    async findById(id, useInternal = false, headers = {}) {
        // const data = {id};
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/user/get-by-id/${id}`,
            {},
            headers
        )
    },
    async activeUser(data) {
        const body = data.request;
        return await request(
            'POST',
            `${process.env.API_HOST}auth-command/user/authenticate-internal-user/${data.id}`,
            body
        )
    },
    async block(id) {
        return await request(
            'POST',
            `${process.env.API_HOST}auth-command/user/block-user/${id}`
        )
    },
    async unblock(id) {
        return await request(
            'POST',
            `${process.env.API_HOST}auth-command/user/unblock-user/${id}`
        )
    },

    async updateStatus(id, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}api/user/update-status/${id}`,
            data
        )
    },

    async resetPassword(data) {
        const token = data.token || '';
        return await request(
            'POST',
            `${process.env.API_HOST}auth-command/user/reset-password/?token=${token}`,
            data
        )
    },
    async changeExpiredPassword(data) {
        const username = data.username || '';
        return await request(
            'POST',
            `${process.env.API_HOST}auth-command/user/change-expired-password/${username}`,
            data
        )
    },
    async validateResetPassCode(token) {
        return await request(
            'GET',
            `${process.env.API_HOST}auth-query/user/validate-reset-password-code/${token}`,
        )
    },
    async validateActiveUserCode(token) {
        return await request(
            'GET',
            `${process.env.API_HOST}auth-query/user/validate-activation-user-code/${token}`,
        )
    },
    async resendEmailActiveUser(id) {
        return await request(
            'POST',
            `${process.env.API_HOST}auth-command/user/resend-email-active-user/${id}`
        )
    },
    async getHistory(id, data = {}) {
        return await request(
            'GET',
            `${process.env.API_HOST}auth-command/user/get-history/${id}`,
            data
        )
    },
    async getProfile(headers = []) {
        return await request(
            'GET',
            `${process.env.API_HOST}auth-query/user/me`,
            {},
            headers
        )
    },
    async getPermissions() {
        return await request(
            'GET',
            `${process.env.API_HOST}auth-query/user/list-permission`
        )
    },
    async changePassword(username, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}auth-command/user/change-password/${username}`,
            data
        )
    },
    async getListByDepartment(departmentId) {
        return await request(
            'GET',
            `${process.env.API_HOST}auth-query/user/list-user-by-department-id/${departmentId}`
        )
    },
    async getListByCompany(companyId) {
        return await request(
            'GET',
            `${process.env.API_HOST}auth-query/user/list-user-by-company-id/${companyId}`
        )
    },
}



















// import {Utility} from "utils/common";
// import {request} from "utils/axios";
//
// export const UserApi = {
//     async getList(data, useInternal = false, headers = {}) {
//         return await request(
//             'POST',
//             `${Utility.getRemoteHost(useInternal)}auth-query/user/search-list`,
//             data,
//             headers
//         )
//     },
//     async create(data) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/create-internal-user`,
//             data
//         )
//     },
//     async update(id, data) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/update-internal-user/${id}`,
//             data
//         )
//     },
//     async updateRole(id, data) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/update-primary-role/${id}`,
//             data
//         )
//     },
//     async createSecondaryRole(id, data) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/${id}/secondary-role/create`,
//             data
//         )
//     },
//     async updateSecondaryRole(id, roleId, data) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/${id}/secondary-role/update/${roleId}`,
//             data
//         )
//     },
//     async deleteSecondaryRole(id, roleId) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/${id}/secondary-role/delete/${roleId}`
//         )
//     },
//     async getSecondaryRoles(id) {
//         return await request(
//             'GET',
//             `${process.env.API_HOST}auth-query/user/${id}/list-secondary-role`
//         )
//     },
//     async updateEmail(id, data) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/change-email/${id}`,
//             data
//         )
//     },
//     async updateSystemRole(id, data) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/${id}/update-system-role`,
//             data
//         )
//     },
//     async delete(id) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/delete-user/${id}`
//         )
//     },
//     async findById(id, useInternal = false, headers = {}) {
//         // const data = {id};
//         return await request(
//             'GET',
//             `${Utility.getRemoteHost(useInternal)}api/user/get-by-id/${id}`,
//             {},
//             headers
//         )
//     },
//     async activeUser(data) {
//         const body = data.request;
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/authenticate-internal-user/${data.id}`,
//             body
//         )
//     },
//     async block(id) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/block-user/${id}`
//         )
//     },
//     async unblock(id) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/unblock-user/${id}`
//         )
//     },
//
//     async updateStatus(id, data = {}) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/update-status/${id}`,
//             data
//         )
//     },
//
//     async resetPassword(data) {
//         const token = data.token || '';
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/reset-password/?token=${token}`,
//             data
//         )
//     },
//     async changeExpiredPassword(data) {
//         const username = data.username || '';
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/change-expired-password/${username}`,
//             data
//         )
//     },
//     async validateResetPassCode(token) {
//         return await request(
//             'GET',
//             `${process.env.API_HOST}auth-query/user/validate-reset-password-code/${token}`,
//         )
//     },
//     async validateActiveUserCode(token) {
//         return await request(
//             'GET',
//             `${process.env.API_HOST}auth-query/user/validate-activation-user-code/${token}`,
//         )
//     },
//     async resendEmailActiveUser(id) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/resend-email-active-user/${id}`
//         )
//     },
//     async getHistory(id, data = {}) {
//         return await request(
//             'GET',
//             `${process.env.API_HOST}auth-command/user/get-history/${id}`,
//             data
//         )
//     },
//     async getProfile(headers = []) {
//         return await request(
//             'GET',
//             `${process.env.API_HOST}auth-query/user/me`,
//             {},
//             headers
//         )
//     },
//     async getPermissions() {
//         return await request(
//             'GET',
//             `${process.env.API_HOST}auth-query/user/list-permission`
//         )
//     },
//     async changePassword(username, data) {
//         return await request(
//             'POST',
//             `${process.env.API_HOST}auth-command/user/change-password/${username}`,
//             data
//         )
//     },
//     async getListByDepartment(departmentId) {
//         return await request(
//             'GET',
//             `${process.env.API_HOST}auth-query/user/list-user-by-department-id/${departmentId}`
//         )
//     },
//     async getListByCompany(companyId) {
//         return await request(
//             'GET',
//             `${process.env.API_HOST}auth-query/user/list-user-by-company-id/${companyId}`
//         )
//     },
//     async getListRepresentative(userId) {
//         return await request(
//             'GET',
//             `${process.env.API_HOST}auth-query/user/list-representative/${userId}`
//         )
//     },
// }
