import { Utility } from "utils/common";
import { request } from "utils/axios";

export const PositionApi = {
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}admin-query/function/search`,
            data,
            headers
        )
    },
    async create(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/function/create`,
            data
        )
    },
    async update(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/function/update/${data.id}`,
            data.body
        )
    },
    async findById(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/function/find-by-id/${id}`,
            {},
            headers
        )
    },
    async updateStatus(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/function/update-status/${id}`,
            data
        )
    },
    async getHistory(id, data = {}) {
        return await request(
            'GET',
            `${process.env.API_HOST}admin-command/function/get-history/${id}`,
            data
        )
    }
}
