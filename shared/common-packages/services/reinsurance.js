import { Utility } from "utils/common";
import { request } from "utils/axios";

export const ReinsuranceApi = {
    async updateCreditRating(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-command/reinsurance/update-credit-rating/${id}`,
            data
        )
    },
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}reinsurance-query/reinsurance/search`,
            data,
            headers
        )
    },
    async create(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-command/reinsurance/create`,
            data
        )
    },
    async update(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-command/reinsurance/update/${data.id}`,
            data.body
        )
    },
    async findById(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}reinsurance-query/reinsurance/find-by-id/${id}`,
            {},
            headers
        )
    },
    async updateStatus(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-command/reinsurance/update-status/${id}`,
            data
        )
    },
    async getHistory(id, data = {}) {
        return await request(
            'GET',
            `${process.env.API_HOST}reinsurance-command/reinsurance/get-history/${id}`,
            data
        )
    },
    async getListRating(useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}reinsurance-query/credit-rating/get-list-company`,
            {},
            headers
        )
    },
    async getListReinsurance(data, useInternal = false, headers = {}) {
        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}reinsurance-query/reinsurance/get-list-contact-information/${data.id}`,
            data.body,
            headers
        )
    },
    async createContact(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-command/reinsurance/${data.id}/create-contact-information`,
            data.body
        )
    },
    async updateContact(data) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-command/reinsurance/update-contact-information/${data.contactId}`,
            data.body
        )
    },
    async removeContact(id, contactId) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-command/reinsurance/${id}/delete-contact-information/${contactId}`
        )
    },
    async getUploadedDocument(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-query/reinsurance/${id}/get-list-document`,
            data
        )
    },
    async uploadDocument(id, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-command/reinsurance/${id}/upload-document`,
            data
        )
    },
    async deleteDocument(reinsuranceId, attachmentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-command/reinsurance/${reinsuranceId}/delete-document/${attachmentId}`,
            data
        )
    },
    async updateDocument(reinsuranceId, documentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-command/reinsurance/${reinsuranceId}/update-document/${documentId}`,
            data
        )
    },
    async updateAttachment(reinsuranceId, attachmentId, data = {}) {
        return await request(
            'POST',
            `${process.env.API_HOST}reinsurance-command/reinsurance/${reinsuranceId}/update-attachment/${attachmentId}`,
            data
        )
    },
}
