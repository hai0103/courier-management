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
import {DepartmentApi} from "services/department";
import filters from "utils/filters";
import {useDataTable} from "providers/dataTable";
import SocketHelpers from "utils/socketHelpers";
import {useSocket} from "providers/socket";
import {useGate} from "providers/accessControl";
// import StatusSwitcher from "../../statusSwitcher";
// import DepartmentHelpers from "../../../helpers/departmentHelpers";

function UserList(props) {
    const {t} = useTranslation('common');
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState({});
    const [departments, setDepartments] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [roles, setRoles] = useState(props.roles);
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
                label: t('status.block'),
                bg: 'danger',
            }
        }

        return mapping[status] || [];
    };

    const status = [
        {code: 'DISABLE', id: 0, status: t('status.block')},
        {code: 'ACTIVE', id: 1, status: t('status.active')},
        {code: 'WAIT_ACTIVE', id: 2, status: t('status.waitActive')},
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
        const titleSearch = props.isDealer ? 'người gửi' : 'nhân viên';
        let columns = [
            {
                Header: t('usersManagement.header.name'),
                accessor: 'full_name',
                sortable: true,
                className: 'td-9 text-truncate',
                headerClassName: 'td-9 text-truncate',
                Cell: ({row = {}}) =>
                    <Link href={`${ROUTES.EMPLOYEE}/${row.original.id}?readOnly`}><a
                        title={row.original.full_name}>{row.original.full_name}</a></Link>
            },
            {
                Header: 'Số điện thoại',
                accessor: 'phone',
                sortable: false,
                className: 'td-6 text-truncate',
                headerClassName: 'td-6 text-truncate',
                sortKey: "userNameSort",
                Cell: ({row = {}}) =>
                    <Link href={`/${ROUTES.EMPLOYEE}/${row.original.id}?readOnly`}><a
                        title={row.original.phone}>{row.original.phone}</a></Link>
            },
            {
                Header: t('usersManagement.header.email'),
                accessor: 'email',
                sortable: false,
                className: 'td-7 text-truncate',
                headerClassName: 'td-7 text-truncate',
            },
            {
                Header: 'Bưu cục',
                accessor: 'post_office_id',
                sortable: false,
                className: 'td-8 text-truncate',
                headerClassName: 'td-8 text-truncate',
                // filter: 'includes',
                // sortKey: 'companyNameSort',
                Cell: ({row = {}}) => {
                    const name = props.postOffices.filter(p => p.id === row.original.post_office_id)[0]?.name || '';
                    return <span title={name}>{name}</span>
                }
            },
            {
                Header: "Vai trò",
                accessor: 'user_type_id',
                className: 'td-6 text-truncate',
                headerClassName: 'td-6 text-truncate',
                filter: 'includes',
                Cell: ({row = {}}) => {
                    const name = props.roles.filter(p => p.id === row.original.user_type_id)[0]?.name || '';
                    return <span title={name}>{name}</span>
                }
            },
            {
                Header: t('usersManagement.header.lastUpdate'),
                accessor: 'updated_at',
                className: 'td-6 text-truncate',
                headerClassName: 'td-6 text-truncate',
                // sortKey: 'updated_date',
                // sortable: true,
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

        if(props.isDealer) {
            columns = columns.filter(col => col.accessor !== 'post_office_id' && col.accessor !== 'user_type_id');
        }

        const setRemoteData = async (params) => {
            try {
                const response = await UserApi.getAll(params);
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
                        !props.isDealer && {
                            label: 'Bưu cục',
                            type: "select",
                            filterBy: "postOfficeId",
                            selectBox: {
                                hasDefaultOption: true,
                                options: props.postOffices,
                                optionLabel: "name",
                                optionValue: "id",
                            }
                        },
                        !props.isDealer && {
                            label: 'Vai trò',
                            type: "select",
                            filterBy: "userTypeId",
                            selectBox: {
                                options: props.roles,
                                optionLabel: "name",
                                optionValue: "id",
                                hasDefaultOption: true
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
                           <h3 className="content-header-title mb-0">{props.isDealer ? 'Danh sách khách hàng - người gửi' : 'Danh sách nhân viên'}</h3>
                       )
                   }

                   rightControl={
                       () => (
                           <Link href={ROUTES.NEW_EMPLOYEE}>
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

UserList.propTypes = {
    postOffices: PropTypes.array,
    roles: PropTypes.array,
    isDealer: PropTypes.bool
};

UserList.defaultProps = {
    postOffices: [],
    roles: [],
    isDealer: false
};

export default UserList;
