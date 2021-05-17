import PropTypes from "prop-types";
import React, {useEffect, useState, useRef} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {DataTableProvider} from "providers/dataTable";
import {useTranslation} from "react-i18next";
import {InlineInput} from "sharedComponents/formControl";
import {FormControl, Response} from "utils/common";
import FormRules from "utils/formRules";
import SelectBox from "sharedComponents/selectBox";
import InvalidFeedBack from "sharedComponents/formControl/invalidFeedback";
import DateTimeInput from "sharedComponents/dateTimeInput";
import filter from "utils/filters";
import Rating from "../rating";
import EditRatingModal from "../modals/editRating";
import ListContact from "../listContact";
import {ReinsuranceApi} from "services/reinsurance";
import {useToasts} from "react-toast-notifications";
import ModalConfirmation from "sharedComponents/modal/confirmation";
import ReinsuranceHelpers from "../../../../helpers/reinsuranceHelpers";
import moment from "moment";
import {DATE_FORMAT} from "globalConstants/common";

function GeneralInformation(props) {
    const {register, errors, control, setValue, clearErrors, watch} = useFormContext();
    const {addToast} = useToasts();
    const {t} = useTranslation('common');
    const defaultContactList = {
        nameContact: null,
        positionContact: null,
        phoneContact: null,
        emailContact: null,
        scopeContact: null,
    }

    const [lstContact, setContactList] = useState([defaultContactList]);
    const [listRating, setListRating] = useState(props.detail.lstCreditRatingModel || []);
    const [showEditRating, setShowEditRating] = useState(false);
    const [showEditRatingWarning, setShowEditRatingWarning] = useState(false);
    const ratingAgencies = props.companiesRating
    const expertiseData = useRef([
        {
            value: 0,
            label: 'Bất động sản'
        },
        {
            value: 1,
            label: 'Bảo hiểm'
        }
    ])

    useEffect(() => {
        setListRating(props.detail.lstCreditRatingModel);
    }, [props.detail])

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

    const shortNameControl = () => {
        const validation = FormControl.getValidation('reinsuranceNameShort', errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {
            required: FormRules.required(),
            maxLength: FormRules.maxLength(50),
        };

        return {
            classNames,
            rules,
            ...validation
        }
    };

    const removeAllocationDepartment = (item, row) => {
        setContactList(items => {
            items[row].isRemoved = true
            return [...items]
        })
    }

    const updateRating = async (payload) => {
        try {
            const response = await ReinsuranceApi.updateCreditRating(props.id, payload);
            if (Response.isSuccessAPI(response)) {
                addToast(t('common.message.editSuccess'), {appearance: 'success'});
                setShowEditRating(false);
                setTimeout(() => {
                    props.reGetDetail().catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}));
                }, 1000)
            } else {
                addToast(Response.getErrorMessage(response), {appearance: 'error'});
            }
        } catch (error) {
            if (error.response.data?.errorCode === 'REINSURANCE.AFFECTED_DATE_WRONG') {
                setShowEditRatingWarning(true);
            } else {
                addToast(Response.getErrorMessage(error), {appearance: 'error'});
            }

        }
    }

    const contactEmailControl = (index) => {
        const validation = FormControl.getOtherValidation(`lstContact[${index}].emailContact`, errors);
        const classNames = FormControl.getControlClassNames(validation ? [validation.className] : []);
        const rules = {
            // required: FormRules.required(),
            pattern: FormRules.isEmail()
        };

        return {
            classNames,
            rules,
            ...validation
        }
    }

    const contactNameControl = (index) => {
        const validation = FormControl.getOtherValidation(`lstContact[${index}].nameContact`, errors);
        const classNames = FormControl.getControlClassNames(validation ? [validation.className] : []);
        const rules = {
            // required: FormRules.required(),
        };

        return {
            classNames,
            rules,
            ...validation
        }
    }

    const contactPhoneControl = (index) => {
        const validation = FormControl.getOtherValidation(`lstContact[${index}].phoneContact`, errors);
        const classNames = FormControl.getControlClassNames(validation ? [validation.className] : []);
        const rules = {
            // required: FormRules.required(),
        };

        return {
            classNames,
            rules,
            ...validation
        }
    }

    return (
        <>
            <div className="card card-section">
                <div className="card-body px-0">
                    <div className="form-row pb-0">
                        {
                            props.isEdit &&
                            <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                <fieldset className="form-group form-group-sm required">
                                    <label>
                                        {t('reinsuranceManagement.create.label.code')}
                                    </label>
                                    <article>
                                        <div className="position-relative has-icon-right">
                                            <InlineInput
                                                className={requiredTextControl('reinsuranceCode').classNames}
                                                defaultValue={props.detail?.reinsuranceCode}
                                                disabled={true}
                                            />
                                        </div>
                                    </article>
                                </fieldset>
                            </div>
                        }
                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm required">
                                <label>
                                    {t('reinsuranceManagement.create.label.reinsuranceNameShort')}
                                </label>
                                <article>
                                    <div className="position-relative has-icon-right">
                                        {
                                            props.isEdit ? <InlineInput
                                                    className={shortNameControl().classNames}
                                                    handleSubmit={props.onSubmit}
                                                    defaultValue={props.detail?.reinsuranceNameShort}
                                                    type="text"
                                                    name="reinsuranceNameShort"
                                                    register={register(shortNameControl().rules)}
                                                /> :
                                                <input
                                                    className={shortNameControl().classNames}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.reinsuranceNameShort')}
                                                    name="reinsuranceNameShort"
                                                    ref={register(shortNameControl().rules)}
                                                />
                                        }
                                        <InvalidFeedBack message={shortNameControl().errorMessage}/>
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm required">
                                <label>
                                    {t('reinsuranceManagement.create.label.reinsuranceName')}
                                </label>
                                <article>
                                    <div className="position-relative has-icon-right">
                                        {
                                            props.isEdit ? <InlineInput
                                                    className={requiredTextControl('reinsuranceName').classNames}
                                                    defaultValue={props.detail?.reinsuranceName}
                                                    handleSubmit={props.onSubmit}
                                                    type="text"
                                                    name="reinsuranceName"
                                                    register={register(requiredTextControl('reinsuranceName').rules)}
                                                /> :
                                                <input
                                                    className={requiredTextControl('reinsuranceName').classNames}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.reinsuranceName')}
                                                    name="reinsuranceName"
                                                    ref={register(requiredTextControl('reinsuranceName').rules)}
                                                />
                                        }
                                        <InvalidFeedBack message={requiredTextControl('reinsuranceName').errorMessage}/>
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm required">
                                <label>
                                    {t('reinsuranceManagement.create.label.reinsuranceNameEN')}
                                </label>
                                <article>
                                    <div className="position-relative has-icon-right">
                                        {
                                            props.isEdit ? <InlineInput
                                                    className={requiredTextControl('reinsuranceNameEN').classNames}
                                                    defaultValue={props.detail?.reinsuranceNameEN}
                                                    handleSubmit={props.onSubmit}
                                                    type="text"
                                                    name="reinsuranceNameEN"
                                                    register={register(requiredTextControl('reinsuranceNameEN').rules)}
                                                /> :
                                                <input
                                                    className={requiredTextControl('reinsuranceNameEN').classNames}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.reinsuranceNameEN')}
                                                    name="reinsuranceNameEN"
                                                    ref={register(requiredTextControl('reinsuranceNameEN').rules)}
                                                />
                                        }
                                        <InvalidFeedBack
                                            message={requiredTextControl('reinsuranceNameEN').errorMessage}/>
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                    </div>
                    <div className="form-row py-0">
                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm required">
                                <label>
                                    {t('reinsuranceManagement.create.label.national')}
                                </label>
                                <article>
                                    <div
                                        className={`position-relative has-icon-right ${requiredSelectBoxControl('nationalityCode').classNames}`}>
                                        {
                                            props.isEdit ?
                                                <InlineInput
                                                    type="select"
                                                    handleSubmit={props.onSubmit}
                                                    options={props.nationalities}
                                                    defaultValue={props.detail?.nationalityCode}
                                                    optionLabel={'name'}
                                                    optionValue="code"
                                                    register={register({
                                                        name: 'nationalityCode',
                                                        value: props.detail?.nationalityCode
                                                    })}
                                                    onChange={(e) => setValue('nationalityCode', e)}
                                                />
                                                :
                                                <Controller
                                                    render={(ctrl) => (
                                                        <SelectBox
                                                            placeholder={t('reinsuranceManagement.create.placeHolder.national')}
                                                            onChange={(e) => {
                                                                if (watch("nationalityCode") === "VN") {
                                                                    ctrl.onChange(e)
                                                                    clearErrors('taxNumber')
                                                                } else {
                                                                    ctrl.onChange(e)
                                                                }
                                                            }}
                                                            value={ctrl.value}
                                                            error={requiredSelectBoxControl('nationalityCode').isError}
                                                            errMess={requiredSelectBoxControl('nationalityCode').errorMessage}
                                                            options={props.nationalities}
                                                            optionLabel={'name'}
                                                            optionValue="code"
                                                        />
                                                    )}
                                                    name="nationalityCode"
                                                    control={control}
                                                    defaultValue={null}
                                                    rules={requiredSelectBoxControl('nationalityCode').rules}
                                                />
                                        }
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset
                                className={`form-group form-group-sm ${watch('nationalityCode') === "VN" ? `required` : null}`}>
                                <label>
                                    {t('reinsuranceManagement.create.label.taxNumber')}
                                </label>
                                <article>
                                    <div className="position-relative has-icon-right">
                                        {
                                            props.isEdit ? <InlineInput
                                                    className={requiredTextControl('taxNumber').classNames}
                                                    defaultValue={props.detail?.taxNumber}
                                                    disabled={watch("nationalityCode") === "VN"}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.taxNumber')}
                                                    handleSubmit={props.onSubmit}
                                                    name="taxNumber"
                                                    register={register()}
                                                /> :
                                                <input
                                                    className={watch('nationalityCode') === "VN" ? requiredTextControl('taxNumber').classNames : "form-control"}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.taxNumber')}
                                                    name="taxNumber"
                                                    ref={
                                                        watch('nationalityCode') === "VN" ? register(requiredTextControl('taxNumber').rules) : register()
                                                    }
                                                />
                                        }
                                        {watch('nationalityCode') === "VN" &&
                                        <InvalidFeedBack message={requiredTextControl('taxNumber').errorMessage}/>}
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm required">
                                <label>
                                    {t('reinsuranceManagement.create.label.bankName')}
                                </label>
                                <article>
                                    <div className="position-relative has-icon-right">
                                        {
                                            props.isEdit ? <InlineInput
                                                    className={requiredTextControl('bankName').classNames}
                                                    defaultValue={props.detail?.bankName}
                                                    handleSubmit={props.onSubmit}
                                                    name="bankName"
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.bankName')}
                                                    register={register(requiredTextControl('bankName').rules)}
                                                /> :
                                                <input className={requiredTextControl('bankName').classNames}
                                                       placeholder={t('reinsuranceManagement.create.placeHolder.bankName')}
                                                       name="bankName"
                                                       ref={register(requiredTextControl('bankName').rules)}
                                                />
                                        }
                                        <InvalidFeedBack message={requiredTextControl('bankName').errorMessage}/>
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm required">
                                <label>
                                    {t('reinsuranceManagement.create.label.accountNumber')}
                                </label>
                                <article>
                                    <div className="position-relative has-icon-right">
                                        {
                                            props.isEdit ? <InlineInput
                                                    className={requiredTextControl('accountNumber').classNames}
                                                    defaultValue={props.detail?.accountNumber}
                                                    handleSubmit={props.onSubmit}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.accountNumber')}
                                                    type="number"
                                                    name="accountNumber"
                                                    register={register(requiredTextControl('accountNumber').rules)}
                                                /> :
                                                <input className={requiredTextControl('accountNumber').classNames}
                                                       placeholder={t('reinsuranceManagement.create.placeHolder.accountNumber')}
                                                       name="accountNumber"
                                                       type="number"
                                                       ref={register(requiredTextControl('accountNumber').rules)}
                                                />
                                        }
                                        <InvalidFeedBack message={requiredTextControl('accountNumber').errorMessage}/>
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                    </div>
                    <div className="form-row py-0">
                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm required">
                                <label>
                                    {t('reinsuranceManagement.create.label.phone')}
                                </label>
                                <article>
                                    <div className="position-relative has-icon-right">
                                        {
                                            props.isEdit ? <InlineInput
                                                    className={requiredTextControl('phone').classNames}
                                                    handleSubmit={props.onSubmit}
                                                    defaultValue={props.detail?.phone}
                                                    name="phone"
                                                    type="number"
                                                    filter={filter.filterNumberOnly}
                                                    register={register(requiredTextControl('phone').rules)}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.phone')}
                                                /> :
                                                <input className={requiredTextControl('phone').classNames}
                                                       placeholder={t('reinsuranceManagement.create.placeHolder.phone')}
                                                       name="phone"
                                                       type="number"
                                                       ref={register(requiredTextControl('phone').rules)}
                                                />
                                        }

                                        <InvalidFeedBack message={requiredTextControl('phone').errorMessage}/>
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm">
                                <label>
                                    {t('reinsuranceManagement.create.label.fax')}
                                </label>
                                <article>
                                    <div className="position-relative has-icon-right">
                                        {
                                            props.isEdit ?
                                                <InlineInput
                                                    className={requiredTextControl('fax').classNames}
                                                    defaultValue={props.detail?.fax}
                                                    handleSubmit={props.onSubmit}
                                                    name="fax"
                                                    type="number"
                                                    filter={filter.filterNumberOnly}
                                                    register={register()}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.fax')}
                                                /> :
                                                <input
                                                    className={`form-control ${FormControl.getValidation('fax', errors).className}`}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.fax')}
                                                    name="fax"
                                                    type="number"
                                                    ref={register()}
                                                />
                                        }
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                        <div className="col-xl-6 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm required">
                                <label>
                                    {t('reinsuranceManagement.create.label.address')}
                                </label>
                                <article>
                                    <div className="position-relative has-icon-right">
                                        {
                                            props.isEdit ? <InlineInput
                                                    className={requiredTextControl('address').classNames}
                                                    defaultValue={props.detail?.address}
                                                    handleSubmit={props.onSubmit}
                                                    name="address"
                                                    register={register(requiredTextControl('address').rules)}
                                                /> :
                                                <input className={requiredTextControl('address').classNames}
                                                       placeholder={t('reinsuranceManagement.create.placeHolder.address')}
                                                       name="address"
                                                       ref={register(requiredTextControl('address').rules)}
                                                />
                                        }
                                        <InvalidFeedBack message={requiredTextControl('address').errorMessage}/>
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                    </div>
                    <div className="form-row py-0">
                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm">
                                <label>
                                    {t('reinsuranceManagement.create.label.companyParent')}
                                </label>
                                <article>
                                    <div
                                        className={`position-relative has-icon-right`}>
                                        {
                                            props.isEdit ?
                                                <InlineInput
                                                    type="select"
                                                    handleSubmit={props.onSubmit}
                                                    optionLabel="reinsuranceName"
                                                    optionValue="id"
                                                    defaultValue={props.detail?.reinsuranceParentId}
                                                    defaultLabel={props.detail?.reinsuranceParentName}
                                                    register={register({
                                                        name: 'reinsuranceParentId',
                                                        value: props.detail?.reinsuranceParentId
                                                    })}
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.companyParent')}
                                                    onChange={e => setValue('reinsuranceParentId', e)}
                                                    isAsync
                                                    loadOptions={async (e) => {
                                                        const response = await ReinsuranceHelpers.getReinsurance(e);
                                                        return response.filter(company => company.id !== props.id)
                                                    }}
                                                    isClearable
                                                    hasDefaultOption
                                                />
                                                :
                                                <Controller
                                                    render={(ctrl) => (
                                                        <SelectBox
                                                            placeholder={t('reinsuranceManagement.create.placeHolder.companyParent')}
                                                            onChange={ctrl.onChange}
                                                            value={ctrl.value}
                                                            optionLabel="reinsuranceName"
                                                            optionValue="id"
                                                            isAsync
                                                            loadOptions={ReinsuranceHelpers.getReinsurance}
                                                            isClearable
                                                        />
                                                    )}
                                                    name="reinsuranceParentId"
                                                    control={control}
                                                    defaultValue={null}
                                                />
                                        }
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm">
                                <label>
                                    {t('reinsuranceManagement.create.label.expertiseId')}
                                </label>
                                <article>
                                    <div
                                        className={`position-relative has-icon-right ${requiredSelectBoxControl('identityType').classNames}`}>
                                        {
                                            props.isEdit ?
                                                <InlineInput
                                                    type="select"
                                                    options={expertiseData.current}
                                                    handleSubmit={props.onSubmit}
                                                    defaultValue={props.detail?.expertiseId}
                                                    register={register({
                                                        name: 'expertiseId',
                                                        value: props.detail?.expertiseId
                                                    })}
                                                    isMulti
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.expertiseId')}
                                                    onChange={e => setValue('expertiseId', e)}
                                                />
                                                :
                                                <Controller
                                                    render={(ctrl) => (
                                                        <SelectBox
                                                            placeholder={t('reinsuranceManagement.create.placeHolder.expertiseId')}
                                                            onChange={ctrl.onChange}
                                                            isMulti
                                                            value={ctrl.value}
                                                            options={expertiseData.current}
                                                        />
                                                    )}
                                                    name="expertiseId"
                                                    control={control}
                                                    defaultValue={null}
                                                />
                                        }
                                    </div>
                                </article>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card card-section">
                <div className="card-header">
                    <div
                        className="form-section d-flex align-items-center">
                        <h5 className="mb-0">Hạng tín nhiệm</h5>
                        {
                            props.isEdit &&
                            <button onClick={() => {
                                setShowEditRating(true)
                            }} type="button" className="avatar avatar-sm btn-avatar ml-2"
                                    title={t('reinsuranceManagement.create.buttonUpdateRating')}>
                                <i className="fal fa-pencil"/>
                            </button>
                        }
                    </div>
                </div>
                <div className="card-body px-0">
                    {props.isEdit ?
                        <Rating listRating={listRating}/>
                        :
                        <div className="form-row pb-0">
                            <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                <fieldset className="form-group form-group-sm">
                                    <label>
                                        {t('reinsuranceManagement.create.label.agencyRate')}
                                    </label>
                                    <article>
                                        <div
                                            className={`position-relative has-icon-right ${requiredSelectBoxControl('agencyRate').classNames}`}>
                                            <Controller
                                                render={(ctrl) => (
                                                    <SelectBox
                                                        placeholder={t('reinsuranceManagement.create.placeHolder.agencyRate')}
                                                        onChange={ctrl.onChange}
                                                        value={ctrl.value}
                                                        options={props.ratingList}
                                                        optionLabel={"name"}
                                                        optionValue="code"
                                                    />
                                                )}
                                                name="lstCreditRating[0].companyId"
                                                control={control}
                                                defaultValue={null}
                                            />
                                        </div>
                                    </article>
                                </fieldset>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                <fieldset className="form-group form-group-sm">
                                    <label>
                                        {t('reinsuranceManagement.create.label.creditRating')}
                                    </label>
                                    <article>
                                        <div className="position-relative has-icon-right">
                                            <input
                                                className={requiredTextControl('reInsuranceName').classNames}
                                                placeholder={t('reinsuranceManagement.create.placeHolder.creditRating')}
                                                name="lstCreditRating[0].rating"
                                                ref={register()}
                                            />
                                            <InvalidFeedBack message={requiredTextControl('rating').errorMessage}/>
                                        </div>
                                    </article>
                                </fieldset>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                <fieldset className="form-group form-group-sm">
                                    <label>
                                        {t('reinsuranceManagement.create.label.affectDate')}
                                    </label>
                                    <article>
                                        <div
                                            className={`position-relative has-icon-right ${requiredTextControl('startAffectedDate').isError ? 'is-invalid' : ''}`}>
                                            <Controller
                                                render={(ctrl) => (
                                                    <DateTimeInput
                                                        placeholder={t('reinsuranceManagement.create.placeHolder.affectDate')}
                                                        onChange={(newValue) => {
                                                            ctrl.onChange(moment(newValue).format(DATE_FORMAT))
                                                        }}
                                                        useDateFormat
                                                        showMonthDropdown
                                                        isDefaultEmpty
                                                    />
                                                )}
                                                name="lstCreditRating[0].affectedDate"
                                                control={control}
                                                defaultValue={null}
                                            />
                                        </div>
                                    </article>
                                </fieldset>
                            </div>
                        </div>
                    }
                </div>
            </div>

            {
                props.isEdit ? <DataTableProvider>
                        <ListContact listReinsurance={props.listReinsurance} id={props.id}/>
                    </DataTableProvider>
                    :
                    <div className="card card-section">
                        <div className="card-header">
                            <div
                                className="form-section d-flex align-items-center">
                                <h5 className="mb-0">Thông tin liên lạc</h5>
                                {
                                    !props.isEdit &&
                                    <button onClick={() => {
                                        setContactList(list => {
                                            list.push(defaultContactList);
                                            return [...list]
                                        })
                                    }} type="button" className="avatar avatar-sm btn-avatar ml-2"
                                            title={`Thêm thông tin liên lạc`}>
                                        <i className="fal fa-plus-circle"/>
                                    </button>
                                }
                            </div>
                        </div>
                        <div className="card-body px-0">
                            {
                                props.isEdit ?
                                    <DataTableProvider>
                                        <ListContact listReinsurance={props.listReinsurance} id={props.id}/>
                                    </DataTableProvider>
                                    :
                                    lstContact.map((item, index) => {
                                        return (item.isRemoved ||
                                            <div key={index} className="form-row pb-0">
                                                <div className="col-xl-2 col-lg-4 col-md-6 col-6">
                                                    <fieldset className="form-group form-group-sm">
                                                        <label>
                                                            {t('reinsuranceManagement.create.label.nameContact')}
                                                        </label>
                                                        <article>
                                                            <div className="position-relative has-icon-right">
                                                                <input
                                                                    className={contactNameControl(index).classNames}
                                                                    placeholder={t('reinsuranceManagement.create.placeHolder.nameContact')}
                                                                    name={`lstContact[${index}].nameContact`}
                                                                    ref={register(contactNameControl(index).rules)}
                                                                />
                                                                <InvalidFeedBack
                                                                    message={contactNameControl(index).errorMessage}/>
                                                            </div>
                                                        </article>
                                                    </fieldset>
                                                </div>
                                                <div className="col-xl-2 col-lg-4 col-md-6 col-6">
                                                    <fieldset className="form-group form-group-sm">
                                                        <label>
                                                            {t('reinsuranceManagement.create.label.positionContact')}
                                                        </label>
                                                        <article>
                                                            <div className="position-relative has-icon-right">
                                                                <input
                                                                    className="form-control"
                                                                    placeholder={t('reinsuranceManagement.create.placeHolder.positionContact')}
                                                                    name={`lstContact[${index}].positionContact`}
                                                                    ref={register()}
                                                                />
                                                            </div>
                                                        </article>
                                                    </fieldset>
                                                </div>
                                                <div className="col-xl-2 col-lg-4 col-md-6 col-6">
                                                    <fieldset className="form-group form-group-sm">
                                                        <label>
                                                            {t('reinsuranceManagement.create.label.phoneContact')}
                                                        </label>
                                                        <article>
                                                            <div className="position-relative has-icon-right">
                                                                <input
                                                                    className={contactPhoneControl(index).classNames}
                                                                    placeholder={t('reinsuranceManagement.create.placeHolder.phoneContact')}
                                                                    name={`lstContact[${index}].phoneContact`}
                                                                    type="number"
                                                                    ref={register(contactPhoneControl(index).rules)}
                                                                />
                                                                <InvalidFeedBack
                                                                    message={contactPhoneControl(index).errorMessage}/>
                                                            </div>
                                                        </article>
                                                    </fieldset>
                                                </div>
                                                <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                    <fieldset className="form-group form-group-sm">
                                                        <label>
                                                            {t('reinsuranceManagement.create.label.emailContact')}
                                                        </label>
                                                        <article>
                                                            <div className="position-relative has-icon-right">
                                                                <input
                                                                    className={contactEmailControl(index).classNames}
                                                                    placeholder={t('reinsuranceManagement.create.placeHolder.emailContact')}
                                                                    name={`lstContact[${index}].emailContact`}
                                                                    ref={register(
                                                                        contactEmailControl(index).rules
                                                                    )}
                                                                />
                                                                <InvalidFeedBack
                                                                    message={contactEmailControl(index).errorMessage}/>
                                                            </div>
                                                        </article>
                                                    </fieldset>
                                                </div>
                                                <div className="col-xl-2 col-lg-4 col-md-6 col-6">
                                                    <fieldset className="form-group form-group-sm">
                                                        <label>
                                                            {t('reinsuranceManagement.create.label.scopeContact')}
                                                        </label>
                                                        <article>
                                                            <div className="position-relative has-icon-right">
                                                                <input
                                                                    className={requiredTextControl('reInsuranceNameVI').classNames}
                                                                    placeholder={t('reinsuranceManagement.create.placeHolder.scopeContact')}
                                                                    name={`lstContact[${index}].scopeContact`}
                                                                    ref={register()}
                                                                />

                                                            </div>
                                                        </article>
                                                    </fieldset>
                                                </div>
                                                <div className="col-xl-1 col-lg-4 col-md-6 col-xs-12 ml-1 d-flex row">
                                                    <div className="form-group form-group-sm">
                                                        <article>
                                                            <button
                                                                type="button"
                                                                title={t('common.button.clear')}
                                                                className="avatar btn-avatar "
                                                                onClick={() => {
                                                                    // isEdit ? removeSavedAllocationDepartment(item, row) :
                                                                    removeAllocationDepartment(item, index)
                                                                }}
                                                            >
                                                                <i className="fal fa-minus-circle"/>
                                                            </button>
                                                        </article>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </div>
            }


            {showEditRating && <EditRatingModal
                show={showEditRating}
                listRatingAgencies={ratingAgencies}
                onSave={updateRating}
                onClose={() => setShowEditRating(false)}
            />}
            {showEditRatingWarning && <ModalConfirmation
                show={showEditRatingWarning}
                title={t('modal.editRatingWarning.title')}
                confirmButtonLabel={t('common.button.ok')}
                content={t('modal.editRatingWarning.content')}
                showButtonCancel={false}
                onConfirm={() => setShowEditRatingWarning(false)}
                onClose={() => setShowEditRatingWarning(false)}
            />}
        </>
    )
}

GeneralInformation.propTypes = {
    isEdit: PropTypes.bool,
    nationalities: PropTypes.array,
    listReinsurance: PropTypes.object,
    ratingList: PropTypes.array,
    detail: PropTypes.object,
    id: PropTypes.string,
    onSubmit: PropTypes.func,
    companiesRating: PropTypes.array,
    reGetDetail: PropTypes.func
};

GeneralInformation.defaultProps = {
    companiesRating: PropTypes.array,
};

export default GeneralInformation
