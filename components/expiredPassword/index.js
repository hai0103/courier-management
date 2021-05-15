import React, {useState} from "react";
import {IMAGES} from "../../constants/common";
import {Response} from "utils/common";
import {useTranslation} from "react-i18next";
import {UserApi} from "services/user";
import {useToasts} from "react-toast-notifications";
import Alert from "sharedComponents/alert";
import PasswordBlock from "sharedComponents/PasswordBlock";
import Authentication from "services/authentication";
import {AUTH_LOGIN_SERVICE_URI} from "globalConstants/serviceUri";
import Router from "next/router";
import {getUserProfile} from "utils/localStorage";

function ExpiredPassword(props) {
    const {t} = useTranslation('common');
    const { addToast } = useToasts();
    const [isPasswordSubmit, setIsPasswordSubmit] = useState(false);
    const [formState, setFormState] = useState({});
    const [callOutMessage, setCallOutMessage] = useState(t('recoveryPassword.description'));

    const onSubmit = async (payload) => {
        try {
            const userName = getUserProfile()?.userName

            const response = await UserApi.changePassword(userName, payload);
            if (Response.isSuccessAPI(response)) {
                addToast(t('common.message.changePasswordSuccess'), {appearance: 'success'});
                Authentication.removeAuthentication()
                setTimeout(() => {
                    Router.push(AUTH_LOGIN_SERVICE_URI)
                }, 1000)
            } else {
                setCallOutMessage(Response.getAPIError(response))
            }
        } catch (error) {
            setCallOutMessage(Response.getErrorMessage(error))
        }
    }

    return (
        <section className="row flexbox-container">
            <div className="col-12 d-flex align-items-center justify-content-center">
                <div className="col-lg-4 col-md-8 col-10 box-shadow-2 p-0">
                    <div className="card border-grey border-lighten-3 px-2 py-2 m-0">
                        <div className="card-header border-0" style={{height: '130px'}}>
                            <div className="card-title text-center">
                                <img src={IMAGES.LOGO} alt="logo"
                                     width={200}/>
                            </div>
                            <h2 className="card-subtitle line-on-side text-muted text-center pt-2">
                                <span>{t('recoveryPassword.titleExpirePass')}</span></h2>
                        </div>
                        <div className="card-content">
                            <div className="card-body px-0">
                                <Alert bg="danger" classes="pl-1 mb-3 pr-0" content={callOutMessage} dismissible={false}/>

                                <PasswordBlock hasCurrentPassword={true}
                                               isSubmit={isPasswordSubmit}
                                               setIsSubmit={setIsPasswordSubmit}
                                               onSave={onSubmit}
                                               setFormState={setFormState}
                                />
                                <button disabled={!formState?.isValid} type="button" className="btn btn-outline-primary btn-block"
                                    onClick={() => setIsPasswordSubmit(true)}
                                >
                                    <i className="feather icon-save"/> {t('common.button.changePassword')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

ExpiredPassword.propTypes = {};

ExpiredPassword.defaultProps = {};

export default ExpiredPassword;
