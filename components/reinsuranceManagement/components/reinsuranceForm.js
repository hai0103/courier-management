import React, {useState} from "react";
import {ROUTES} from "constants/common";
import _ from "lodash";
import {useRouter} from 'next/router';
import SelectBox from "sharedComponents/selectBox";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import Tab from "sharedComponents/tab";
import PropTypes from "prop-types";
import {useToasts} from 'react-toast-notifications';
import {InlineInput} from "sharedComponents/formControl";
import GeneralInformation from "./tabs/generalInfo";
import OtherInformation from "./tabs/otherInfo";
import ListReinsurance from "./tabs/listReinsurance";
import ListCompanyInsurance from "./tabs/listCompanyInsurance";
import {FormControl, Response} from "utils/common";
import FormRules from "utils/formRules";
import {ReinsuranceApi} from "services/reinsurance";
import SocketHelpers from "utils/socketHelpers";
import {useSocket} from "providers/socket";

function ReinsuranceForm(props) {
    const {register, errors, handleSubmit, control, setValue, formState, setError, watch, clearErrors} = useForm();
    const {t} = useTranslation('common');
    const {addToast} = useToasts();
    const router = useRouter();
    const [detail, setDetail] = useState(props.detail);
    const {socketClient} = useSocket();
    const reinsuranceTypes = [
        {
            label: "Nhà tái",
            value: 0
        },
        {
            label: "Môi giới tái",
            value: 1
        }
    ]
    const [isEdit] = useState(() => {
        return !(_.isEmpty(props.id));
    });

    const pushToList = () => {
            router.push(ROUTES.REINSURANCE)
    }
    const pushToDetail = (id) => {
        if(id){
            router.push(`${ROUTES.REINSURANCE}/${id}?readOnly`);
        } else {
            router.push(ROUTES.REINSURANCE)
        }
    }

    const filterTab = () => {
        const tabList = [
            {
                name: t("reinsuranceManagement.create.generalInfo"),
                child: <GeneralInformation isEdit={isEdit}
                                           onSubmit={handleSubmit(save)}
                                           nationalities={props.nationalities}
                                           ratingList={props.ratingList}
                                           listReinsurance={props.listReinsurance}
                                           id={props.id}
                                           detail={detail}
                                           reGetDetail={reGetDetail}
                                           companiesRating={props.companiesRating}/>
            },
            {
                name: t("reinsuranceManagement.detail.listReinsurance"),
                child: <ListReinsurance/>
            },
            {
                name: t("reinsuranceManagement.detail.companyInsurance"),
                child: <ListCompanyInsurance/>
            },
            {
                name: t("reinsuranceManagement.create.otherInfo"),
                child: <OtherInformation isEdit={isEdit}
                                         onSubmit={handleSubmit(save)}
                                         detail={detail}
                                         companies={props.companies}
                                         listReinsurance={props.listReinsurance}
                />
            },
        ]
        if (isEdit) {
            if (detail.type === 1) {
                return tabList.filter(item => item.name !== t("reinsuranceManagement.detail.companyInsurance"))
            } else {
                return tabList.filter(item => item.name !== t("reinsuranceManagement.detail.listReinsurance"))
            }
        } else {
            const tab = tabList.filter(item => item.name !== t("reinsuranceManagement.detail.listReinsurance"))
            return tab.filter(item => item.name !== t("reinsuranceManagement.detail.companyInsurance"))
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
            if (error.response.data?.errorCode === 'REINSURANCE.TAX_NUMBER_EXISTED') {
                setError('taxNumber', {
                    type: 'manual',
                    message: t("common.message.reinsuranceTaxNumberExisted"),
                })
            } else if (error.response.data?.errorCode === 'REINSURANCE.NAME_EXISTED') {
                setError('reinsuranceName', {
                    type: 'manual',
                    message: Response.getErrorMessage(error),
                })
            } else if (error.response.data?.errorCode === 'REINSURANCE.NAME_SHORT_EXISTED') {
                setError('reinsuranceNameShort', {
                    type: 'manual',
                    message: Response.getErrorMessage(error),
                })
            } else if (error.response.data?.errorCode === 'REINSURANCE.NAME_EN_EXISTED') {
                setError('reinsuranceNameEN', {
                    type: 'manual',
                    message: t("common.message.reinsuranceNameENExisted"),
                })
            } else if (error.response.data?.errorCode === 'REINSURANCE.BANK_NOT_FOUND') {
                setError('bankId', {
                    type: 'manual',
                    message: Response.getErrorMessage(error),
                })
            }
        }
    }

    const onSubmitCreate = async (data) => {
        const payload = {
            ...data,
            reinsuranceParentId: data.reinsuranceParentId || "",
            expertiseId: data.expertiseId || [],
            lstContact: data.lstContact || []
        }
        const response = await ReinsuranceApi.create(payload);
        if (Response.isSuccessAPI(response)) {
            const entity = Response.getAPIData(response)
            SocketHelpers.fastSubscribe(`/topic/reinsurance-added/${entity}`, () => {
                pushToDetail(entity)
                addToast(
                    <div className='justify-content-center align-content-center text-center'>
                        {t('common.message.createSuccess')}
                    </div>, {appearance: 'success'})
            }, socketClient);
        } else {
            addToast(
                <div className='justify-content-center align-content-center text-center'>
                    {Response.getAPIError(response)}
                </div>, {appearance: 'error'});
        }
    };

    const onSubmitUpdate = async (data) => {
        const payload = {
            id: props.id,
            body: {
                ...data,
            }
        }

        const response = await ReinsuranceApi.update(payload);
        if (Response.isSuccessAPI(response)) {
            addToast(
                <div className='justify-content-center align-content-center text-center'>
                    {t('common.message.editSuccess')}
                </div>, {appearance: 'success'});
            const responseData = Response.getAPIData(response);
            updateDetail(responseData);
        } else {
            addToast(
                <div className='justify-content-center align-content-center text-center'>
                    {Response.getAPIError(response)}
                </div>, {appearance: 'error'});
        }
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
        const response = await ReinsuranceApi.findById(props.id);
        if (Response.isSuccessAPI(response)) {
            const responseData = Response.getAPIData(response);
            updateDetail({aggregate: responseData});
        } else {
            addToast(Response.getAPIError(response), {appearance: 'error'});
        }
    }

    const requiredSelectBoxControl = (field) => {
        const validation = FormControl.getValidation(field, errors);
        const classNames = validation.className
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
                                {isEdit ? props.detail?.reinsuranceName : t("reinsuranceManagement.createTitle")}
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
                                <FormProvider formState={formState}
                                              register={register}
                                              errors={errors}
                                              control={control}
                                              setValue={setValue}
                                              clearErrors={clearErrors}
                                              watch={watch}
                                >
                                    <form onSubmit={handleSubmit(save)}>
                                        <div className="card card-section">
                                            <div className="card-body px-0">
                                                <div className="form-row form-edit-header py-0">
                                                    <div className="col-xl-3 col-lg-4 col-md-6 col-xs-12">
                                                        <fieldset className="form-group form-group-sm required">
                                                            <label>
                                                                {t("reinsuranceManagement.create.businessType")}
                                                            </label>
                                                            <article>
                                                                <div className={`position-relative has-icon-right ${requiredSelectBoxControl('type').isError ? 'is-invalid' : ''}`}>
                                                                    {
                                                                        isEdit ?
                                                                            <InlineInput
                                                                                type="select"
                                                                                disabled
                                                                                defaultValue={detail.type}
                                                                                options={reinsuranceTypes}
                                                                            />
                                                                            :
                                                                            <Controller
                                                                                render={(ctrl) => (
                                                                                    <SelectBox
                                                                                        placeholder={t("reinsuranceManagement.create.businessTypePlaceholder")}
                                                                                        onChange={ctrl.onChange}
                                                                                        value={ctrl.value}
                                                                                        error={requiredSelectBoxControl('type').isError}
                                                                                        errMess={requiredSelectBoxControl('type').errorMessage}
                                                                                        options={reinsuranceTypes}
                                                                                    />
                                                                                )}
                                                                                name="type"
                                                                                control={control}
                                                                                defaultValue={null}
                                                                                rules={requiredSelectBoxControl('type').rules}
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
                                    <Tab content={filterTab()}/>
                                </FormProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ReinsuranceForm.propTypes = {
    id: PropTypes.string,
    nationalities: PropTypes.array,
    listReinsurance: PropTypes.object,
    ratingList: PropTypes.array,
    companies: PropTypes.array,
    detail: PropTypes.object,
    companiesRating: PropTypes.array,
};

ReinsuranceForm.defaultProps = {
    readOnly: false,
    detail: {},
    companiesRating: [],
};

export default ReinsuranceForm;
