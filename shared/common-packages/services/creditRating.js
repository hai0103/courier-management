import { Utility } from "utils/common";
import { request } from "utils/axios";

export const CreditRatingApi = {
    async getListCompany(useInternal = false, headers = {}) {
        return await request(
            'GET',
            `${Utility.getRemoteHost(useInternal)}reinsurance-query/credit-rating/get-list-company`,
            {},
            headers
        )
    }
}
