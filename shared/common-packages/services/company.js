import { Utility } from "utils/common";
import { request } from "utils/axios";

export const CompanyApi = {
    async getList(data, useInternal = false, headers = {}) {
        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}admin-query/company/search`,
            data,
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
    async createBankAccount(idCompany, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/company/${idCompany}/bank-account/create`,
            data
        )
    },
    async updateBankAccount(idCompany, bankId, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/company/${idCompany}/bank-account/update/${bankId}`,
            data
        )
    },
    async deleteBankAccount(idCompany, bankId, data) {
        return await request(
            'POST',
            `${process.env.API_HOST}admin-command/company/${idCompany}/bank-account/delete/${bankId}`,
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
    async getBankAccount(id, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/company/${id}/list-bank-account`,
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
    async getHistory(id, data = {}) {
        return await request(
            'GET',
            `${process.env.API_HOST}admin-command/company/get-history/${id}`,
            data
        )
    },
}
