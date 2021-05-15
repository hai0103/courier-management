import PropTypes from "prop-types";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import ContentWrapper from "layouts/contentWrapper";
import DataTable from "sharedComponents/dataTable";
import Badge from "sharedComponents/blocks/badge";
import More from "sharedComponents/more";
import {useToasts} from "react-toast-notifications";
import {useSocket} from "providers/socket";
import {useDataTable} from "providers/dataTable";

function ListReinsurance(props) {
    const {t} = useTranslation('common');
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const {addToast} = useToasts();
    const {socketClient} = useSocket();
    const {refresh: refreshTable} = useDataTable();

    const actionButton = (value) => {
        return (
            <More>
                <a onClick={() => {
                    setShowModal(true)
                    setEdit(true)
                }} className="dropdown-item edit">
                    <i className="fal fa-pen"/> {t('usersManagement.actionBlock.edit')}
                </a>
            </More>
        )
    };

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

    const dataTable = () => {
        const columns = [
            {
                Header: "  ",
                className: 'action-col',
                headerClassName: 'action-col',
                Cell: (data) => actionButton(data.row.original)
            },
            {
                Header: t('reinsuranceManagement.create.label.code'),
                accessor: 'agencyName',
                sortable: true,
                className: 'text-truncate',
                headerClassName: 'text-truncate',
                // sortKey: "agencyNameSort",
            },
            {
                Header: t('reinsuranceManagement.create.label.status'),
                // accessor: 'contractNumber',
                className: 'text-truncate',
                headerClassName: 'text-truncate',
                Cell: ({value}) => <Badge {...statusMapping(value)} />
            },
            {
                Header: t('reinsuranceManagement.create.label.reinsuranceNameShort'),
                // accessor: 'agencyCode',
                className: 'text-truncate',
                headerClassName: 'text-truncate',

            },
            {
                Header: t('reinsuranceManagement.create.label.reinsuranceName'),
                // accessor: 'type',
                className: 'text-truncate',
                headerClassName: 'text-truncate',
            },
            {
                Header: t('reinsuranceManagement.create.label.reinsuranceNameEN'),
                // accessor: 'contractNumber',
                className: 'text-truncate',
                headerClassName: 'text-truncate',
            },
            {
                Header: t('reinsuranceManagement.create.label.national'),
                // accessor: 'contractNumber',
                className: 'text-truncate',
                headerClassName: 'text-truncate',
            },

            {
                Header: t('reinsuranceManagement.create.label.taxNumber'),
                // accessor: 'agencyCode',
                className: 'text-truncate',
                headerClassName: 'text-truncate',

            },
            {
                Header: t('reinsuranceManagement.create.label.phone'),
                // accessor: 'type',
                className: 'text-truncate',
                headerClassName: 'text-truncate',
            },
            {
                Header: t('reinsuranceManagement.create.label.address'),
                // accessor: 'contractNumber',
                className: 'text-truncate',
                headerClassName: 'text-truncate',
            }
        ];

        const setRemoteData = async (params) => {
            try {
                // let payload = {
                //     ...params,
                //     startAffectedDate: time ? moment(time).format() : null
                // }
                // const response = await AgencyApi.getList(payload);
                // if (Response.isSuccess(response)) {
                //     const {content, totalElements} = Response.getData(response).Data;
                //     return {
                //         data: content, totalItem: totalElements
                //     }
                // } else {
                //     addToast(
                //         <div className='justify-content-center align-content-center text-center'>
                //             {Response.getAPIError(response)}
                //         </div>, {appearance: 'error'})
                // }

            } catch (error) {
                console.log(error);
            }
        };

        const defaultSort = {
            init: {
                agencyNameSort: 'ASC'
            },
            default: {
                agencyNameSort: 'ASC'
            }
        };

        return {columns, setRemoteData, defaultSort};
    };

    return (
        <>
            <ContentWrapper>
                {
                    <DataTable {...dataTable()} hasSearch={false}
                               rightControl={
                                   () => (
                                       <button
                                           className="btn btn-primary btn-min-width"
                                       >
                                           {t('common.button.createNew')}
                                       </button>
                                   )
                               }
                    />
                }

            </ContentWrapper>
        </>
    );
}

ListReinsurance.propTypes = {

};

ListReinsurance.defaultProps = {

};

export default ListReinsurance;
