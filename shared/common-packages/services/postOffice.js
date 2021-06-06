import { Utility } from "utils/common";
import { request } from "utils/axios";

export const PostOfficeApi = {
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/post-office/search`,
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
            `${process.env.API_HOST}api/post-office/create`,
            data
        )
    },
    async findById(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/post-office/get-by-id/${id}`,
            {},
            headers
        )
    },
    async update(id, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}api/post-office/update/${id}`,
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
