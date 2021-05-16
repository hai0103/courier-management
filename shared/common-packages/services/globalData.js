import {trans} from "utils/helpers";

export const GlobalData = {
    gender() {
        return [
            {
                label: trans('global.male'),
                value: 0
            },
            {
                label: trans('global.feMale'),
                value: 1
            },
            {
                label: trans('global.other'),
                value: 2
            },
        ]
    },
    personalIDType() {
        return [
            {
                label: "CMND",
                value: 0
            },
            {
                label: "CCCD",
                value: 1
            }
        ]
    },
    agentAddressType() {
        return [
            {
                label: trans('global.businessAddress'),
                value: 0
            },
            {
                label: trans('global.tradingAddress'),
                value: 1
            },
        ]
    },
    agentType() {
        return [
            {
                label: trans('global.personal'),
                value: 0,
            },
            {
                label: trans('global.organizational'),
                value: 1,
            },
        ]
    },
    allocationType() {
        return [
            {
                label: trans('global.agency'),
                value: 0,
            },
            {
                label: trans('global.partner'),
                value: 1,
            },
        ]
    }
}