import {request} from "utils/axios";
import {API_HOST} from "constants/common";

export const AssetApi = {
    async upload(data, headers = {}) {
        const formData = new FormData();
        formData.append('file', data?.file);
        formData.append('type', data?.type);
        return await request(
            'POST',
            `${API_HOST}assets-server/assets/upload`,
            formData,
            {
                'Content-Type': 'multipart/form-data',
                ...headers
            }
        )
    },
    async delete(id, headers = {}) {
        return await request(
            'POST',
            `${API_HOST}assets-server/assets/${id}/delete`,
            {},
            headers
        )
    },
    async multiDelete(ids = [], headers = {}) {
        return await request(
            'POST',
            `${API_HOST}assets-server/assets/delete-list`,
            {
                idList: ids
            },
            headers
        )
    },
    async download(id, headers = {}) {
        return await request(
            'GET',
            `${API_HOST}assets-server/assets/${id}/download`,
            {},
            headers,
            true,
            'blob'
        )
    },
    async uploadMultiFiles(data, headers = {}) {
        const formData = new FormData();
        data.files.map(item => {
            formData.append('files', item.attachment)
        })
        formData.append('type', data?.type);
        return await request(
            'POST',
            `${API_HOST}assets-server/assets/upload-multi-file`,
            formData,
            {
                'Content-Type': 'multipart/form-data',
                ...headers
            }
        )
    },
}
