import {Response} from "utils/common";
import {AddressApi} from "services/address";

export default class AddressHelpers {
    static async getDistricts (e) {
        const response = await AddressApi.getDistrictsById(e)
        return Response.getAPIData(response) || []
    }

    static async getWards (e) {
        const response = await AddressApi.getWardsById(e)
        return Response.getAPIData(response) || []
    }
}
