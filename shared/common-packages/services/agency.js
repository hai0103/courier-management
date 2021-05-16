import { Utility } from "utils/common";
import { request } from "utils/axios";

export const AgencyApi = {
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}admin-query/agency/search`,
            data,
            headers
        )
    },
    async getChildList(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/agency/${id}/get-list-child`,
            {},
            headers
        )
    },
    async create(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/agency/create`,
            data
        )
    },
    async update(id, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/agency/update/${data.id}`,
            data
        )
    },
    async updateAddress(id, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/agency/update-address-info/${id}`,
            data
        )
    },
    async updateStatus(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/agency/update-status/${id}`,
            data
        )
    },

    async findById(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/agency/find-by-id/${id}`,
            {},
            headers
        )
    },
    async getHistory(id, data = {}) {
        return await request(
            'GET',
            `${process.env.API_HOST}admin-command/agency/get-history/${id}`,
            data
        )
    },
    async getUploadedDocument(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-query/agency/${id}/get-list-document`,
            data
        )
    },
    async uploadDocument(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/agency/${id}/upload-document`,
            data
        )
    },
    async deleteDocument(channelId, attachmentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/agency/${channelId}/delete-document/${attachmentId}`,
            data
        )
    },
    async updateDocument(channelId, documentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/agency/${channelId}/update-document/${documentId}`,
            data
        )
    },
    async updateAttachment(channelId, attachmentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/agency/${channelId}/update-attachment/${attachmentId}`,
            data
        )
    },
    async getListFromAllocation(data) {
        return await request(
          'POST',
          `${process.env.API_HOST}admin-query/agency/get-list-from-allocation`,
          data
        )
    },
}
