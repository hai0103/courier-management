import { Utility } from "utils/common";
import { request } from "utils/axios";

export const BankApi = {
    async getList(useInternal = false, headers) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}admin-query/bank/get-list-bank`,
            {},
            headers
        )
    },
}