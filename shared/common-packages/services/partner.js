import { Utility } from "utils/common";
import { request } from "utils/axios";

export const PartnerApi = {
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}admin-query/distribution-partner/search`,
            data,
            headers
        )
    },
    async create(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-partner/create`,
            data
        )
    },
    async update(id, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-partner/update/${data.id}`,
            data
        )
    },
    async updateAddress(id, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-partner/update-address-info/${id}`,
            data
        )
    },
    async updateStatus(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-partner/update-status/${id}`,
            data
        )
    },

    async findById(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/distribution-partner/find-by-id/${id}`,
            {},
            headers
        )
    },
    async getHistory(id, data = {}) {
        return await request(
            'GET',
            `${process.env.API_HOST}admin-command/distribution-partner/get-history/${id}`,
            data
        )
    },
    async getUploadedDocument(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-query/distribution-partner/${id}/get-list-document`,
            data
        )
    },
    async uploadDocument(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-partner/${id}/upload-document`,
            data
        )
    },
    async deleteDocument(channelId, attachmentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-partner/${channelId}/delete-document/${attachmentId}`,
            data
        )
    },
    async updateDocument(channelId, documentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-partner/${channelId}/update-document/${documentId}`,
            data
        )
    },
    async updateAttachment(channelId, attachmentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-partner/${channelId}/update-attachment/${attachmentId}`,
            data
        )
    },
    async getChildList(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/distribution-partner/${id}/get-list-child`,
            {},
            headers
        )
    },
    async getListFromAllocation(data) {
        return await request(
          'POST',
          `${process.env.API_HOST}admin-query/distribution-partner/get-list-from-allocation`,
          data
        )
    },

}
