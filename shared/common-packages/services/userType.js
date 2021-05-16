import {Utility} from "utils/common";
import {request} from "utils/axios";

export const UserTypeApi = {
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}api/user-type/search`,
            data,
            headers
        )
    },
    async getAll(data, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/user-type/all`,
            {},
            headers
        )
    },
    async create(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}api/user-type/create`,
            data
        )
    },
    async update(id, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}api/user-type/update/${id}`,
            data
        )
    },
    async delete(id) {
        return await request(
            'POST',
            `${process.env.API_HOST}api/user-type/delete/${id}`
        )
    },
    async findById(id, useInternal = false, headers = {}) {
        // const data = {id};
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/user-type/get-by-id/${id}`,
            {},
            headers
        )
    },
}
