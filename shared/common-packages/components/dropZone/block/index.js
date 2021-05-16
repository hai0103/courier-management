import React, {useCallback, useMemo, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import {FormControl, Response} from "utils/common";
import {AssetApi} from "services/asset";
import {MIME_TYPE} from "globalConstants/common";
import filters from "utils/filters";

function BlockDropzone(props) {
    const [uploadedFile, setUploadedFile] = useState([]);
    const isImage = (mimeType) => {
        return mimeType.split('/').includes('image')
    }
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: props.acceptedFiles,
        disabled: props.disabled,
        noDrag: props.noDrag,
        maxFiles: props.maxFiles,
        multiple: props.multiple,
        onDrop: acceptedFiles => {
            acceptedFiles.map(file => {
                if (isImage(file.type)) {
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                }
            })
            props.onDrop(acceptedFiles)
            setUploadedFile(acceptedFiles);
        }
    });
    const {t} = useTranslation('common');

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#2196f3',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out'
    };

    const activeStyle = {
        borderColor: '#2196f3'
    };

    const acceptStyle = {
        borderColor: '#00e676'
    };

    const rejectStyle = {
        borderColor: '#ff1744'
    };

    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    };

    const thumb = {
        display: 'inline-flex',
        // borderRadius: 2,
        // border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        // width: 100,
        // height: 100,
        padding: 4,
        boxSizing: 'border-box',
        textAlign: 'center'
    };

    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    };

    const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
    };

    const fileThumb = {
        fontSize: '90px',
        marginTop: '-18px',
        marginLeft: '11px'
    }
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
        ...(props.isError ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept,
        props.isError
    ]);

    // const uploadAttachment = async (file) => {
    //     const category = 'agency'
    //     return await AssetApi.upload({
    //         file,
    //         type: category
    //     });
    // }

    // const save = async (data) => {
    //     try {
    //         const response = await uploadAttachment(data.attachments[0]);
    //         if (Response.isSuccessAPI(response)) {
    //             data.attachmentId = Response.getAPIData(response)
    //             props.onSave(data)
    //             props.onClose()
    //         } else {
    //             addToast(Response.getAPIError(response), {appearance: 'error'});
    //         }
    //     } catch (error) {
    //         addToast(Response.getErrorMessage(error), {appearance: 'error'});
    //     }
    // }



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
                return <i className="fa fa-file-o fa-5x text-white" aria-hidden="true"></i>
        }
    }

    const thumbs = uploadedFile.map(file => {
        return <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                {
                    file.preview ? <img
                            src={file.preview}
                            style={img}
                        />
                        : <div style={fileThumb}>{createPreview(file.type)}</div>
                }
            </div>
        </div>
    });

    return (
        <>
            <div className="form-row">
                <div className="col-12 mb-1">
                    <div {...getRootProps({style})} className="card-attachment">
                        <input {...getInputProps()} />
                        <div className="text-center align-content-center justify-content-center">
                            <p className="mb-0">&nbsp;{props.message ? props.message : t('uploadAttachment.placeholder.dropItem')}</p>
                            <em>{props.acceptedFilesMessage}</em>
                        </div>
                    </div>
                </div>
                {
                    uploadedFile.map(file => (
                        <div className="col-1">
                            <div className="card-image">
                                <div key={file.name}>
                                    {
                                        file.preview ? <img className="img-responsive" src={file.preview} /> : <div>{createPreview(file.type)}</div>
                                    }
                                </div>
                                <div className="card-image-desc" key={file.path}>
                                    <h5 className="mb-0 text-truncate text-white text-lowercase spacing-0" title={file.path}>{file.path}</h5>
                                    <p className="mb-0"><small>{filters.number(file.size)} bytes</small></p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );

}

BlockDropzone.propTypes = {
    message: PropTypes.string,
    acceptedFiles: PropTypes.string,
    acceptedFilesMessage: PropTypes.string,
    disabled: PropTypes.bool,
    noDrag: PropTypes.bool,
    multiple: PropTypes.bool,
    hasThumb: PropTypes.bool,
    isError: PropTypes.bool,
    maxFiles: PropTypes.number,
    onDrop: PropTypes.func
};

BlockDropzone.defaultProps = {
    message: '',
    disabled: false,
    noDrag: false,
    maxFiles: 2,
    multiple: true,
    isError: false,
    hasThumb: true
};
export default BlockDropzone
