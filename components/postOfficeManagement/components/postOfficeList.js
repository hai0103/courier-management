import {ROUTES, SYSTEM_PERMISSIONS} from "constants/common";
import Link from "next/link";
import PropTypes from "prop-types";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";
import {UserApi} from "services/user";
import {Response} from "utils/common";
import ContentWrapper from "layouts/contentWrapper";
import Badge from "sharedComponents/blocks/badge";
import DataTable from "sharedComponents/dataTable";
import More from "sharedComponents/more";
import filters from "utils/filters";
import {useDataTable} from "providers/dataTable";
import SocketHelpers from "utils/socketHelpers";
import {useSocket} from "providers/socket";
import {useGate} from "providers/accessControl";
import {PostOfficeApi} from "services/postOffice";
import {AddressApi} from "services/address";

function PostOfficeList(props) {
    const {t} = useTranslation('common');
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState({});
    const [dataDistricts, setDataDistricts] = useState([]);
    const [dataWards, setDataWards] = useState([]);
    const {addToast} = useToasts();
    const {refresh: refreshTable} = useDataTable();
    const {socketClient} = useSocket();
    const [allows] = useGate()

    const statusMapping = (status) => {
        const mapping = {
            1: {
                label: t('status.active'),
                bg: 'success',
            },
            2: {
                label: t('status.waitActive'),
                bg: 'warning',
            },
            0: {
                label: t('status.inactive'),
                bg: 'danger',
            }
        }

        return mapping[status] || [];
    };

    const status = [
        {code: 'DISABLE', id: 0, status: t('status.inactive')},
        {code: 'ACTIVE', id: 1, status: t('status.active')},
    ]

    const actionButton = (row) => {
        return (
            <More>
                 <Link href={`/users/${row.original.id}?readOnly`}>
                    <button className="dropdown-item edit">
                        <i className="fal fa-pen"/>{t('usersManagement.actionBlock.edit')}
                    </button>
                </Link>
                {
                    row.original.status === "2" || row.original.status === "0" ? null :
                        <button className="dropdown-item"
                                disabled={!allows(SYSTEM_PERMISSIONS.BLOCK_UNBLOCK_USER)}
                               onClick={() => {
                                   setSelectedItemId(row.original);
                                   setShowModalConfirm(true)
                               }}
                        >
                            <i className="fal fa-lock"/>
                            {t('usersManagement.actionBlock.lock')}
                        </button>
                }
                {
                    row.original.status === "2" || row.original.status === "1" ? null :
                        <button className="dropdown-item"
                                disabled={!allows(SYSTEM_PERMISSIONS.BLOCK_UNBLOCK_USER)}
                               onClick={() => {
                                   setSelectedItemId(row.original);
                                   setShowModalConfirm(true)
                               }}
                        >
                            <i className="fal fa-unlock"/>
                            {t('usersManagement.actionBlock.unlock')}
                        </button>
                }
                {
                    row.original.status === "2" && <button className="dropdown-item"
                            onClick={() => resendActiveUser(row.original.id)}
                    >
                        <i className="fal fa-sync-alt"/>
                        {t('usersManagement.actionResendActive.title')}
                    </button>
                }
            </More>
        )
    };

    const resendActiveUser = async (id) => {
        UserApi.resendEmailActiveUser(id).then((response) => {
            if (Response.isSuccess(response)) {
                addToast(t('common.message.resendActiveSuccess'), {appearance: 'success'})
            } else {
                addToast(Response.getAPIError(response), {appearance: 'error'});
            }
        }).catch(error => {
            addToast(Response.getErrorMessage(error), {appearance: 'error'})
        });
    }

    const statusHandler = async (payload, entity) => {
        try {
            const response = await UserApi.updateStatus(entity?.id, payload);
            if (Response.isSuccessAPI(response)) {
                const message = entity?.status === "1" ? t('common.message.requestBlockSuccess') : t('common.message.unblockSuccess')
                addToast(message, {appearance: 'success'})
                setShowModalConfirm(false)
                SocketHelpers.fastSubscribe(`/topic/user-updated-status/${entity?.id}`, () => {
                    refreshTable();
                }, socketClient);
            } else {
                addToast(Response.getAPIError(response), {appearance: 'error'});
            }
        } catch (error) {
            addToast(Response.getErrorMessage(error), {appearance: 'error'});
        }
    };

    const dataTable = () => {
        const titleSearch = 'bưu cục';
        const columns = [
            {
                Header: 'Mã bưu cục',
                accessor: 'code',
                sortable: true,
                className: 'td-6 text-truncate',
                headerClassName: 'td-6 text-truncate',
                Cell: ({row = {}}) =>
                    <Link href={`${ROUTES.POST_OFFICE}/${row.original.id}?readOnly`}><a
                        title={row.original.code}>{row.original.code}</a></Link>
            },
            {
                Header: 'Tên bưu cục',
                accessor: 'name',
                sortable: true,
                className: 'td-7 text-truncate',
                headerClassName: 'td-7 text-truncate',
                Cell: ({row = {}}) =>
                    <Link href={`${ROUTES.POST_OFFICE}/${row.original.id}?readOnly`}><a
                        title={row.original.name}>{row.original.name}</a></Link>
            },
            {
                Header: 'Số điện thoại',
                accessor: 'phone',
                sortable: false,
                className: 'td-6 text-truncate',
                headerClassName: 'td-6 text-truncate',
            },
            {
                Header: 'Vị trí',
                accessor: 'province',
                sortable: false,
                className: 'td-10 text-truncate',
                headerClassName: 'td-10 text-truncate',
                Cell: ({row = {}}) => <span title={`${row.original.address || '_'} - ${row.original.ward || '_'} - ${row.original.district || '_'} - ${row.original.province || '_'}`}>
                    {`${row.original.address || '_'} - ${row.original.ward || '_'} - ${row.original.district || '_'} - ${row.original.province || '_'}`}
                </span>
            },
            {
                Header: t('usersManagement.header.lastUpdate'),
                accessor: 'update_at',
                className: 'td-6 text-truncate',
                headerClassName: 'td-6 text-truncate',
                Cell: ({value}) => filters.dateTime(value)
            },
            {
                Header: t('usersManagement.header.status'),
                accessor: 'status',
                className: 'td-8 text-truncate',
                headerClassName: 'td-8 text-truncate',
                sortable: false,
                Cell: ({value = ''}) => <Badge {...statusMapping(value)} />
            },
            {
                Header: "  ",
                className: 'action-col',
                headerClassName: 'action-col',
                Cell: ({row}) => actionButton(row)
            },
        ];

        const setRemoteData = async (params) => {
            try {
                const response = await PostOfficeApi.getAll(params);
                console.log(response)
                if (Response.isSuccessCode(response?.data)) {
                    const data = Response.getData(response).data || [];
                    return {
                        data: data, totalItem: data.length
                    }
                } else {
                    console.log(response);
                }

            } catch (error) {
                addToast(Response.getErrorMessage(error), {appearance: 'error'})
                console.log(error);
            }
        };

        const defaultSort = {
            init: {
                userNameSort: 'ASC'
            },
            default: {
                userNameSort: 'ASC'
            }
        };

        return {columns, setRemoteData, defaultSort, titleSearch};
    };

    return (
        <>
            <ContentWrapper>
                {
                    <DataTable {...dataTable()} hasFilter filters={[
                        {
                            label: 'Tỉnh/thành phố',
                            type: "select",
                            filterBy: "provinceId",
                            children: ['districtId'],
                            selectBox: {
                                hasDefaultOption: true,
                                options: props.provinces,
                                optionLabel: "name",
                                optionValue: "id",
                                onChange:async (value) => {
                                    if (value) {
                                        const districtsResponse = await AddressApi.getDistrictsById(value);
                                        const districts = Response.getAPIData(districtsResponse) || [];
                                        setDataDistricts(districts);
                                    } else {
                                        setDataDistricts([]);
                                        setDataWards([])
                                    }
                                }
                            }
                        },
                        {
                            label: 'Quận/huyện',
                            type: "select",
                            filterBy: "districtId",
                            children: ['wardId'],
                            selectBox: {
                                hasDefaultOption: true,
                                options: dataDistricts,
                                optionLabel: "name",
                                optionValue: "id",
                                onChange:async (value) => {
                                    if (value) {
                                        const wardsResponse = await AddressApi.getWardsById(value);
                                        const wards = Response.getAPIData(wardsResponse) || [];
                                        setDataWards(wards);
                                    } else {
                                        setDataWards([])
                                    }
                                }
                            }
                        },
                        {
                            label: 'Phường/xã',
                            type: "select",
                            filterBy: "wardId",
                            selectBox: {
                                hasDefaultOption: true,
                                options: dataWards,
                                optionLabel: "name",
                                optionValue: "id",
                            }
                        },
                        {
                            label: t('usersManagement.header.status'),
                            type: "select",
                            filterBy: "status",
                            selectBox: {
                                options: status,
                                optionLabel: "status",
                                optionValue: "id",
                                hasDefaultOption: true
                            }
                        },
                    ]}

                   leftControl={
                       () => (
                           <h3 className="content-header-title mb-0">Danh sách bưu cục</h3>
                       )
                   }

                   rightControl={
                       () => (
                           <Link href={ROUTES.NEW_POSITION}>
                               <button className="btn btn-primary btn-md"
                                       // disabled={!allows(SYSTEM_PERMISSIONS.CREATE_USER)}
                               >
                                   {t('usersManagement.userDetail.addNew')}
                               </button>
                           </Link>
                       )
                   }
                    />
                }
                {/*<StatusSwitcher*/}
                {/*    show={showModalConfirm}*/}
                {/*    onClose={() => {*/}
                {/*        setShowModalConfirm(false);*/}
                {/*    }}*/}
                {/*    onConfirm={statusHandler}*/}
                {/*    reasonLabel={t('usersManagement.actionBlock.reason')}*/}
                {/*    targetLabel={t('usersManagement.title')}*/}
                {/*    blockLabel={t('usersManagement.actionBlock.lock')}*/}
                {/*    unBlockLabel={t('usersManagement.actionBlock.unlock')}*/}
                {/*    entity={selectedItemId}*/}
                {/*/>*/}
            </ContentWrapper>
        </>
    );
}

PostOfficeList.propTypes = {
    provinces: PropTypes.array,
};

PostOfficeList.defaultProps = {
    provinces: [],
};

export default PostOfficeList;
