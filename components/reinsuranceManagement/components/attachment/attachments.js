import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";
import {Response} from "utils/common";
import DataTable from "sharedComponents/dataTable";
import More from "sharedComponents/more";
import UploadModal from "./modalUpload";
import filters from "utils/filters";
import {confirmation, download} from "utils/helpers";
import PropTypes from "prop-types";
import {useDataTable} from "providers/dataTable";
import SocketHelpers from "utils/socketHelpers";
import {useSocket} from "providers/socket";
import {isEmpty} from "lodash"
import {SimpleInlineInput} from "sharedComponents/formControl/simpleInlineInput";
import {ReinsuranceApi} from "services/reinsurance";

function Attachments(props) {
    const {addToast} = useToasts();
    const [showModal, setShowModal] = useState(false)
    const {t} = useTranslation('common');
    const {refresh: refreshTable} = useDataTable();
    const {socketClient} = useSocket()
    const onSave = async (data) => {

        try {
            const attachment = data.attachments[0] || {}
            const payload = {
                documentName: data.name || '',
                attachmentId: data.attachmentId,
                attachmentName: attachment.name || '',
                note: data.note,
            };
            const response = await ReinsuranceApi.uploadDocument(props.id, payload);
            if (Response.isSuccessAPI(response)) {
                const entity = Response.getAPIData(response)
                SocketHelpers.fastSubscribe(`/topic/reinsurance-document-uploaded/${entity}`, () => {
                    addToast(
                        <div className='justify-content-center align-content-center text-center'>
                            {t('uploadAttachment.messages.uploadSuccessfully')}
                        </div>, {appearance: 'success'})
                    refreshTable();
                }, socketClient);
            } else {
                addToast(
                    <div className='justify-content-center align-content-center text-center'>
                        {t('uploadAttachment.messages.uploadFailure')}
                    </div>, {appearance: 'error'});
            }
        } catch (error) {
            addToast(
                <div className='justify-content-center align-content-center text-center'>
                    {Response.getErrorMessage(error)}
                </div>, {appearance: 'error'});
        }
    }

    const onRemoveOne = async (item) => {
        try {
            await props.onDeleteFile(item.id)
            const response = await ReinsuranceApi.deleteDocument(props.id, item.id);
            if (Response.isSuccessAPI(response)) {
                const entity = Response.getAPIData(response)
                SocketHelpers.fastSubscribe(`/topic/reinsurance-document-deleted/${entity}`, () => {
                    refreshTable();
                    addToast(
                        <div className='justify-content-center align-content-center text-center'>
                            {t('uploadAttachment.messages.deleteSuccessfully')}
                        </div>, {appearance: 'success'})
                }, socketClient);
            } else {
                addToast(
                    <div className='justify-content-center align-content-center text-center'>
                        {t('uploadAttachment.messages.deleteFailure')}
                    </div>, {appearance: 'error'});
            }
        } catch (error) {
            addToast(
                <div className='justify-content-center align-content-center text-center'>
                    {Response.getErrorMessage(error)}
                </div>, {appearance: 'error'});
        }
    }

    const updateDocument = async (documentId, payload) => {
        const response = await ReinsuranceApi.updateDocument(props.id, documentId, payload);
        if (Response.isSuccessAPI(response)) {
            addToast(
                <div className='justify-content-center align-content-center text-center'>
                    {t('common.message.editSuccess')}
                </div>, {appearance: 'success'})
        } else {
            addToast(
                <div className='justify-content-center align-content-center text-center'>
                    {t('common.message.editErr')}
                </div>, {appearance: 'error'});
        }
    }

    const actionButton = (value) => {
        return (
            <div>
                <More>
                    <button className="dropdown-item"
                            type="button"
                        // disabled={!allows(SYSTEM_PERMISSIONS.ACTIVE_DE_ACTIVE_ORGANIZATION)}
                            onClick={() => {
                                confirmation({
                                    title: t('uploadAttachment.messages.deleteConfirmation'),
                                    onConfirm: ({onClose}) => {
                                        onRemoveOne(value)
                                        onClose()
                                    }
                                })
                            }}
                    ><i
                        className="fal fa-trash"/>
                        {t('uploadAttachment.button.deleteDocument')}
                    </button>
                </More>
            </div>
        )
    }

    const dataTable = () => {
        const columns = React.useMemo(
            () => [
                {
                    Header: t('uploadAttachment.header.no'),
                    className: 'small-col text-truncate',
                    headerClassName: 'small-col text-truncate',
                    Cell: ({row}) => {
                        return !row.depth && row.index + 1
                    }
                },
                {
                    Header: t('uploadAttachment.header.attachmentName'),
                    headerClassName: 'small-col text-truncate',
                    className: 'small-col text-truncate',
                    sortable: true,
                    sortKey: 'nameSort',
                    Cell: ({row}) => {
                        return <SimpleInlineInput
                            className="form-control form-control-sm bottom-right"
                            inlinePlaceholderClassName="form-control form-control-sm bottom-right"
                            inlineClassName="form-control-sm"
                            defaultValue={row.original.name}
                            type="text"
                            handleSubmit={ async (e, setErrorMessage) => {
                                try {
                                    await updateDocument(row.original.id, {
                                        name: e,
                                        note: row.original.note
                                    })
                                } catch (error) {
                                    setErrorMessage(Response.getErrorMessage(error)[0])
                                }
                            }}
                        />
                    }
                },
                {
                    Header: t('uploadAttachment.header.uploadedDate'),
                    accessor: 'createdDate',
                    className: 'small-col text-truncate',
                    headerClassName: 'small-col text-truncate',
                    Cell: ({value}) => filters.dateTime(value),
                    sortable: true,
                    sortKey: 'createdDate',
                },
                {
                    Header: t('uploadAttachment.header.uploadedBy'),
                    accessor: 'uploadedBy',
                    className: 'small-col text-truncate',
                    headerClassName: 'small-col text-truncate',
                    sortable: true,
                    sortKey: 'uploadedBySort',
                },
                {
                    Header: t('uploadAttachment.header.note'),
                    accessor: 'note',
                    className: 'small-col text-truncate',
                    headerClassName: 'small-col text-truncate',
                    Cell: ({row}) => {
                        return <SimpleInlineInput
                            className="form-control form-control-sm"
                            inlinePlaceholderClassName="form-control form-control-sm"
                            inlineClassName="form-control-sm"
                            defaultValue={row.original.note}
                            type="text"
                            handleSubmit={e => {
                                updateDocument(row.original.id, {
                                    note: e,
                                    name: row.original.name
                                })
                            }}
                            placeholder={t('uploadAttachment.placeholder.inputNote')}
                        />
                    }
                },
                {
                    Header: t('uploadAttachment.header.attachment'),
                    className: 'small-col text-truncate',
                    headerClassName: 'small-col text-truncate',
                    Cell: ({row}) => {
                        const value = row.original
                        return <a title={value?.attachmentName} href="#" onClick={(e) => {
                            e.preventDefault()
                            download(value.attachmentId, value?.attachmentName)
                        }}>{value?.attachmentName}</a>
                    }
                },
                {
                    Header: "  ",
                    className: 'action-col',
                    headerClassName: 'action-col',
                    Cell: (data) => actionButton(data.row.original)
                }
            ],
            []
        )

        const setRemoteData = async (params) => {
            try {
                const response = await ReinsuranceApi.getUploadedDocument(props.id, params);

                if (Response.isSuccess(response)) {
                    const {content, totalElements} = Response.getData(response).Data;

                    return {
                        data: content,
                        totalItem: totalElements
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
                createdDate: 'DESC'
            },
            default: {
                createdDate: 'DESC'
            }
        };

        return {columns, setRemoteData, defaultSort};
    };

    return (
        <div>
            <div className="card card-section">
                <div className="card-header">
                    <div className="form-section d-flex align-items-center">
                        <h5 className="mb-0 border-separate">{t('uploadAttachment.title')}</h5>
                        <button
                            onClick={() => setShowModal(true)}
                            type="button" className="avatar ml-1 h-auto"
                            title={t('uploadAttachment.title')}>
                            <i className="fal fa-plus-circle"/>
                        </button>
                    </div>
                </div>
                <div className="card-body px-0">
                    {
                        <DataTable {...dataTable()}
                                   hasHeader={false}
                        />
                    }
                </div>
            </div>
            <UploadModal
                show={showModal}
                onClose={() => {
                    setShowModal(false)
                }}
                onSave={onSave}
            />
        </div>
    )

}

Attachments.propTypes = {
    id: PropTypes.string,
    onDeleteFile: PropTypes.func
};

Attachments.defaultProps = {};

export default Attachments;
