import withoutAuth from 'hocs/withoutAuth';
import Link from 'next/link';
import {useAuth} from "providers/auth";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {FormControl, Response} from "utils/common";
import {API_HOST, IMAGES, ROUTES} from "constants/common";
import Authentication from "services/authentication";
import Alert from "sharedComponents/alert";
import {request} from "utils/axios";
import {useToasts} from "react-toast-notifications";

const Login = () => {
    const {register, errors, handleSubmit} = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const {t} = useTranslation('common');
    const {setAuthenticated} = useAuth();

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const response = await Authentication.login(data);
            if (Response.isSuccess(response)) {
                setAuthenticated(true);
            } else {
                setLoginError(Response.getAPIError(response));
            }
        } catch (error) {
            if (error.response && error.response.data) {
                //@todo need refactor that
                if (error.response.data.error_description === 'User is disabled') {
                    setLoginError(t('login.loginBlocked'));
                    return false;
                }
            }
            setLoginError(t('login.loginFailure'));
        }

        setIsLoading(false);
    }

    const usernameControl = () => {
        const validation = FormControl.getValidation('username', errors);
        const classNames = FormControl.getControlClassNames([validation.className]);

        return {
            classNames,
            ...validation
        }
    }

    const passwordControl = () => {
        const validation = FormControl.getValidation('password', errors);
        const classNames = FormControl.getControlClassNames([validation.className]);

        return {
            classNames,
            ...validation
        }
    }

    return (
        <section className="row flexbox-container">
            <div className="col-12 d-flex align-items-center justify-content-center">
                <div className="col-lg-4 col-md-8 col-10 box-shadow-2 p-0">
                    <div className="card border-grey border-lighten-3 px-1 py-1 m-0">
                        <div className="card-header border-0">
                            <div className="card-title text-center">
                                <img src={IMAGES.LOGO} width={200}
                                    alt="branding logo"/>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <Alert bg="danger" content={loginError} dismissible={false}/>
                                <form className="form-horizontal" onSubmit={handleSubmit(onSubmit)}>
                                    <fieldset className="form-group position-relative has-icon-left">
                                        <input type="text" id="user-name" name="username"
                                            className={usernameControl().classNames}
                                            placeholder={t('login.usernamePlaceholder')} ref={register({
                                            required: true
                                        })}/>
                                        <div className="form-control-position">
                                            <i className="fal fa-user"></i>
                                        </div>
                                        <div className="invalid-feedback">
                                            {t('inputRequired')}
                                        </div>
                                    </fieldset>
                                    <fieldset className="form-group position-relative has-icon-left">
                                        <input type="password" className={passwordControl().classNames} id="user-password"
                                            name="password"
                                            placeholder={t('login.passwordPlaceholder')} ref={register({required: true})}/>
                                        <div className="form-control-position">
                                            <i className="fal fa-key"/>
                                        </div>
                                        <div className="invalid-feedback">
                                            {t('inputRequired')}
                                        </div>
                                    </fieldset>
                                    <div className="form-group row">
                                        <div className="col-sm-6 col-12 text-center text-sm-left pr-0">
                                            <fieldset className="custom-control custom-checkbox">
                                                <input type="checkbox" id="remember-me" data-toggle="collapse"
                                                       data-target="#collapse_checkbox_login"
                                                    className="chk-remember custom-control-input" name="rememberMe"
                                                       ref={register}/>
                                                <label className="custom-control-label" htmlFor="remember-me">
                                                    <span>{t('login.rememberMe')}</span>
                                                </label>
                                            </fieldset>
                                        </div>
                                        <div
                                            className="col-sm-6 col-12 float-sm-left text-center text-sm-right">
                                            <Link href={ROUTES.FORGOT_PASSWORD}>
                                                <a className="card-link text-capitalize">
                                                    {t('login.forgotPassword')}?
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                    <button disabled={isLoading} type="submit" className="btn btn-primary btn-block">
                                        {t('login.login')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default withoutAuth(Login);
