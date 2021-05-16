import { Utility } from "utils/common";
import { request } from "utils/axios";
import {API_HOST} from "../../../constants/common";

const SYSTEM_FRAME_ID = '111111-111111'

export const DecentralizationApi = {
    async getSystemRoles(data = {}, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}auth-query/role/get-list-role`,
            {
                type: 'SYSTEM',
                ...data
            },
            headers
        )
    },
    async getBusinessRoles(data = {}, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}auth-query/role/get-list-role`,
            {
                type: 'BUSINESS',
                ...data
            },
            headers
        )
    },
    async getPositionRoles(data = {}, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}auth-query/role/get-list-role`,
            {
                type: 'POSITION',
                ...data
            },
            headers
        )
    },
    async getPermissionFrame(data = {}, useInternal = false, headers = {}) {
        if (!data['functionId']) {
            data['functionId'] = SYSTEM_FRAME_ID
        }

        return await request(
            'POST',
            `${Utility.getRemoteHost(useInternal)}auth-query/permission-frame/find-by-function-id`,
            data,
            headers
        )
    },
    async assignSystemPermission(frameId, data) {
        return await request(
            'POST',
            `${API_HOST}auth-command/permission-frame/${frameId}/switch-status-system-permission`,
            data
        )
    },
    async assignBusinessPermission(frameId, data) {
        return await request(
            'POST',
            `${API_HOST}auth-command/permission-frame/${frameId}/switch-status-business-permission`,
            data
        )
    },
    async getHistory(data = {}) {
        if (!data['frameId']) {
            data['frameId'] = SYSTEM_FRAME_ID
        }
        return await request(
            'GET',
            `${process.env.API_HOST}auth-command/permission-frame/get-history/${data['frameId']}`,
            data
        )
    },
}
