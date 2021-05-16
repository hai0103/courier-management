import { Utility } from "utils/common";
import { request } from "utils/axios";

export const PostOfficeApi = {
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}admin-query/company/search`,
            data,
            headers
        )
    },
    async getAll(data, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/post-office/all`,
            {},
            headers
        )
    },
    async create(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/company/create`,
            data
        )
    },
    async findById(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/company/find-by-id/${id}`,
            {},
            headers
        )
    },
    async update(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/company/update/${data.id}`,
            data
        )
    },
    async delete(id) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/company/delete/${id}`
        )
    },
    async updateStatus(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/company/update-status/${id}`,
            data
        )
    },
}
