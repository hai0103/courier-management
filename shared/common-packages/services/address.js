import { Utility } from "utils/common";
import { request } from "utils/axios";

export const AddressApi = {
    async getNationalities(useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/address-info/get-list-nationality`,
            {},
            headers
        )
    },
    async getProvinces(useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/address-info/get-list-province`,
            {},
            headers
        )
    },
    async getDistricts(provinceId, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/address-info/get-list-district-by-province-id/${provinceId}`,
            {},
            headers
        )
    },
    async getWards(districtId, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/address-info/get-list-ward-by-district-id/${districtId}`,
            {},
            headers
        )
    }
}
