import React from "react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Modal from "sharedComponents/modal";
import {FormControl, Response} from "utils/common";
import {useToasts} from "react-toast-notifications";
import {Controller, useForm} from "react-hook-form";
import FileDropzone from "sharedComponents/dropZone";
import FormRules from "utils/formRules";
import InvalidFeedBack from "sharedComponents/formControl/invalidFeedback";
import {MIME_TYPE} from "globalConstants/common";
import {AssetApi} from "services/asset";

function UploadModal(props) {

    const {register, errors, handleSubmit, control} = useForm();
    const {t} = useTranslation('common');
    const {addToast} = useToasts();

    const uploadAttachment = async (file) => {
        const category = 'distribution'
        return await AssetApi.upload({
            file,
            type: category
        });
    }

    const nameControl = () => {
        const validation = FormControl.getValidation('name', errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {
            required: FormRules.required()
        };

        return {
            classNames,
            rules,
            ...validation
        }
    }

    const save = async (data) => {
        try {
            const response = await uploadAttachment(data.attachments[0]);
            if (Response.isSuccessAPI(response)) {
                data.attachmentId = Response.getAPIData(response)
                props.onSave(data)
                props.onClose()
            } else {
                addToast(Response.getAPIError(response), {appearance: 'error'});
            }
        } catch (error) {
            addToast(Response.getErrorMessage(error), {appearance: 'error'});
        }
    }

    return (
        <div>
            <Modal
                isOpen={props.show}
                modalName="modal-user-roles"
                onClose={() => {
                    props.onClose()
                }}
                title={t('uploadAttachment.title')}
                centered
            >
                <Modal.Body>
                    {
                        <form>
                            {/* Tên tài liệu */}
                            <fieldset className="form-group form-group-sm position-relative required">
                                <label>
                                    {t('uploadAttachment.header.attachmentName')}
                                </label>
                                <article>
                                    <div className='position-relative has-icon-right'>
                                        <input type="text"
                                               className={nameControl().classNames}
                                               placeholder={t('uploadAttachment.placeholder.nameAttachment')}
                                               name="name"
                                               ref={register(nameControl().rules)}
                                        />
                                        <InvalidFeedBack message={nameControl().errorMessage}/>
                                    </div>
                                </article>
                            </fieldset>
                            <fieldset className="form-group form-group-sm position-relative">
                                <label>
                                    {t('uploadAttachment.header.note')}
                                </label>
                                <textarea className="form-control"
                                          rows="3"
                                          placeholder={t('uploadAttachment.placeholder.inputNote')}
                                          onChange={(e) => {
                                          }}
                                          name="note"
                                          ref={register}
                                />
                            </fieldset>
                            <fieldset className="form-group form-group-sm position-relative">
                                <label>
                                    {t('common.attachment')}
                                </label>
                                <Controller
                                    control={control}
                                    name="attachments"
                                    defaultValue={null}
                                    rules={{required: FormRules.required()}}
                                    render={({onChange}) => (
                                        <FileDropzone acceptedFiles={`
                                        ${MIME_TYPE.IMAGE},
                                        ${MIME_TYPE.PDF},
                                        ${MIME_TYPE.WORD},
                                        ${MIME_TYPE.WORD_X},
                                        ${MIME_TYPE.EXCEL},
                                        ${MIME_TYPE.EXCEL_X},
                                        ${MIME_TYPE.RAR},
                                        ${MIME_TYPE.ZIP},
                                        ${MIME_TYPE.ZIP_7z}
                                    `}
                                                      acceptedFilesMessage={t('uploadAttachment.messages.acceptedFileDesc')}
                                                      multiple={false}
                                                      onDrop={onChange}
                                                      isError={FormControl.getValidation('attachments', errors).isError}
                                        />
                                    )}
                                />

                            </fieldset>

                        </form>
                    }
                </Modal.Body>

                <Modal.Footer>
                    <button type="button" className="btn btn-outline-secondary mr-25"
                            onClick={() => {
                                props.onClose()
                            }}>
                        <span
                            className="d-none d-sm-block">{t('common.button.cancel')}</span>
                    </button>
                    <button type="button" className="btn btn-primary btn-min-width"
                            onClick={handleSubmit(save)}
                    >
                        <span
                            className="d-none d-sm-block">
                            {t('uploadAttachment.button.upload')}
                        </span>
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

UploadModal.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    onSave: PropTypes.func
};

UploadModal.defaultProps = {
    show: false,
    detail: {},
};

export default UploadModal
