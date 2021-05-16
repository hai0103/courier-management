import React, {useEffect, useMemo, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {useTranslation} from "react-i18next";
import filters from "utils/filters";
import PropTypes from "prop-types";
import {MIME_TYPE} from "globalConstants/common";
import {isEmpty} from "lodash"
import InvalidFeedBack from "sharedComponents/formControl/invalidFeedback";
import {trans} from "utils/helpers";

const ERROR_CODE = {
    FILE_INVALID_TYPE: 'file-invalid-type',
    FILE_TOO_LARGE: 'file-too-large',
}

function Dropzone(props) {
    const [uploadedFile, setUploadedFile] = useState([]);
    const [internalError, setInternalError] = useState(null);
    const isImage = (mimeType) => {
        return mimeType.split('/').includes('image')
    }
    const {
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: props.acceptedFiles,
        disabled: props.disabled,
        noDrag: props.noDrag,
        maxFiles: props.maxFiles,
        multiple: props.multiple,
        maxSize: props.maxSize,
        onDrop: (acceptedFiles) => {
            acceptedFiles.map(file => {
                if (isImage(file.type)) {
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                }
            })
            const finalFiles = props.multiple ? [...acceptedFiles, ...uploadedFile] : acceptedFiles

            if (!isEmpty(finalFiles)) {
                props.onDrop(finalFiles)
                setUploadedFile(finalFiles);
                setInternalError(null)
            }
        },
        onDropRejected: (fileRejections) => {
            if (!isEmpty(fileRejections)) {
                fileRejections.forEach(item => {
                    item.errors.forEach(error => {
                        switch (error.code) {
                            case ERROR_CODE.FILE_INVALID_TYPE: {
                                setInternalError(trans('uploadAttachment.errors.fileInvalidType'))
                                break
                            }
                            case ERROR_CODE.FILE_TOO_LARGE: {
                                setInternalError(trans('uploadAttachment.errors.fileTooLarge', {
                                    size: props.maxSize / (1024 * 1024)
                                }))
                                break
                            }
                            default: {
                                setInternalError(null)
                                break
                            }
                        }
                    })
                })
            }
        }
    });
    const {t} = useTranslation('common');

    useEffect(() => {
        if (props.isError) {
            setInternalError(trans('uploadAttachment.errors.fileEmpty'))
        }
    }, [props.isError])

    const classNames = useMemo(() => (
        (isDragAccept ? 'border-success' : '') ||
        (isDragReject ? 'border-danger' : '') ||
        (props.isError ? 'border-danger is-invalid' : '') ||
        (internalError ? 'border-danger is-invalid' : '')
    ), [
        isDragReject,
        isDragAccept,
        props.isError,
        internalError
    ]);

    const createPreview = (type) => {
        switch (type) {
            case MIME_TYPE.PDF: {
                return <i className="fa fa-file-pdf-o fa-5x text-white" aria-hidden="true"></i>
            }
            case MIME_TYPE.EXCEL_X:
            case MIME_TYPE.EXCEL: {
                return <i className="fa fa-file-excel-o fa-5x text-white" aria-hidden="true"></i>
            }
            case MIME_TYPE.WORD_X:
            case MIME_TYPE.WORD: {
                return <i className="fa fa-file-word-o fa-5x text-white" aria-hidden="true"></i>
            }
            default:
                return <i className="fa fa-file fa-5x text-white" aria-hidden="true"></i>
        }
    }

    const thumbs = (file) => {
        return <>
            {
                file.preview ? <img className="img-responsive" src={file.preview}/> :
                    <div>{createPreview(file.type)}</div>
            }
        </>
    };

    return (
        <>
            <div {...getRootProps()} className={`card-attachment position-relative has-icon-right ${classNames}`}>
                <input {...getInputProps()} />
                <div className="text-center align-content-center justify-content-center text-body">
                    <p className="mb-0">{props.message ? props.message : t('uploadAttachment.placeholder.dropItem')}</p>
                    <em>{props.acceptedFilesMessage}</em>
                </div>
                <InvalidFeedBack message={internalError} />
            </div>
            {
                props.hasThumb && <div className="form-row mt-1">
                    {
                        uploadedFile.map((file, index) => (
                            <div className="col-3" key={index}>
                                <div className="card-image">
                                    {thumbs(file)}
                                    <div className="card-image-desc" key={file.path}>
                                        <h5 className="mb-0 text-truncate text-lowercase" title={file.path}>{file.path}</h5>
                                        <p className="mb-0"><small>{filters.number(file.size)} bytes</small></p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }

        </>
    );
}

Dropzone.propTypes = {
    message: PropTypes.string,
    acceptedFiles: PropTypes.string,
    acceptedFilesMessage: PropTypes.string,
    disabled: PropTypes.bool,
    noDrag: PropTypes.bool,
    multiple: PropTypes.bool,
    hasThumb: PropTypes.bool,
    isError: PropTypes.bool,
    maxFiles: PropTypes.number,
    onDrop: PropTypes.func,
    maxSize: PropTypes.number
};

Dropzone.defaultProps = {
    message: '',
    disabled: false,
    noDrag: false,
    maxFiles: 2,
    multiple: true,
    isError: false,
    hasThumb: true,
    maxSize: 10485760
};

export default Dropzone
