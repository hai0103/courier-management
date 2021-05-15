import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Modal from "sharedComponents/modal";
import {FormProvider, useForm} from "react-hook-form";
import {FormControl} from "utils/common";
import FormRules from "utils/formRules";
import InvalidFeedBack from "sharedComponents/formControl/invalidFeedback";
import {isNil, isEmpty} from "lodash"

function ContactModal(props) {
    const {register, errors, handleSubmit, control, setValue, formState, setError, watch, clearErrors} = useForm();
    const {t} = useTranslation('common');
    const watchEmailContact = watch('emailContact')
    const watchPhoneContact = watch('phoneContact')

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

    const contactEmailControl = (field) => {
        const validation = FormControl.getValidation(field, errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {
            required: FormRules.required(),
            pattern: FormRules.isEmail()
        };

        if (!isEmpty(watchPhoneContact)) {
            delete rules.required
        }

        return {
            classNames,
            rules,
            ...validation
        }
    }

    const contactPhoneControl = () => {
        const validation = FormControl.getValidation(`phoneContact`, errors);
        const classNames = FormControl.getControlClassNames(validation ? [validation.className] : []);
        const rules = {
            required: FormRules.required()
        }
        return {
            classNames,
            rules,
            ...validation
        }
    }

    const save = (data) => {
        props.onConfirm(data)
    }

    return (
        <div>
            <Modal
                isOpen={props.show}
                modalName="modal-user-roles"
                onClose={() => {
                    props.onClose()
                }}
                title={props.title}
                centered
            >
                <Modal.Body>
                    {
                        <FormProvider formState={formState}
                                      register={register}
                                      errors={errors}
                                      control={control}
                                      setValue={setValue}
                                      clearErrors={clearErrors}
                                      watch={watch}
                        >
                            <form onSubmit={handleSubmit(save)}>
                                {/* Tên người liên lạc */}
                                <fieldset className="form-group form-group-sm position-relative required">
                                    <label>
                                        {t('reinsuranceManagement.create.label.nameContact')}
                                    </label>
                                    <article>
                                        <div className={'position-relative has-icon-right'}>
                                            <input
                                                className={requiredTextControl('nameContact').classNames}
                                                defaultValue={props.detail?.nameContact}
                                                placeholder={t('reinsuranceManagement.create.placeHolder.positionContact')}
                                                name={"nameContact"}
                                                ref={register(requiredTextControl('nameContact').rules)}
                                            />
                                            <InvalidFeedBack message={requiredTextControl('nameContact').errorMessage}/>
                                        </div>
                                    </article>
                                </fieldset>
                                {/* Chức vụ */}
                                <fieldset className="form-group form-group-sm position-relative">
                                    <label>
                                        {t('reinsuranceManagement.create.label.positionContact')}
                                    </label>
                                    <article className="zindex-3">
                                        <div className={'position-relative has-icon-right'}>
                                            <input
                                                className={"form-control"}
                                                defaultValue={props.detail?.positionContact}
                                                placeholder={t('reinsuranceManagement.create.placeHolder.positionContact')}
                                                name={"positionContact"}
                                                ref={register()}
                                            />
                                        </div>
                                    </article>
                                </fieldset>
                                {/* Lĩnh vực hoạt động */}
                                <fieldset className="form-group form-group-sm position-relative">
                                    <label>
                                        {t('reinsuranceManagement.create.label.scopeContact')}
                                    </label>
                                    <article>
                                        <div className={'position-relative has-icon-right'}>
                                            <input
                                                className={"form-control"}
                                                defaultValue={props.detail?.scopeContact}
                                                placeholder={t('reinsuranceManagement.create.placeHolder.scopeContact')}
                                                name={"scopeContact"}
                                                ref={register()}
                                            />
                                        </div>
                                    </article>
                                </fieldset>
                                {/* email */}
                                <fieldset className="form-group form-group-sm position-relative required">
                                    <label>
                                        {t('reinsuranceManagement.create.label.emailContact')}
                                    </label>
                                    <article>
                                        <div className={'position-relative has-icon-right'}>
                                            <input
                                                className={contactEmailControl('emailContact').classNames}
                                                defaultValue={props.detail?.emailContact}
                                                placeholder={t('reinsuranceManagement.create.placeHolder.emailContact')}
                                                name={"emailContact"}
                                                onChange={() => {
                                                    clearErrors('phoneContact')
                                                }}
                                                ref={register(isEmpty(watchPhoneContact) ? contactEmailControl('emailContact').rules : {required: false})}
                                            />
                                            <InvalidFeedBack
                                                message={contactEmailControl('emailContact').errorMessage}/>
                                        </div>
                                    </article>
                                </fieldset>
                                {/* Số điện thoại */}
                                <fieldset className="form-group form-group-sm position-relative required">
                                    <label>
                                        {t('reinsuranceManagement.create.label.phoneContact')}
                                    </label>
                                    <article>
                                        <div className={'position-relative has-icon-right'}>
                                            <input
                                                className={contactPhoneControl().classNames}
                                                defaultValue={props.detail?.phoneContact}
                                                placeholder={t('reinsuranceManagement.create.placeHolder.phoneContact')}
                                                name={"phoneContact"}
                                                type="number"
                                                onChange={() => {
                                                    clearErrors('emailContact')
                                                }}
                                                ref={register(isEmpty(watchEmailContact) ? contactPhoneControl().rules : {required: false})}
                                            />
                                            <InvalidFeedBack
                                                message={contactPhoneControl().errorMessage}/>
                                        </div>
                                    </article>
                                </fieldset>
                            </form>
                        </FormProvider>
                    }
                </Modal.Body>

                <Modal.Footer>
                    <button type="button" className="btn btn-outline-secondary mr-25"
                            onClick={() => {
                                props.onClose()
                                clearErrors()
                            }}>
                        <span
                            className="d-none d-sm-block">{t('common.button.cancel')}</span>
                    </button>
                    <button
                        // disabled
                        type="submit" className="btn btn-primary btn-min-width"
                        onClick={handleSubmit(save)}
                    >
                        <span
                            className="d-none d-sm-block">
                            {props.labelBtn}
                        </span>
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

ContactModal.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    labelBtn: PropTypes.string,
    onConfirm: PropTypes.func,
    detail: PropTypes.object
};

ContactModal.defaultProps = {
    show: false,
    detail: {},
};

export default ContactModal
