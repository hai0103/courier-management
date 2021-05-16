import {Utility} from "utils/common";
import {request} from "utils/axios";
import {API_HOST} from "constants/common";

export const HierarchyApi = {
    async getList(data = {}, useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}auth-query/hierarchy-frame/get-list`,
            {
                status: 1
            },
            headers
        )
    },
    async findById(data = {}, useInternal = false, headers = {}) {
        const hieFrameId = data?.frameId
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}auth-query/hierarchy-frame/find-by-id/${hieFrameId}`,
            {},
            headers
        )
    },
    async updateData(frameId, data) {
        return await request(
            'POST',
            `${API_HOST}auth-command/hierarchy-frame/${frameId}/update-data`,
            data
        )
    },
    async getHistory(data = {}) {
        return await request(
            'GET',
            `${process.env.API_HOST}auth-command/hierarchy-frame/get-history/${data['frameId']}`,
            data
        )
    },
}
