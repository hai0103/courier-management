import PropTypes from "prop-types";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import DataTable from "sharedComponents/dataTable";
import More from "sharedComponents/more";
import {useToasts} from "react-toast-notifications";
import {useSocket} from "providers/socket";
import {useDataTable} from "providers/dataTable";
import {Response} from "utils/common";
import ContactModal from "./modals/editContact";
import {ReinsuranceApi} from "services/reinsurance";
import SocketHelpers from "utils/socketHelpers";
import {confirmation} from "utils/helpers";

function ListContact(props) {
    const {t} = useTranslation('common');
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [dataDetailContact, setDataContact] = useState({})
    const {addToast} = useToasts();
    const {socketClient} = useSocket();
    const {refresh: refreshTable} = useDataTable();

    const actionButton = (value) => {
        return (
            <More>
                <a onClick={() => {
                    setShowModal(true)
                    setEdit(true)
                    setDataContact(value)
                }} className="dropdown-item edit">
                    <i className="fal fa-pen"/> Sửa
                </a>
                <a onClick={() => {
                    confirmation({
                        title: 'Xóa liên hệ này?',
                        onConfirm: ({onClose}) => {
                            console.log(value);
                            removeContact(value.id).catch(e => console.log(e))
                            onClose()
                        }
                    })
                }} className="dropdown-item edit">
                    <i className="fal fa-trash"/> Xóa
                </a>
            </More>
        )
    };

    const save = async (data) => {
        const payload = {
            ...data
        }
        try {
            isEdit ? await editContact(payload) : await addContact(payload);
        } catch (error) {
            console.error(error)
        }
    }

    const clearForm = () => {
        setEdit(false)
        setDataContact({})
    }

    const addContact = async (data) => {
        const payload = {
            id: props.id,
            body: {
                ...data
            }
        }
        const response = await ReinsuranceApi.createContact(payload);
        if (Response.isSuccessAPI(response)) {
            setShowModal(false);
            const entityId = Response.getAPIData(response);
            SocketHelpers.fastSubscribe(`/topic/create-contact-information/${entityId}`, () => {
                addToast(
                    <div className='justify-content-center align-content-center text-center'>
                        {t('common.message.createSuccess')}
                    </div>, {appearance: 'success'})
                refreshTable()
            }, socketClient);

        } else {
            addToast(
                <div className='justify-content-center align-content-center text-center'>
                    {Response.getAPIError(response)}
                </div>, {appearance: 'error'});
        }
    };

    const editContact = async (data) => {
        const payload = {
            contactId: dataDetailContact.id,
            body: {
                ...data
            }
        }
        const response = await ReinsuranceApi.updateContact(payload);
        if (Response.isSuccessAPI(response)) {
            const entityId = Response.getAPIData(response);
            setShowModal(false);
            SocketHelpers.fastSubscribe(`/topic/update-contact-information/${entityId}`, () => {
                addToast(
                    <div className='justify-content-center align-content-center text-center'>
                        {t('common.message.editSuccess')}
                    </div>, {appearance: 'success'})
                refreshTable()
            }, socketClient);
        } else {
            addToast(
                <div className='justify-content-center align-content-center text-center'>
                    {Response.getAPIError(response)}
                </div>, {appearance: 'error'});
        }
    };

    const removeContact = async (id) => {
        const response = await ReinsuranceApi.removeContact(props.id, id);
        try {
            if (Response.isSuccessAPI(response)) {
                console.log(props.id);
                SocketHelpers.fastSubscribe(`/topic/delete-contact-information/${props.id}`, () => {
                    console.log(props.id);
                    addToast(
                        <div className='justify-content-center align-content-center text-center'>
                            {t('common.message.deleteSuccess')}
                        </div>, {appearance: 'success'})
                    refreshTable()
                }, socketClient);
            } else {
                addToast(
                    <div className='justify-content-center align-content-center text-center'>
                        {Response.getAPIError(response)}
                    </div>, {appearance: 'error'});
            }
        } catch (error) {
            addToast(Response.getErrorMessage(error), {appearance: 'error'});
        }
    };

    const dataTable = () => {
        const columns = [
            {
                Header: t('reinsuranceManagement.create.label.nameContact'),
                accessor: 'nameContact',
                sortable: true,
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
                sortKey: "nameContactSort",
            },
            {
                Header: t('reinsuranceManagement.create.label.positionContact'),
                accessor: 'positionContact',
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',

            },
            {
                Header: t('reinsuranceManagement.create.label.emailContact'),
                accessor: 'emailContact',
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
            },
            {
                Header: t('reinsuranceManagement.create.label.phoneContact'),
                accessor: 'phoneContact',
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
            },
            {
                Header: t('reinsuranceManagement.create.label.scopeContact'),
                accessor: 'scopeContact',
                className: 'small-col text-truncate',
                headerClassName: 'small-col text-truncate',
            },
            {
                Header: "  ",
                className: 'action-col',
                headerClassName: 'action-col',
                Cell: (data) => actionButton(data.row.original)
            }];

        const setRemoteData = async (params) => {
            try {
                let payload = {
                    id: props.id,
                    body: {
                        ...params
                    }
                }
                const response = await ReinsuranceApi.getListReinsurance(payload);
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
                nameContactSort: 'ASC'
            },
            default: {
                nameContactSort: 'ASC'
            }
        };

        return {columns, setRemoteData, defaultSort};
    };

    return (
        <>
            <div className="card card-section">
                <div className="card-header">
                    <div
                        className="form-section d-flex align-items-center">
                        <h5 className="mb-0">Thông tin liên lạc</h5>
                        <button className="avatar avatar-sm btn-avatar ml-2"
                                onClick={() => {
                                    clearForm()
                                    setShowModal(true)
                                }}
                                type="button"
                        >
                            <i className="fal fa-plus-circle"/>
                        </button>
                    </div>
                </div>
                <div className="card-body px-0">
                    <DataTable {...dataTable()} hasSearch={false} hasHeader={false} />
                </div>
            </div>
            <ContactModal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    clearForm()
                }}
                onConfirm={(data) => save(data)}
                detail={dataDetailContact}
                labelBtn={isEdit ? t('common.button.update') : t('common.button.create')}
                title={isEdit ? t('reinsuranceManagement.titleModal.editContact') : t('reinsuranceManagement.titleModal.createContact')}
            />
        </>
    );
}

ListContact.propTypes = {
    listReinsurance: PropTypes.object,
    id: PropTypes.string
};

ListContact.defaultProps = {};

export default ListContact;
