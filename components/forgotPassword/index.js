import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {API_HOST, IMAGES, ROUTES} from "constants/common";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {FormControl, Response} from "utils/common";
import FormRules from "utils/formRules";
import Alert from "sharedComponents/alert";
import {useToasts} from "react-toast-notifications";
import {request} from "utils/axios";

export default function ForgotPassword() {
    const {t} = useTranslation('common');
    const {register, errors, handleSubmit, formState} = useForm({
        mode: "onChange"
    });
    const {addToast} = useToasts();
    const [isSent, setIsSent] = useState(false);
    const [errUserName, setErr] = useState(false);

    const onSubmit = async (data) => {
        const payload = {
            userNameOrEmail: data.email
        }

        try {
            const response = await request(
                'POST',
                `${API_HOST}auth-command/user/forgot-password`,
                payload
            );
            if (Response.isSuccessAPI(response)) {
                setIsSent(true);
            } else {
                addToast(Response.getAPIError(response), {appearance: 'error'});
            }
        } catch (error) {
            if (error.response.data?.errorCode === 'AUTH.USER_NAME_OR_EMAIL_NOT_FOUND') {
                setErr(true);
            } else {
                addToast(Response.getErrorMessage(error), {appearance: 'error'});
            }
        }

    }

    const emailControl = () => {
        const validation = FormControl.getValidation('email', errors);
        const classNames = FormControl.getControlClassNames([
            validation.className
        ]);
        const rules = {
            required: FormRules.required(),
            // pattern: FormRules.isEmail()
        };

        return {
            classNames,
            rules,
            ...validation
        }
    }

    return (
        <React.Fragment>
            <section className="row flexbox-container">
                <div className="col-12 d-flex align-items-center justify-content-center">
                    <div className="col-xl-4 col-lg-5 col-md-7 col-10 box-shadow-2 p-0">
                        <div className="card border-grey border-lighten-3 m-0">
                            <div className="card-header pb-0 border-0">
                                <div className="card-title text-center">
                                    <img src={IMAGES.LOGO} width='60%' alt="branding logo"/>
                                </div>
                            </div>
                            <div className="card-content pt-50">
                                <div className="card-body">
                                    {
                                        isSent ? <Alert dismissible={false}
                                                        content="Yêu cầu đặt lại mật khẩu đã được gửi tới email của bạn. Vui lòng làm theo hướng dẫn trong email bạn nhận được. Trân trọng!"
                                                        bg="success">
                                            </Alert>
                                            : <>
                                            <form className="form-horizontal" onSubmit={handleSubmit(onSubmit)}
                                                    noValidate>
                                                <fieldset
                                                    className="form-group position-relative has-icon-left has-icon-right">
                                                    <input type="email"
                                                           className={errUserName ? 'form-control is-invalid' : emailControl().classNames}
                                                           id="user-email"
                                                           placeholder={t('forgotPassword.enterEmailAndUsername')}
                                                           name="email"
                                                           onChange={() => setErr(false)}
                                                           ref={register(emailControl().rules)}
                                                           autoComplete="off"
                                                    />
                                                    <div className="form-control-position"><i className="fal fa-envelope "/>
                                                    </div>
                                                    <div className="form-control-position" style={{right: 0}}><i
                                                        className="far fa-exclamation-triangle"/></div>
                                                    <div className="invalid-feedback">
                                                        {errUserName ? t('forgotPassword.errUserName') : emailControl().errorMessage}
                                                    </div>
                                                </fieldset>
                                                <button disabled={!formState.isValid} type="submit"
                                                        className="btn btn-primary btn-block">
                                                    {t('forgotPassword.recoverPass')}
                                                </button>
                                            </form>
                                                <div className="mt-1">
                                                    <Link href={ROUTES.LOGIN}>
                                                        <a>
                                                            {t('forgotPassword.login')}
                                                        </a>
                                                    </Link>
                                                </div>
                                            </>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
}
