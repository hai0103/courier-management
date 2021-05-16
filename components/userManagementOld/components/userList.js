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
import StatusSwitcher from "../../statusSwitcher";
import DepartmentHelpers from "../../../helpers/departmentHelpers";

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
        const titleSearch = t('usersManagement.title');
        const columns = [
            {
                Header: "  ",
                className: 'action-col',
                headerClassName: 'action-col',
                Cell: ({row}) => actionButton(row)
            },
            {
                Header: t('usersManagement.header.username'),
                accessor: 'userName',
                sortable: true,
                className: 'td-9 text-truncate',
                headerClassName: 'td-9 text-truncate',
                sortKey: "userNameSort",
                Cell: ({row}) =>
                    <Link href={`/users/${row.original.id}?readOnly`}><a
                        title={row.original.userName}>{row.original.userName}</a></Link>
            },
            {
                Header: t('usersManagement.header.status'),
                accessor: 'status',
                className: 'td-9 text-truncate',
                headerClassName: 'td-9 text-truncate',
                sortable: true,
                Cell: ({value}) => <Badge {...statusMapping(value)} />
            },
            {
                Header: t('usersManagement.header.name'),
                accessor: 'fullName',
                sortable: true,
                className: 'td-9 text-truncate',
                headerClassName: 'td-9 text-truncate',
                sortKey: 'fullNameSort',
                Cell: ({row}) =>
                    <span title={row.original.fullName}>{row.original.fullName}</span>
            },
            {
                Header: t('usersManagement.header.email'),
                accessor: 'email',
                sortable: true,
                className: 'td-10 text-truncate',
                headerClassName: 'td-10 text-truncate',
                sortKey: "emailSort",
                Cell: ({row}) =>
                    <span title={row.original.email}>{row.original.email}</span>
            },
            {
                Header: t('usersManagement.header.company'),
                accessor: 'companyId',
                sortable: true,
                className: 'td-9 text-truncate',
                headerClassName: 'td-9 text-truncate',
                filter: 'includes',
                sortKey: 'companyNameSort',
                Cell: ({row}) =>
                    <span title={row.original.companyName}>{row.original.companyName}</span>
            },
            {
                Header: t('usersManagement.header.department'),
                accessor: 'departmentId',
                sortable: true,
                className: 'td-9 text-truncate',
                headerClassName: 'td-9 text-truncate',
                filter: 'includes',
                sortKey: 'departmentNameSort',
                Cell: ({row}) =>
                    <span title={row.original.departmentName}>{row.original.departmentName}</span>
            },
            {
                Header: t('usersManagement.header.position'),
                accessor: 'functionId',
                sortable: true,
                className: 'td-9 text-truncate',
                headerClassName: 'td-9 text-truncate',
                filter: 'includes',
                sortKey: 'functionNameSort',
                Cell: ({row}) =>
                    <span title={row.original.functionName}>{row.original.functionName}</span>
            },
            {
                Header: t('usersManagement.header.roles'),
                accessor: 'roleName',
                // sortable: true,
                className: 'td-4 text-truncate',
                headerClassName: 'td-4 text-truncate',
                filter: 'includes',
                sortKey: 'roleId',
                Cell: ({row}) =>
                    <span title={row.original.roleName}>{row.original.roleName}</span>
            },
            {
                Header: t('usersManagement.header.lastUpdate'),
                accessor: 'updatedDate',
                className: 'td-9 text-truncate',
                headerClassName: 'td-9 text-truncate',
                sortKey: 'updatedDate',
                sortable: true,
                Cell: ({value}) => filters.dateTime(value)
            }
        ];

        const setRemoteData = async (params) => {
            try {
                const response = await UserApi.getList(params);
                if (Response.isSuccess(response)) {
                    const {content, totalElements} = Response.getData(response).Data;
                    return {
                        data: content, totalItem: totalElements
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
                    <DataTable {...dataTable()} hasFilter classes='' filters={[
                        {
                            label: t('usersManagement.header.company'),
                            type: "select",
                            filterBy: "companyId",
                            children: ['departmentId'],
                            selectBox: {
                                hasDefaultOption: true,
                                options: props.companies,
                                optionLabel: "companyName",
                                optionValue: "id",
                                onChange: async (value) => {
                                    if (value) {
                                        const dataDepartment = await DepartmentHelpers.getDepartments({companyId: value})
                                        setDepartments(dataDepartment || [])
                                        setFunctions([])
                                    } else {
                                        setDepartments([])
                                        setFunctions([])
                                    }
                                }
                            }
                        },
                        {
                            label: t('usersManagement.header.department'),
                            type: "select",
                            filterBy: "departmentId",
                            children: ['functionId'],
                            selectBox: {
                                options: departments,
                                optionLabel: "departmentName",
                                optionValue: "id",
                                hasDefaultOption: true,
                                onChange: (value) => {
                                    if (value) {
                                        DepartmentApi.getListFunctionById(value).then((response) => {
                                            if (Response.isSuccessAPI(response)) {
                                                const data = Response.getAPIData(response);
                                                setFunctions(data || []);
                                            } else {
                                                addToast(Response.getAPIError(response), {appearance: 'error'});
                                            }
                                        });
                                    } else {
                                        setFunctions([])
                                    }
                                }
                            }
                        },
                        {
                            label: t('usersManagement.header.functionality'),
                            type: "select",
                            filterBy: "functionId",
                            selectBox: {
                                options: functions,
                                optionLabel: "functionName",
                                optionValue: "id",
                                hasDefaultOption: true
                            }
                        },
                        {
                            label: t('usersManagement.header.role'),
                            type: "select",
                            filterBy: "roleId",
                            selectBox: {
                                options: roles,
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
                           <h3 className="content-header-title mb-0">Danh sách người dùng</h3>
                       )
                   }

                   rightControl={
                       () => (
                           <Link href={ROUTES.NEW_USER}>
                               <button className="btn btn-primary btn-md"
                                       disabled={!allows(SYSTEM_PERMISSIONS.CREATE_USER)}
                               >
                                   {t('usersManagement.userDetail.addNew')}
                               </button>
                           </Link>
                       )
                   }
                    />
                }
                <StatusSwitcher
                    show={showModalConfirm}
                    onClose={() => {
                        setShowModalConfirm(false);
                    }}
                    onConfirm={statusHandler}
                    reasonLabel={t('usersManagement.actionBlock.reason')}
                    targetLabel={t('usersManagement.title')}
                    blockLabel={t('usersManagement.actionBlock.lock')}
                    unBlockLabel={t('usersManagement.actionBlock.unlock')}
                    entity={selectedItemId}
                />
            </ContentWrapper>
        </>
    );
}

UserList.propTypes = {
    companies: PropTypes.array,
    roles: PropTypes.array,
    functions: PropTypes.array
};

UserList.defaultProps = {
    companies: [],
    roles: [],
    functions: []
};

export default UserList;
