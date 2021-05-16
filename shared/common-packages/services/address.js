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
            `${Utility.getRemoteHost(useInternal)}api/location/provinces`,
            {},
            headers
        )
    },
    async getDistricts(useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/location/districts`,
            {},
            headers
        )
    },
    async getWards(useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/location/wards`,
            {},
            headers
        )
    },
    async getDistrictsById(provinceId, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/location/districts/${provinceId}`,
            {},
            headers
        )
    },
    async getWardsById(districtId, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}api/location/wards/${districtId}`,
            {},
            headers
        )
    }
}
