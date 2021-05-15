import React, {useState, useEffect} from "react";
import {Controller, useForm, useFormContext} from "react-hook-form";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import {InlineInput} from "sharedComponents/formControl";
import {DataTableProvider} from "providers/dataTable";
import Attachments from "../attachment/attachments";
import LocalAttachments from "../attachment/localAttachments";
import {useToasts} from "react-toast-notifications";
import {AssetApi} from "services/asset";
import {isEmpty} from "lodash"

function OtherInformation(props) {
    const {register, errors, control, setValue, watch} = useFormContext();
    const {t} = useTranslation('common');
    const [localAttachments, setLocalAttachments] = useState([])
    const {addToast} = useToasts();

    const deleteFile = async (id) => {
        try {
            return await AssetApi.delete(id);
        } catch (error) {
            addToast(
                <div className='justify-content-center align-content-center text-center'>
                    {Response.getErrorMessage(error)}
                </div>, {appearance: 'error'});
        }
    }

    useEffect(() => {
        register({
            name: 'uploadRequests',
            value: localAttachments
        })
    }, [])

    useEffect(() => {
        if (!isEmpty(localAttachments)) {
            setValue('uploadRequests', localAttachments)
        }
    }, [localAttachments])


    return (
        <>
            <div className="card card-section">
                <div className="card-body px-0">
                    <div className="form-row pb-2 pt-2">
                        <div className="col-xl-6 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm">
                                <label>
                                    {t('reinsuranceManagement.create.label.note')}
                                </label>
                                <article>
                                    <div className="position-relative has-icon-right">
                                        {
                                            props.isEdit ? <InlineInput
                                                    type="textarea"
                                                    handleSubmit={props.onSubmit}
                                                    defaultValue={props.detail?.note}
                                                    className={'form-control'}
                                                    register={register()}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.note')}
                                                    name="note"
                                                /> :
                                                <textarea
                                                    className={'form-control'}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.note')}
                                                    name="note"
                                                    ref={register()}
                                                />
                                        }

                                    </div>
                                </article>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
            {
                props.isEdit ?
                    <DataTableProvider>
                        <Attachments
                            id={props.detail.id}
                            onDeleteFile={deleteFile}/>
                    </DataTableProvider>

                    : <LocalAttachments setLocalAttachments={setLocalAttachments} onDeleteFile={deleteFile}/>
            }
        </>
    )
}

OtherInformation.propTypes = {
    isEdit: PropTypes.bool,
    onSubmit: PropTypes.func,
    detail: PropTypes.object
};

OtherInformation.defaultProps = {
    isEdit: false,
    detail: {}
};

export default OtherInformation
