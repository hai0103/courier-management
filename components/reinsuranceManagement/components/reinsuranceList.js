import {ROUTES} from "constants/common";
import Link from "next/link";
import PropTypes from "prop-types";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";
import {Response} from "utils/common";
import ContentWrapper from "layouts/contentWrapper";
import Badge from "sharedComponents/blocks/badge";
import DataTable from "sharedComponents/dataTable";
import More from "sharedComponents/more";
import SocketHelpers from "utils/socketHelpers";
import {useSocket} from "providers/socket";
import {useDataTable} from "providers/dataTable";
import {ReinsuranceApi} from "services/reinsurance";

function ReinsuranceList(props) {
    const {t} = useTranslation('common');
    const [showModalActive, setShowModalActive] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const {addToast} = useToasts();
    const {socketClient} = useSocket();
    const {refresh: refreshTable} = useDataTable();
    const [statusList] = useState([
        {id: 1, name: t('status.active')},
        {id: 0, name: t('status.inactive')}
    ]);
    const [typeReinsurance] = useState([
        {id: 0, name: t('reinsuranceManagement.typeReinsurer')},
        {id: 1, name: t('reinsuranceManagement.typeBroker')}
    ]);

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
                bg: 'warning',
            }
        }
        return mapping[status] || [];
    };

    const typeMapping = (type) => {
        switch (type) {
            case 0:
                return t('reinsuranceManagement.typeReinsurer');
            case 1:
                return t('reinsuranceManagement.typeBroker');
        }
        return '';
    };

    const statusHandler = async (payload, entity) => {
        try {
            // const response = await ReinsuranceApi.updateStatus(entity?.id, payload);
            // if (Response.isSuccessAPI(response)) {
            //     const message = entity?.status ? t('common.message.requestDeActiveSuccess') : t('common.message.ActiveSuccess')
            //     addToast(message, {appearance: 'success'})
            //     setShowModalActive(false)
            //     SocketHelpers.fastSubscribe(`/topic/agency-updated-status/${entity?.id}`, () => {
            //         refreshTable();
            //     }, socketClient);
            // } else {
            //     addToast(Response.getAPIError(response), {appearance: 'error'});
            // }
        } catch (error) {
            addToast(Response.getErrorMessage(error), {appearance: 'error'});
        }
    };

    const actionButton = (value) => {
        return (
            <More>
                <Link href={`/reinsurance/${value.id}`}>
                    <a className="dropdown-item edit">
                        <i className="fal fa-pen"/> {t('common.edit')}
                    </a>
                </Link>
                {value.status !== 0 &&
                    <a className="dropdown-item"
                       onClick={() => {
                           setSelectedItem(value)
                           setShowModalActive(true)
                       }}>
                        <i className="fal fa-ban"/>
                        {t('common.block')}
                    </a>
                }
                {value.status === 0 &&
                    <a className="dropdown-item"
                       onClick={() => {
                           setSelectedItem(value)
                           setShowModalActive(true)
                       }}><i
                        className="fal fa-redo"/>
                        {t('common.unBlock')}
                    </a>
                }
                {value.status === 0 &&
                    <a className="dropdown-item"
                       onClick={() => {
                           setSelectedItem(value)
                           setShowModalActive(true)
                       }}><i
                        className="fal fa-trash"/>
                        {t('common.delete')}
                    </a>
                }
            </More>
        )
    };

    const dataTable = () => {
        const titleSearch = t('reinsuranceManagement.titleSearch')
        const columns = [
            {
                Header: "  ",
                className: 'action-col',
                headerClassName: 'action-col',
                Cell: (data) => actionButton(data.row.original)
            },
            {
                Header: t('reinsuranceManagement.header.reinsuranceCode'),
                accessor: 'reinsuranceCode',
                className: 'extra-small-col text-truncate',
                headerClassName: 'extra-small-col text-truncate',
            },
            {
                Header: t('reinsuranceManagement.header.status'),
                accessor: 'status',
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
                sortable: true,
                Cell: ({value}) => <Badge {...statusMapping(value)} />
            },
            {
                Header: t('reinsuranceManagement.header.shortName'),
                accessor: 'reinsuranceNameShort',
                sortable: true,
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
                sortKey: "reinsuranceNameShortSort"
            },
            {
                Header: t('reinsuranceManagement.header.nameVN'),
                accessor: 'reinsuranceName',
                sortable: true,
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
                sortKey: "reinsuranceNameSort",
                Cell: ({row}) =>
                    <Link href={`/reinsurance/${row.original.id}?readOnly`}><a
                        title={row.original.reinsuranceName}>{row.original.reinsuranceName}</a></Link>
            },
            {
                Header: t('reinsuranceManagement.header.nameEN'),
                accessor: 'reinsuranceNameEN',
                sortable: true,
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
                sortKey: "reinsuranceNameENSort",
                Cell: ({row}) =>
                    <Link href={`/reinsurance/${row.original.id}?readOnly`}><a
                        title={row.original.reinsuranceNameEN}>{row.original.reinsuranceNameEN}</a></Link>
            },
            {
                Header: t('reinsuranceManagement.header.nation'),
                accessor: 'nationalityName',
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
            },
            {
                Header: t('reinsuranceManagement.header.taxNumber'),
                accessor: 'taxNumber',
                sortable: true,
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
                sortKey: "taxNumberSort",
            },
            {
                Header: t('reinsuranceManagement.header.rating'),
                accessor: 'rating',
                sortable: true,
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
                sortKey: "ratingSort",
            },
            {
                Header: t('reinsuranceManagement.header.type'),
                accessor: 'type',
                sortable: true,
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
                sortKey: "type",
                Cell: ({value}) => typeMapping(value)
            },
        ];

        const setRemoteData = async (params) => {
            try {
                const response = await ReinsuranceApi.getList(params);
                if (Response.isSuccess(response)) {
                    const {content, totalElements} = Response.getData(response).Data;
                    return {
                        data: content, totalItem: totalElements
                    }
                } else {
                    addToast(
                        <div className='justify-content-center align-content-center text-center'>
                            {Response.getAPIError(response)}
                        </div>, {appearance: 'error'})
                }
            } catch (error) {
                console.log(error);
            }
        };

        const defaultSort = {
            init: {
                reinsuranceNameSort: 'ASC'
            },
            default: {
                reinsuranceNameSort: 'ASC'
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
                            label: t('reinsuranceManagement.header.reinsuranceCode'),
                            type: "text",
                            filterBy: "reinsuranceCode",
                            placeholder: t('reinsuranceManagement.create.placeHolder.reinsuranceCode')
                        },
                        {
                            label: t('reinsuranceManagement.header.shortName'),
                            type: "text",
                            filterBy: "reinsuranceNameShort",
                            placeholder: t('reinsuranceManagement.create.placeHolder.reinsuranceNameShort')
                        },
                        {
                            label: t('reinsuranceManagement.header.nameVN'),
                            type: "text",
                            filterBy: "reinsuranceName",
                            placeholder: t('reinsuranceManagement.create.placeHolder.reinsuranceName')
                        },
                        {
                            label: t('reinsuranceManagement.header.nameEN'),
                            type: "text",
                            filterBy: "reinsuranceNameEN",
                            placeholder: t('reinsuranceManagement.create.placeHolder.reinsuranceNameEN')
                        },
                        {
                            label: t('reinsuranceManagement.header.taxNumber'),
                            type: "text",
                            filterBy: "taxNumber",
                            placeholder: t('reinsuranceManagement.create.placeHolder.taxNumber')
                        },
                        {
                            label: t('reinsuranceManagement.header.type'),
                            type: "select",
                            filterBy: "type",
                            selectBox: {
                                options: typeReinsurance,
                                optionLabel: "name",
                                optionValue: "id",
                                hasDefaultOption: true
                            }
                        },
                        {
                            label: t('reinsuranceManagement.header.nation'),
                            type: "select",
                            filterBy: "nationalityCode",
                            selectBox: {
                                options: props.nations,
                                optionLabel: "name",
                                optionValue: "code",
                                hasDefaultOption: true
                            }
                        },
                        {
                            label: t('reinsuranceManagement.header.status'),
                            type: "select",
                            filterBy: "status",
                            selectBox: {
                                options: statusList,
                                optionLabel: "name",
                                optionValue: "id",
                                hasDefaultOption: true
                            }
                        }
                    ]}
                               leftControl={
                                   () => (
                                       <Link href={ROUTES.NEW_REINSURANCE}>
                                           <button className="btn btn-primary btn-min-width">
                                               {t('common.button.createNew')}
                                           </button>
                                       </Link>
                                   )
                               }
                    />
                }

            </ContentWrapper>
        </>
    );
}

ReinsuranceList.propTypes = {
    nations: PropTypes.array
};

ReinsuranceList.defaultProps = {
    nations: []
};

export default ReinsuranceList;
