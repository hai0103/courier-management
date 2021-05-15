import React, {useState} from "react";
import {ROUTES} from "constants/common";
import _ from "lodash";
import {useRouter} from 'next/router';
import SelectBox from "sharedComponents/selectBox";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import {useToasts} from 'react-toast-notifications';
import {InlineInput} from "sharedComponents/formControl";
import {FormControl, Response} from "utils/common";
import FormRules from "utils/formRules";
import SocketHelpers from "utils/socketHelpers";
import {useSocket} from "providers/socket";
import InvalidFeedBack from "sharedComponents/formControl/invalidFeedback";


function ReinsuranceClassForm(props) {
    const {register, errors, handleSubmit, control, setValue, formState, setError, watch, clearErrors} = useForm();
    const {t} = useTranslation('common');
    const {addToast} = useToasts();
    const router = useRouter();
    const [detail, setDetail] = useState(props.detail);
    const {socketClient} = useSocket();
    const [isEdit] = useState(() => {
        return !(_.isEmpty(props.id));
    });

    const pushToList = () => {
        router.push(ROUTES.REINSURANCE_CLASS)
    }
    const pushToDetail = (id) => {
        if (id) {
            router.push(`${ROUTES.REINSURANCE_CLASS}/${id}?readOnly`);
        } else {
            router.push(ROUTES.REINSURANCE_CLASS)
        }
    }


    const save = async (data) => {
        const payload = {
            ...detail,
            ...data
        }
        try {
            isEdit ? await onSubmitUpdate(payload) : await onSubmitCreate(payload);
        } catch (error) {

        }
    }

    const onSubmitCreate = async (data) => {
        const payload = {
            ...data,
        }
        // const response = await ReinsuranceApi.create(payload);
        // if (Response.isSuccessAPI(response)) {
        //     const entity = Response.getAPIData(response)
        //     SocketHelpers.fastSubscribe(`/topic/reinsurance-added/${entity}`, () => {
        //         pushToDetail(entity)
        //         addToast(
        //             <div className='justify-content-center align-content-center text-center'>
        //                 {t('common.message.createSuccess')}
        //             </div>, {appearance: 'success'})
        //     }, socketClient);
        // } else {
        //     addToast(
        //         <div className='justify-content-center align-content-center text-center'>
        //             {Response.getAPIError(response)}
        //         </div>, {appearance: 'error'});
        // }
    };

    const onSubmitUpdate = async (data) => {
        const payload = {
            id: props.id,
            body: {
                ...data,
            }
        }
        //
        // const response = await ReinsuranceApi.update(payload);
        // if (Response.isSuccessAPI(response)) {
        //     addToast(
        //         <div className='justify-content-center align-content-center text-center'>
        //             {t('common.message.editSuccess')}
        //         </div>, {appearance: 'success'});
        //     const responseData = Response.getAPIData(response);
        //     updateDetail(responseData);
        // } else {
        //     addToast(
        //         <div className='justify-content-center align-content-center text-center'>
        //             {Response.getAPIError(response)}
        //         </div>, {appearance: 'error'});
        // }
    };

    const updateDetail = (responseData) => {
        if (responseData.aggregate) {
            const newData = responseData.aggregate
            const mergedData = {
                ...detail,
                ...newData
            }

            setDetail(mergedData);
        }
    }

    const reGetDetail = async () => {
        // const response = await ReinsuranceApi.findById(props.id);
        // if (Response.isSuccessAPI(response)) {
        //     const responseData = Response.getAPIData(response);
        //     updateDetail({aggregate: responseData});
        // } else {
        //     addToast(Response.getAPIError(response), {appearance: 'error'});
        // }
    }

    const requiredTextControl = (field) => {
        const validation = FormControl.getValidation(field, errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {
            required: FormRules.required(),
        };

        return {
            classNames,
            rules,
            ...validation
        }
    };

    return (
        <div className="animated slideInRight">
            <div className="row">
                <div className="col-md-12">
                    <div className="card card-form card-no-border mb-0 shadow-none max-height">
                        <div className="card-header card-header-main bg-light-primary">
                            {isEdit && <button onClick={() => pushToList()}
                                               title={"Back"}
                                               className="avatar btn-avatar"
                            >
                                <i className="far fa-arrow-left"/>
                            </button>}
                            <h3 className="content-header-title mb-0">
                                {isEdit ? props.detail?.reinsuranceClass : t("reinsuranceClassManagement.createTitle")}
                            </h3>
                            <div className="heading-elements">
                                {
                                    (isEdit) ?
                                        <ul className="list-inline">
                                            <li className="pl-1 border-separate">
                                                <button title={t("common.delete")} className="avatar btn-avatar"
                                                        onClick={() => {

                                                        }}
                                                >
                                                    <i className="far fa-close"/>
                                                </button>
                                            </li>
                                            {
                                                detail?.status ?
                                                    <li className="pl-1 border-separate">
                                                        <button title={t("common.block")} className="avatar btn-avatar"
                                                                onClick={() => {

                                                                }}
                                                        >
                                                            <i className="far fa-ban"/>
                                                        </button>
                                                    </li> :
                                                    <li>
                                                        <button title={t("common.unblock")}
                                                                className="avatar btn-avatar"
                                                                onClick={() => {

                                                                }}
                                                        >
                                                            <i className="far fa-redo"/>
                                                        </button>
                                                    </li>
                                            }
                                            <li className="pl-1">
                                                <label
                                                    // onClick={() => setShowHistory(true)}
                                                    id="menu-toggle-sm"
                                                    className="opacity-normal">
                                                    <a title={t('history.editingHistoryTitle')}
                                                        // className={'avatar btn-avatar' + (showHistory ? ' active' : '')}>
                                                       className={'avatar btn-avatar'}>
                                                        <i className="far fa-history"/>
                                                    </a>
                                                </label>
                                            </li>
                                        </ul>
                                        :
                                        <>
                                            <button onClick={() => pushToList()}
                                                    className="btn btn-outline-secondary mr-50"
                                            >
                                                {t('common.button.cancel')}
                                            </button>
                                            <button type="submit"
                                                    onClick={handleSubmit(save)}
                                                    className="btn btn-primary btn-min-width"
                                            >
                                                {t('common.button.create')}
                                            </button>
                                        </>
                                }
                            </div>
                        </div>
                        {/*{*/}
                        {/*    isEdit &&*/}
                        {/*    <div className={'slide-menu slide-menu-sm border-left' + (showHistory ? ' open' : '')}>*/}
                        {/*        {showHistory && <HistoryPanel {...historyOptions()} />}*/}
                        {/*    </div>*/}
                        {/*}*/}
                        <div className="slide-content">
                            <div className="card-content card-scroll">
                                <FormProvider formState={formState}>
                                    <form onSubmit={handleSubmit(save)}>
                                        <div className="card card-section">
                                            <div className="card-body px-0">
                                                <div className="form-row form-edit-header py-0">
                                                    <div className="col-xl-3 col-lg-4 col-md-6 col-xs-12">
                                                        <fieldset className="form-group form-group-sm">
                                                            <label>
                                                                {t("reinsuranceClassManagement.create.label.parentReinsuranceClass")}
                                                            </label>
                                                            <article>
                                                                <div className={`position-relative has-icon-right`}>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="parentReinsuranceClass"
                                                                        disabled
                                                                        defaultValue={"XG.1.1"}
                                                                    />
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                        <fieldset className="form-group form-group-sm required">
                                                            <label>
                                                                {t('reinsuranceClassManagement.create.label.reinsuranceClass')}
                                                            </label>
                                                            <article>
                                                                <div className="position-relative has-icon-right">
                                                                    {
                                                                        isEdit ? <InlineInput
                                                                                className={requiredTextControl('reinsuranceClass').classNames}
                                                                                defaultValue={props.detail?.reinsuranceClass}
                                                                                handleSubmit={handleSubmit(save)}
                                                                                type="text"
                                                                                name="reinsuranceClass"
                                                                                register={register(requiredTextControl('reinsuranceClass').rules)}
                                                                            /> :
                                                                            <input
                                                                                className={requiredTextControl('reinsuranceClass').classNames}
                                                                                placeholder={t('reinsuranceClassManagement.create.placeHolder.reinsuranceClass')}
                                                                                name="reinsuranceClass"
                                                                                ref={register(requiredTextControl('reinsuranceClass').rules)}
                                                                            />
                                                                    }
                                                                    <InvalidFeedBack
                                                                        message={requiredTextControl('reinsuranceClass').errorMessage}/>
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                        <fieldset className="form-group form-group-sm required">
                                                            <label>
                                                                {t('reinsuranceClassManagement.create.label.reinsuranceClassName')}
                                                            </label>
                                                            <article>
                                                                <div className="position-relative has-icon-right">
                                                                    {
                                                                        isEdit ? <InlineInput
                                                                                className={requiredTextControl('reinsuranceClassName').classNames}
                                                                                defaultValue={props.detail?.reinsuranceClassName}
                                                                                handleSubmit={handleSubmit(save)}
                                                                                type="text"
                                                                                name="reinsuranceClassName"
                                                                                register={register(requiredTextControl('reinsuranceClassName').rules)}
                                                                            /> :
                                                                            <input
                                                                                className={requiredTextControl('reinsuranceClassName').classNames}
                                                                                placeholder={t('reinsuranceClassManagement.create.placeHolder.reinsuranceClassName')}
                                                                                name="reinsuranceClassName"
                                                                                ref={register(requiredTextControl('reinsuranceClassName').rules)}
                                                                            />
                                                                    }
                                                                    <InvalidFeedBack
                                                                        message={requiredTextControl('reinsuranceClassName').errorMessage}/>
                                                                </div>
                                                            </article>
                                                        </fieldset>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                        <fieldset className="form-group form-group-sm">
                                                            <label>
                                                                {t('reinsuranceClassManagement.create.label.reinsuranceClassNameEN')}
                                                            </label>
                                                            <article>
                                                                <div className="position-relative has-icon-right">
                                                                    {
                                                                        isEdit ? <InlineInput
                                                                                className="form-control"
                                                                                defaultValue={props.detail?.reinsuranceClassNameEN}
                                                                                handleSubmit={handleSubmit(save)}
                                                                                type="text"
                                                                                name="reinsuranceClassNameEN"
                                                                                register={register()}
                                                                            /> :
                                                                            <input
                                                                                className="form-control"
                                                                                placeholder={t('reinsuranceClassManagement.create.placeHolder.reinsuranceClassNameEN')}
                                                                                name="reinsuranceClassNameEN"
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
                                    </form>
                                </FormProvider>

                                <div className="card card-section">
                                    <div className="card-header">
                                        <div
                                            className="form-section d-flex align-items-center">
                                            <h5 className="mb-0">{t('reinsuranceClassManagement.create.business.title')}</h5>
                                            <button onClick={() => {

                                            }} type="button" className="avatar avatar-sm btn-avatar ml-2"
                                                    title={t('reinsuranceClassManagement.create.business.buttonAdd')}>
                                                <i className="fal fa-plus-circle"/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body px-0">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ReinsuranceClassForm.propTypes = {
    id: PropTypes.string,
    detail: PropTypes.object,
};

ReinsuranceClassForm.defaultProps = {
    readOnly: false,
    detail: {},
};

export default ReinsuranceClassForm;
