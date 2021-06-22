import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";
import {FormControl} from "utils/common";
import FormRules from "utils/formRules";
import {useTranslation} from "react-i18next";
import {trans} from "utils/helpers";

function PasswordBlock(props) {
    const {t} = useTranslation('common');
    const {register, errors, handleSubmit, setError, watch, formState} = useForm({
        mode: 'onChange'
    });
    const password = watch('password', true);
    const [passwordRules, setPasswordRules] = useState([
        {
            rule: new RegExp(/^.{6,}$/),
            title: 'passwordBlock.atLeastCharacter',
            status: false
        },
        {
            rule: new RegExp(/(?=.*[a-z])(?=.*[A-Z])/),
            title: 'passwordBlock.lowerCaseAndUpperCase',
            status: false
        },
        {
            rule: new RegExp(/(?=.*[+_!"'@#$%^&*(){}[\]<>?\\/|-])/),
            title: 'passwordBlock.atLeastSpecialCharacter',
            status: false
        },
    ])

    const passwordError = () => {
        setError('password', {
            type: 'validate',
            message: t('passwordBlock.invalidPassword')
        })
    }

    const save = (data) => {
        // if (!isValidPassword()) {
        //     passwordError()
        //     return false
        // }

        if (props.onSave) {
            props.onSave(data, setError)
        } else {
            console.error('Can not identify onSave')
        }
    }

    const validate = (pwd) => {
        let isUpdatedStatus = false;
        passwordRules.forEach(item => {
            const isValid = item.rule.test(pwd)
            if (item.status !== isValid) {
                item.status = isValid;
                isUpdatedStatus = true;
            }
        })

        if (isUpdatedStatus) {
            setPasswordRules([...passwordRules])
        }
    }

    validate(password);

    const onError = () => {
        if (!isValidPassword()) {
            passwordError()
        }
    }

    useEffect(() => {
        if (props.isSubmit) {
            handleSubmit(save, onError)()
            props.setIsSubmit(false)
        }
    }, [props.isSubmit])

    useEffect(() => {
        if (props.setFormState) {
            props.setFormState(formState)
        }
    }, [formState.isValid])

    const isValidPassword = () => {
        let validCount = 0
        passwordRules.forEach(item => {
            if (item.status) {
                validCount++
            }
        })

        return passwordRules.length === validCount
    }

    const passwordControl = () => {
        const validation = FormControl.getValidation('password', errors);
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

    const currentPasswordControl = () => {
        const validation = FormControl.getValidation('oldPassword', errors);
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

    const confirmPasswordControl = () => {
        const validation = FormControl.getValidation('verifyPassword', errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {
            required: FormRules.required(),
            validate: (value) => value === watch('password') || t('passwordBlock.invalidConfirmPassword')
        };
        return {
            classNames,
            rules,
            ...validation
        }
    };

    return (
        <>
            {/*<article className="mb-1">*/}
            {/*    <h6 className="spacing text-transform-none">Mật khẩu bao gồm:</h6>*/}
            {/*    <ul className="list-group list-group-sm list-group-flush pl-50">*/}
            {/*        {*/}
            {/*            passwordRules.map((item, i) => {*/}
            {/*                return <li className="list-group-item" key={i}>*/}
            {/*                    {*/}
            {/*                        item.status ? <i className="fal fa-check-circle text-success align-middle"/> :*/}
            {/*                            <i className="fal fa-circle align-middle"/>*/}
            {/*                    }*/}
            {/*                    <span className={item.status ? 'text-success' : ''}*/}
            {/*                          title={t(item.title)}>{t(item.title)}</span>*/}
            {/*                </li>*/}
            {/*            })*/}
            {/*        }*/}
            {/*    </ul>*/}
            {/*</article>*/}
            <form autoComplete="off">
                {
                    props.hasCurrentPassword && <fieldset className="form-group form-group-sm">
                        <article>
                            <label>Mật khẩu hiện tại</label>
                            <div className="position-relative has-icon-right">
                                <input id="oldPassword"
                                       placeholder={props.placeholderOldPass}
                                       name="oldPassword"
                                       type="password"
                                       ref={register(currentPasswordControl().rules)}
                                       className={currentPasswordControl().classNames}
                                />
                                <div className="form-control-position"><i className="far fa-exclamation-triangle"/>
                                </div>
                                <div className="invalid-feedback">{currentPasswordControl().errorMessage}</div>
                            </div>
                        </article>
                    </fieldset>
                }
                <fieldset className="form-group form-group-sm">
                    <label>Mật khẩu mới</label>
                    <article>
                        <div className="position-relative has-icon-right">
                            <input id="password" className={passwordControl().classNames}
                                   placeholder={props.placeholderNewPass}
                                   name="password"
                                   type="password"
                                   autoComplete="off"
                                   ref={register(passwordControl().rules)}
                            />
                            <div className="form-control-position"><i className="far fa-exclamation-triangle"/></div>
                            <div className="invalid-feedback">{passwordControl().errorMessage}</div>
                        </div>
                    </article>
                </fieldset>
                <fieldset className="form-group form-group-sm">
                    <label>Xác nhận mật khẩu mới</label>
                    <article>
                        <div className="position-relative has-icon-right">
                            <input id="verifyPassword"
                                   className={confirmPasswordControl().classNames}
                                   placeholder={props.placeholderVerifyPass}
                                   name="verifyPassword"
                                   type="password"
                                   ref={register(confirmPasswordControl().rules)}
                            />
                            <div className="form-control-position"><i className="far fa-exclamation-triangle"/></div>
                            <div className="invalid-feedback">{confirmPasswordControl().errorMessage}</div>
                        </div>
                    </article>
                </fieldset>
            </form>
        </>
    );
}

PasswordBlock.propTypes = {
    placeholderOldPass: PropTypes.string,
    placeholderNewPass: PropTypes.string,
    placeholderVerifyPass: PropTypes.string,
    hasCurrentPassword: PropTypes.bool,
    onSave: PropTypes.func,
    onClose: PropTypes.func,
    isSubmit: PropTypes.bool,
    setIsSubmit: PropTypes.func,
    setFormState: PropTypes.func
};
PasswordBlock.defaultProps = {
    hasCurrentPassword: false,
    isSubmit: false,
    placeholderOldPass: trans('passwordBlock.placeholder.oldPassword'),
    placeholderNewPass: trans('passwordBlock.placeholder.password'),
    placeholderVerifyPass: trans('passwordBlock.placeholder.verifyPassword')
};

export default PasswordBlock
