import { Utility } from "utils/common";
import { request } from "utils/axios";

export const AllocationApi = {
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}admin-query/allocation/search`,
            data,
            headers
        )
    },
    async create(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/allocation/create`,
            data
        )
    },
    async update(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/allocation/update/${data.id}`,
            data.body
        )
    },
    async updateStatus(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/allocation/update-status/${id}`,
            data
        )
    },
    async findById(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/allocation/find-by-id/${id}`,
            {},
            headers
        )
    },
    async getHistory(id, data = {}) {
        return await request(
            'GET',
            `${process.env.API_HOST}admin-command/allocation/get-history/${id}`,
            data
        )
    },
    async importAgency(data = {}, headers = {}) {
        const formData = new FormData();
        formData.append('file', data?.file);
        formData.append('isNew', data?.isNew);
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/allocation/import-agency-file`,
            formData,
            {
                'Content-Type': 'multipart/form-data',
                ...headers
            }
        )
    },
    async importPartner(data = {}) {
        const formData = new FormData();
        formData.append('file', data?.file);
        formData.append('isNew', data?.isNew);
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/allocation/import-partner-file`,
            formData,
            {
                'Content-Type': 'multipart/form-data',
                ...headers
            }
        )
    }
}
