import React, {useState} from "react";
import Head from "next/head";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";

import {FormControl} from "utils/common";
import FormRules from "utils/formRules";

function Profile() {
    const {register, errors, handleSubmit, clearErrors} = useForm();
    const {t} = useTranslation('common');
    const [edit, setEdit] = useState(false);
    const [gender1, setGender1] = useState('Male');
    const [gender2, setGender2] = useState('Female');
    const [startDate, setStartDate] = useState(new Date());

    const onSubmit = (data) => {
        console.log(data);
    };
    console.log(errors);

    const usernameControl = () => {
        const validation = FormControl.getValidation('name', errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {
            minLength: FormRules.minLength(6),
            required: FormRules.required(),
        };

        return {
            classNames,
            rules,
            ...validation
        }
    }

    const phoneControl = () => {
        const validation = FormControl.getValidation('Phone', errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {
            minLength: FormRules.maxLength(11),
            required: FormRules.required(),
            pattern: FormRules.isNumber(),
        };

        return {
            classNames,
            rules,
            ...validation
        }
    }

    const ICControl = () => {
        const validation = FormControl.getValidation('identityCard', errors);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        const rules = {
            minLength: FormRules.maxLength(12),
            required: FormRules.required(),
            pattern: FormRules.isNumber(),
        };

        return {
            classNames,
            rules,
            ...validation
        }
    }

    const licensePlaceControl = () => {
        const validation = FormControl.getValidation('licensePlace', errors);
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
    }

    const AddressControl = () => {
        const validation = FormControl.getValidation('address', errors);
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
    }

    const dobControl = () => {
        const validation = FormControl.getValidation('DOB', errors);
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

    const licenseDateControl = () => {
        const validation = FormControl.getValidation('date', errors);
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

    const emailControl = () => {
        const validation = FormControl.getValidation('email', errors);
        console.log(validation);
        const classNames = FormControl.getControlClassNames([
            'form-control',
            validation.className
        ]);
        // console.log(classNames)
        const rules = {
            required: FormRules.required(),
            pattern: FormRules.isEmail(),
            // validate: (value) => { return !!value.trim()}
        };
        // console.log(rules)
        return {
            classNames,
            rules,
            ...validation
        }
    }

    return (
        <React.Fragment>
            <Head>
                <title>profile page</title>
            </Head>
            <section id="striped-row-form-layouts">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-no-border">
                            <div className="card-content collpase show">
                                <div className="card-body">

                                    <form className="form form-horizontal striped-rows form-bordered" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="form-body">
                                            <h4 className="form-section">
                                                <i className="fal fa-user"/>
                                                {t('profile.title1')}
                                            </h4>
                                            <div className="form-group row">
                                                <label className="col-md-3 label-control">
                                                    {t('profile.name')}
                                                </label>
                                                <div className="col-md-6">
                                                    <input id="inputName" readOnly={!edit} className={usernameControl().classNames} placeholder={t('profile.name')} name="name"
                                                        ref={register(usernameControl().rules)}
                                                    />
                                                    <div className="invalid-feedback">
                                                        {usernameControl().errorMessage}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-3 label-control">
                                                    {t('profile.phone')}
                                                </label>
                                                <div className="col-md-6 controls">
                                                    <input type="text"
                                                        id="inputPhone" readOnly={!edit} className={phoneControl().classNames} placeholder={t('profile.phone')} name="Phone"
                                                        ref={register(phoneControl().rules)}
                                                    />
                                                    <div className="invalid-feedback">
                                                        {phoneControl().errorMessage}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-3 label-control">
                                                    {t('profile.email')}
                                                </label>
                                                <div className="col-md-6 controls">
                                                    <input type="email" id="email" readOnly={!edit} className={emailControl().classNames} placeholder={t('profile.email')} name="email"
                                                        ref={register(emailControl().rules)}
                                                    />
                                                    <div className="invalid-feedback">
                                                        {emailControl().errorMessage}
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-3 label-control">
                                                    {t('profile.address')}
                                                </label>
                                                <div className="col-md-6">
                                                    <input type="text" id="inputAdd" readOnly={!edit} className={AddressControl().classNames} placeholder={t('profile.address')} name="address"
                                                        ref={register(AddressControl().rules)}
                                                    />
                                                    <div className="invalid-feedback">
                                                        {AddressControl().errorMessage}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-3 label-control">
                                                    {t('profile.DOB')}
                                                </label>
                                                <div className="col-md-6">
                                                    <input type="date" id="inputDOB" readOnly={!edit} className={dobControl().classNames} name="DOB"
                                                        ref={register(dobControl().rules)}
                                                    />
                                                    <div className="invalid-feedback">
                                                        {dobControl().errorMessage}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-3 label-control">
                                                    {t('profile.gender')}
                                                </label>
                                                <div className="col-md-6">
                                                    <div className='input-group'>
                                                        <div className="d-inline-block custom-control custom-radio mr-1">
                                                            <input type="radio" id="male" value={gender1} readOnly={!edit} className="custom-control-input" checked={gender1 === "Male"} name='gender'
                                                                ref={register}
                                                            />
                                                            <label className="custom-control-label" htmlFor="Male">{t('profile.gen-1')}</label>
                                                        </div>
                                                        <div className="d-inline-block custom-control custom-radio mr-1">
                                                            <input type="radio" id="female" value={gender2} readOnly={!edit} className="custom-control-input" checked={gender2 === "Male"} name="gender"
                                                                ref={register({
                                                                    required: true
                                                                })}
                                                            />
                                                            <label className="custom-control-label" htmlFor="female">{t('profile.gen-2')}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <h4 className="form-section">
                                                <i className="fa fa-paperclip"></i>
                                                {t('profile.title2')}
                                            </h4>
                                            <div className="form-group row">
                                                <label className="col-md-3 label-control">
                                                    {t('profile.IC')}
                                                </label>
                                                <div className="col-md-6">
                                                    <input type="text" id="inputIC" readOnly={!edit} className={ICControl().classNames} placeholder={t('profile.IC')} name="identityCard"
                                                        ref={register(ICControl().rules)}
                                                    />
                                                    <div className="invalid-feedback">
                                                        {ICControl().errorMessage}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-3 label-control">
                                                    {t('profile.licensePlace')}
                                                </label>
                                                <div className="col-md-6">
                                                    <input type="text" id="inputPlace" readOnly={!edit} className={licensePlaceControl().classNames} placeholder={t('profile.licensePlace')} name="licensePlace"
                                                        ref={register(licensePlaceControl().rules)}
                                                    />

                                                    <div className="invalid-feedback">
                                                        {licensePlaceControl().errorMessage}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-3 label-control">
                                                    {t('profile.licenseDate')}
                                                </label>
                                                <div className="col-md-6">
                                                    <input type="date" id="inputDate" readOnly={!edit} className={licenseDateControl().classNames} name="date"
                                                        ref={register(licenseDateControl().rules)}
                                                    />
                                                    <div className="invalid-feedback">
                                                        {licenseDateControl().errorMessage}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-md-3 label-control">
                                                    {t('profile.address')}
                                                </label>
                                                <div className="col-md-6">
                                                    <input type="text" id="inputAdd2" readOnly={!edit} className={licensePlaceControl().classNames} placeholder={t('profile.address')} name="address2"
                                                        ref={register(licensePlaceControl().rules)}
                                                    />
                                                    <div className="invalid-feedback">
                                                        {ICControl().errorMessage}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {!edit ?
                                            <div className='col-md-12 d-flex justify-content-center align-content-center pt-2'>
                                                <div className='col-md-6 d-flex justify-content-end pl-2 pr-2'>
                                                    <button type="button" className="bg-white rounded btn w-80 btn-primary"
                                                        onClick={() => {
                                                            setEdit(true)
                                                        }}
                                                    >
                                                        <span className="d-none d-sm-block ml-3 mr-3">{t('profile.changeInfo')}</span>
                                                    </button>
                                                </div>
                                                <div className='col-md-6 d-flex pl-2 pr-2'>
                                                    <button type="button" className="bg-white rounded w-90 btn btn-primary" data-toggle="modal" data-target="#change-password">

                                                        <span className="d-none d-sm-block ml-2 mr-2">{t('profile.changePass')}</span>
                                                    </button>
                                                </div>
                                            </div> :
                                            <div className='col-md-12 d-flex justify-content-center align-content-center pt-2'>
                                                <div className='col-md-6 d-flex justify-content-end pl-2 pr-2'>
                                                    <button type="button" className="bg-white rounded btn w-80 btn-secondary"
                                                        onClick={() => {
                                                            setEdit(false);
                                                            clearErrors()
                                                        }}
                                                    >
                                                        <span className="d-none d-sm-block ml-3 mr-3">{t('profile.cancel')}</span>
                                                    </button>
                                                </div>
                                                <div className='col-md-6 d-flex pl-2 pr-2'>
                                                    <button type="submit" className="bg-white rounded  btn btn-primary">
                                            <span className="d-none d-sm-block ml-3 mr-3">
                                                {t('profile.confirm')}
                                            </span>
                                                    </button>
                                                </div>
                                            </div>
                                        }


                                    </form>

                                    {/*<Tooltip html={true}*/}
                                    {/*         positions={"top"}*/}
                                    {/*         trigger={"hover"}*/}
                                    {/*         // method={}*/}
                                    {/*         type={"button"}*/}
                                    {/*         className="col-md-1 font-large-1 d-flex p-5 align-content-center"*/}
                                    {/*         content={"<html>\n" +*/}
                                    {/*         "<body>\n" +*/}
                                    {/*         "\n" +*/}
                                    {/*         "<h1>This is heading 1</h1>\n" +*/}
                                    {/*         "<h2>This is heading 2</h2>\n" +*/}
                                    {/*         "<h3>This is heading 3</h3>\n" +*/}
                                    {/*         "<h4>This is heading 4</h4>\n" +*/}
                                    {/*         "<h5>This is heading 5</h5>\n" +*/}
                                    {/*         "<h6>This is heading 6</h6>\n" +*/}
                                    {/*         "\n" +*/}
                                    {/*         "</body>\n" +*/}
                                    {/*         "</html>"}*/}
                                    {/*         title={'Test'}*/}
                                    {/*/>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}

export default Profile;
