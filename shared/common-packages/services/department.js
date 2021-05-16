import { Utility } from "utils/common";
import { request } from "utils/axios";

export const DepartmentApi = {
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}admin-query/department/search`,
            data,
            headers
        )
    },
    async create(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/department/create`,
            data
        )
    },
    async update(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/department/update/${data.id}`,
            data.body
        )
    },
    async findById(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/department/find-by-id/${id}`,
            {},
            headers
        )
    },
    async getListFunctionById(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/department/get-list-function-by-id/${id}`,
            {},
            headers
        )
    },
    async updateStatus(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/department/update-status/${id}`,
            data
        )
    },
    async getHistory(id, data = {}) {
        return await request(
            'GET',
            `${process.env.API_HOST}admin-command/department/get-history/${id}`,
            data
        )
    }
}
