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
    },
    processStatus() {
        return [
            {
                label: "Tất cả",
                value: 0,
            },
            {
                label: "Chờ lấy",
                value: 1,
            },
            {
                label: 'Đang vận chuyển',
                value: 2,
            },
            {
                label: "Đang giao",
                value: 3,
            },
            {
                label: "Giao thành công",
                value: 4,
            },
            {
                label: "Chờ xử lý",
                value: 5,
            },
            {
                label: "Đang chuyển hoàn",
                value: 6,
            },
            {
                label: "Đã duyệt hoàn",
                value: 7,
            },
            {
                label: "Phát lại",
                value: 8,
            },
            {
                label: "Đã trả",
                value: 9,
            },
            {
                label: "Tạo mới",
                value: 10,
            },
            {
                label: "Đã lấy",
                value: 11,
            },
            {
                label: "Đã hủy",
                value: 12,
            },
        ];
    },
    processStatusPayment() {
        return [
            {
                label: "Chưa đối soát",
                value: 4,
            },
            {
                label: "Đã đối soát",
                value: 13,
            },
            {
                label: "Đã trả tiền",
                value: 14,
            },
        ];
    },
}
