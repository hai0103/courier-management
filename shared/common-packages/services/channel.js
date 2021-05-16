import { Utility } from "utils/common";
import { request } from "utils/axios";

export const ChannelApi = {
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}admin-query/distribution-channel/search`,
            data,
            headers
        )
    },
    async create(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-channel/create`,
            data
        )
    },
    async update(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-channel/${data.id}/update`,
            data.body
        )
    },
    async findById(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/distribution-channel/find-by-id/${id}`,
            {},
            headers
        )
    },
    async getHistory(id, data = {}) {
        return await request(
            'GET',
            `${process.env.API_HOST}admin-command/distribution-channel/get-history/${id}`,
            data
        )
    },
    async getUploadedDocument(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-query/distribution-channel/${id}/get-list-document`,
            data
        )
    },
    async uploadDocument(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-channel/${id}/upload-document`,
            data
        )
    },
    async deleteDocument(channelId, attachmentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-channel/${channelId}/delete-document/${attachmentId}`,
            data
        )
    },
    async updateDocument(channelId, documentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-channel/${channelId}/update-document/${documentId}`,
            data
        )
    },
    async updateAttachment(channelId, attachmentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/distribution-channel/${channelId}/update-attachment/${attachmentId}`,
            data
        )
    },
}
