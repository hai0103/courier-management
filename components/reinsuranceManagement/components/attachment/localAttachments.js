import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";
import DataTable from "sharedComponents/dataTable";
import More from "sharedComponents/more";
import UploadModal from "./modalUpload";
import filters from "utils/filters";
import {confirmation, download, isNotNullAndUndefined} from "utils/helpers";
import PropTypes from "prop-types";
import {getUserProfile} from "utils/localStorage";
import moment from "moment";
import {SimpleInlineInput} from "sharedComponents/formControl/simpleInlineInput";

function LocalAttachments(props) {
    const {addToast} = useToasts();
    const [showModal, setShowModal] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const {t} = useTranslation('common');

    const buildData = (data) => {
        return {
            name: data?.name,
            attachmentId: data?.attachmentId,
            note: data?.note,
            createdBy: getUserProfile().fullName,
            createdDate: moment().format(),
            attachment: data?.attachments[0]
        }
    }

    useEffect(() => {
        const uploadRequests = uploadedFiles.map(item => {
            return {
                documentName: item.name || '',
                attachmentId: item.attachmentId,
                attachmentName: item?.attachment.name,
                note: item.note,
            }
        })
        props.setLocalAttachments(uploadRequests)
    }, [uploadedFiles])

    const onSave = (data) => {
        const file = buildData(data)
        const builtData = [file, ...uploadedFiles]
        setUploadedFiles(builtData.sort((a, b) => {
            return new Date(a.createdDate) - new Date(b.createdDate);
        }))
        addToast(
            <div className='justify-content-center align-content-center text-center'>
                {t('uploadAttachment.messages.uploadSuccessfully')}
            </div>, {appearance: 'success'})
    }

    const onRemoveOne = (item) => {
        const deleteFileIndex = uploadedFiles.findIndex(file => {
            return file.attachmentId === item.attachmentId
        })

        if (isNotNullAndUndefined(deleteFileIndex)) {
            uploadedFiles.splice(deleteFileIndex, 1)
            setUploadedFiles([...uploadedFiles])
            props.onDeleteFile(item.attachmentId).then(() => {
                addToast(
                    <div className='justify-content-center align-content-center text-center'>
                        {t('uploadAttachment.messages.deleteSuccessfully')}
                    </div>, {appearance: 'success'})
            })
        }
    }

    const actionButton = (data) => {
        return (
            <div>
                <More>
                    <button className="dropdown-item"
                        // disabled={!allows(SYSTEM_PERMISSIONS.ACTIVE_DE_ACTIVE_ORGANIZATION)}
                            onClick={() => {
                                confirmation({
                                    title: t('uploadAttachment.messages.deleteConfirmation'),
                                    onConfirm: ({onClose}) => {
                                        onRemoveOne(data.row.original)
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

    const updateUploadedFiles = (target, find, value, isFindById = false) => {
        const modifiedData = uploadedFiles.map(item => {
            if (item[isFindById ? 'attachmentId' : target] === find) {
                item = {
                    ...item,
                    [target]: value
                }
            }

            return item
        })

        setUploadedFiles(modifiedData)
    }

    const dataTable = () => {
        const columns = React.useMemo(
            () => [
                {
                    Header: t('uploadAttachment.header.no'),
                    className: 'small-col-2 text-truncate',
                    headerClassName: 'small-col-2',
                    Cell: ({row}) => {
                        return !row.depth && row.index + 1
                    }
                },
                {
                    Header: t('uploadAttachment.header.attachmentName'),
                    accessor: 'name',
                    className: 'small-col-2 text-truncate',
                    headerClassName: 'small-col-2',
                    Cell: ({row}) => {
                        return !row.depth && <SimpleInlineInput
                            className="form-control"
                            defaultValue={row.original.name}
                            type="text"
                            handleSubmit={e => updateUploadedFiles('name', row.original.name, e)}
                        />
                    }
                },
                {
                    Header: t('uploadAttachment.header.uploadedDate'),
                    accessor: 'createdDate',
                    className: 'small-col-2 text-truncate',
                    headerClassName: 'small-col-2',
                    Cell: ({value}) => filters.dateTime(value)
                },
                {
                    Header: t('uploadAttachment.header.uploadedBy'),
                    accessor: 'createdBy',
                    className: 'small-col-2 text-truncate',
                    headerClassName: 'small-col-2'
                },
                {
                    Header: t('uploadAttachment.header.note'),
                    accessor: 'note',
                    className: 'small-col-2 text-truncate',
                    headerClassName: 'small-col-2',
                    Cell: ({row}) => {
                        return <SimpleInlineInput
                            className="form-control"
                            type="textarea"
                            defaultValue={row.original.note}
                            placeholder={t('uploadAttachment.placeholder.inputNote')}
                            handleSubmit={(e) => {
                                updateUploadedFiles('note', row.original.attachmentId, e, true)
                            }}
                        />
                    }
                },
                {
                    Header: t('uploadAttachment.header.attachment'),
                    accessor: 'attachment',
                    className: 'small-col-2 text-truncate',
                    headerClassName: 'small-col-2',
                    Cell: ({value, row}) => {
                        return <a title={value.name} href="#" onClick={(e) => {
                            e.preventDefault()
                            download(row.original.attachmentId, value.name)
                        }}>{value.name}</a>
                    }
                },
                {
                    Header: "  ",
                    className: 'action-col',
                    headerClassName: 'action-col',
                    Cell: (data) => actionButton(data)
                }
            ],
            [uploadedFiles]
        )

        return {columns, data: uploadedFiles, isLocal: true}
    };

    return (
        <>
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
                                   hasExpanding={true}
                        />
                    }
                </div>
            </div>
            <UploadModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={onSave}
            />
        </>
    )

}

LocalAttachments.propTypes = {
    setLocalAttachments: PropTypes.func,
    onDeleteFile: PropTypes.func
};

LocalAttachments.defaultProps = {};

export default LocalAttachments;
