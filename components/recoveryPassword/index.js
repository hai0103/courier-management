import React, {useEffect, useState} from "react";
import {Response} from "utils/common";
import {useTranslation} from "react-i18next";
import {UserApi} from "services/user";
import {useToasts} from "react-toast-notifications";
import Alert from "sharedComponents/alert";
import Router from "next/router";
import PropTypes from "prop-types";
import {IMAGES} from "../../constants/common";
import PasswordBlock from "sharedComponents/PasswordBlock";
import {AUTH_LOGIN_SERVICE_URI} from "globalConstants/serviceUri";
import Spinner from "sharedComponents/spinner";

function RecoveryPassword(props) {
    const {t} = useTranslation('common');
    const { addToast } = useToasts();
    const [tokenIsValid, setStateToken] = useState(false);
    const [isPasswordSubmit, setIsPasswordSubmit] = useState(false);
    const [callOutMessage, setCallOutMessage] = useState(null);
    const [formState, setFormState] = useState({});
    const [loading, setLoading] = useState(true);
    const onChangePassword =  async (data, setError) => {
        const payload = {
            newPassword: data.password,
            confirmPassword: data.verifyPassword,
            token: props.token
        };

        try {
            const response = await UserApi.resetPassword(payload);

            if (Response.isSuccessAPI(response)) {
                addToast(t('forgotPassword.success'), {appearance: 'success'});
                setTimeout(() => {
                    Router.push(AUTH_LOGIN_SERVICE_URI)
                }, 1000)
            } else {
                setCallOutMessage(Response.getErrorMessage(response))
                // addToast(Response.getAPIError(response), {appearance: 'error'});
            }
        } catch (error) {
            setCallOutMessage(Response.getErrorMessage(error))
            // addToast(Response.getErrorMessage(error), {appearance: 'error'});
        }
    }

    useEffect(() => {
        async function activeUser() {
            try {
                const response = await UserApi.validateResetPassCode(props.token);
                if (Response.getData(response).Data){
                    setStateToken(true)
                } else {
                    setStateToken(false)
                }
            } catch (error) {
                setStateToken(false)
                console.log(error);
            }
        }
        activeUser().then(() => setLoading(false)).catch((e) => {console.log(e);});
    }, []);


    return (
        <section className="row flexbox-container">
            <div className="col-12 d-flex align-items-center justify-content-center">
                <div className="col-xl-4 col-lg-5 col-md-7 col-10 box-shadow-2 p-0">
                    <div className="card border-grey border-lighten-3 m-0">
                        <div className="card-header pb-0 border-0">
                            <div className="card-title text-center">
                                <img src={IMAGES.LOGO} width='60%' alt="branding logo"/>
                            </div>
                            <h3 className="card-subtitle line-on-side text-muted text-center m-2 pt-1">
                                <span>{t('verifyAccount.titleResetPass')}</span>
                            </h3>
                        </div>
                        <div className="card-content pt-0 pb-2">
                            <div className="card-body pt-1 pb-50">
                                {
                                    !tokenIsValid ?
                                        <Spinner loading={loading}>
                                            <Alert dismissible={false} content={t('verifyAccount.expireRequest')} bg="danger"/>
                                        </Spinner>

                                        :
                                        <div>
                                            <div className="d-flex align-items-center mb-2">
                                                <h6 className='mb-0 text-transform-none'>{t('verifyAccount.setPassFor')}
                                                <b className="pl-50 text-transform-none">{props.email}</b></h6>
                                            </div>
                                            <Alert classes="pl-1 mb-2 pr-0" bg="danger" content={callOutMessage} dismissible={false}/>
                                            <PasswordBlock hasCurrentPassword={false}
                                                           isSubmit={isPasswordSubmit}
                                                           setIsSubmit={setIsPasswordSubmit}
                                                           setFormState={setFormState}
                                                           onSave={onChangePassword}
                                            />
                                            <div className="py-1">
                                                <button disabled={!formState?.isValid} type="submit" className="btn btn-primary btn-block"
                                                        onClick={() => {
                                                            setIsPasswordSubmit(true)
                                                        }}
                                                >
                                                    {t('verifyAccount.confirm')}
                                                </button>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

RecoveryPassword.propTypes = {
    email: PropTypes.string,
    token: PropTypes.string
};
RecoveryPassword.defaultProps = {};

export default RecoveryPassword
