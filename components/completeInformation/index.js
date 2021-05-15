import React, {useEffect, useState} from "react";
import {Response} from "utils/common";
import {useTranslation} from "react-i18next";
import {UserApi} from "services/user";
import Router from 'next/router'
import {useToasts} from "react-toast-notifications";
import Alert from "sharedComponents/alert";
import PasswordBlock from "sharedComponents/PasswordBlock";
import {AUTH_LOGIN_SERVICE_URI} from "globalConstants/serviceUri";
import PropTypes from "prop-types";
import {IMAGES} from "constants/common";
import Spinner from "sharedComponents/spinner";

function CompleteInformation(props) {
    const {t} = useTranslation('common');
    const {addToast} = useToasts();
    const [verifyCode, setVerifyCode] = useState(null);
    const [isPasswordSubmit, setIsPasswordSubmit] = useState(false);
    const [formState, setFormState] = useState({});
    const [loading, setLoading] = useState(true);

    const onChangePassword = (data, setError) => {
        async function activeUser() {
            let body = {
                id: props.userId,
                request: {
                    password: data.password,
                    verifyPassword: data.verifyPassword,
                }
            }
            try {
                const response = await UserApi.activeUser(body);
                return response.data;
            } catch (error) {
                console.log(error);
            }
        }

        activeUser().then((res) => {
            if (res.Success) {
                addToast(t('completeInformation.activeSuccess'), {appearance: 'success'});

                setTimeout(() => {
                    Router.push(AUTH_LOGIN_SERVICE_URI)
                }, 1000)

            }
        }).catch((e) => {
            console.log(e);
        });
    }
    useEffect(() => {
        async function validateActiveCode() {
            try {
                const response = await UserApi.validateActiveUserCode(props.userId);
                if (Response.getData(response)?.Data) {
                    setVerifyCode(true);
                } else {
                    setVerifyCode(false)
                }
            } catch (error) {
                setVerifyCode(false);
            }
        }

        validateActiveCode().then(() => {
            setLoading(false)
        }).catch(e => console.log(e));
    }, []);

    return (
        <section className="row flexbox-container">
            <div className="col-12 d-flex align-items-center justify-content-center">
                <div className="col-xl-4 col-lg-5 col-md-7 col-10 box-shadow-2 p-0">
                    <div className="card border-grey border-lighten-3 m-0">
                        <div className="card-header pb-0 border-0">
                            <div className="card-title text-center">
                                <img src={IMAGES.LOGO} alt="logo" width='60%'/>
                            </div>
                            <h3 className="card-subtitle line-on-side text-muted text-center m-2 pt-1">
                                <span>{t('completeInformation.title')}</span>
                            </h3>
                        </div>
                        <div className="card-content pt-0 pb-2">
                            <div className="card-body py-1">
                                {
                                    !verifyCode ?
                                        <Spinner loading={loading}>
                                            <Alert dismissible={false} content={t('verifyAccount.expireLink')}
                                                   bg="danger">
                                            </Alert>
                                        </Spinner>
                                        :
                                        <div>
                                            <div className="d-flex align-items-center mb-1">
                                                <h6 className="text-transform-none">{t('verifyAccount.setPassFor')}
                                                <b className="pl-50 text-lowercase">{props.email}</b></h6>
                                            </div>

                                            <PasswordBlock hasCurrentPassword={false}
                                                           isSubmit={isPasswordSubmit}
                                                           setIsSubmit={setIsPasswordSubmit}
                                                           placeholderNewPass={t('passwordBlock.placeholder.passwordNew')}
                                                           placeholderVerifyPass={t('passwordBlock.placeholder.verifyPasswordNew')}
                                                           onSave={onChangePassword}
                                                           setFormState={setFormState}
                                            />
                                            <div className="pt-1">
                                                <button disabled={!formState?.isValid} type="submit"
                                                        className="btn btn-primary btn-block"
                                                        onClick={() => {
                                                            setIsPasswordSubmit(true)
                                                        }}
                                                >
                                                    {t('verifyAccount.update')}
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

CompleteInformation.propTypes = {
    userId: PropTypes.string,
    email: PropTypes.string
};

CompleteInformation.defaultProps = {};

export default CompleteInformation;
