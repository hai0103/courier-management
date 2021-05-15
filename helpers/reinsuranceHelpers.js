import {ReinsuranceApi} from "services/reinsurance";
import {Response} from "utils/common";

export default class ReinsuranceHelpers {
    static async getReinsurance (keyword, filters = {}) {
        const response = await ReinsuranceApi.getList({
            keyword: keyword || "",
            pageSize: 10,
            pageNumber: 0,
            sort: [
                {
                    key: "reinsuranceNameSort",
                    asc: true
                }
            ],
            ...filters
        })

        return Response.getAPIData(response).content || []
    }
}