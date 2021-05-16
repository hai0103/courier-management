import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Modal from "sharedComponents/modal";
import PropTypes from "prop-types";
import PasswordBlock from "sharedComponents/PasswordBlock";
import {UserApi} from "services/user";
import {getUserProfile} from "utils/localStorage";
import {Response} from "utils/common";
import {useToasts} from "react-toast-notifications";
import Alert from "sharedComponents/alert";

function ChangePassword(props) {
    const {t} = useTranslation('common');
    const [isPasswordSubmit, setIsPasswordSubmit] = useState(false);
    const {addToast} = useToasts();
    const [callOutMessage, setCallOutMessage] = useState(null);
    const [formState, setFormState] = useState({});

    const onChangePassword = (data) => {
        const userProfile = getUserProfile();
        UserApi.changePassword(userProfile.userName, data).then(response => {
            if (Response.isSuccessAPI(response)) {
                addToast(t('common.message.changePasswordSuccess'), {appearance: 'success'});
                props.onClose()
            } else {
                setCallOutMessage(Response.getAPIError(response))
            }
        }).catch(error => {
            setCallOutMessage(Response.getErrorMessage(error))
        })
    }

    return (
        <Modal
            isOpen={props.show}
            modalName="modal-change-password"
            onClose={() => {
                props.onClose()
                setIsPasswordSubmit(false)
                setCallOutMessage(null)
            }}
            title={props.title}
            centered
        >
            <Modal.Body>
                <Alert bg="danger" classes="pl-1 mb-2 pr-0" content={callOutMessage} dismissible={false}/>
                <PasswordBlock hasCurrentPassword={true}
                               isSubmit={isPasswordSubmit}
                               setIsSubmit={setIsPasswordSubmit}
                               onSave={onChangePassword}
                               setFormState={setFormState}
                />
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="btn btn-outline-secondary mr-50"
                        onClick={() => {
                            props.onClose()
                            setCallOutMessage(null)
                        }}>
                    <span className="d-none d-sm-block">{t('common.button.cancel')}</span>
                </button>
                <button disabled={!formState?.isValid} type="button" className="btn btn-primary btn-min-width"
                        onClick={() => {
                            setIsPasswordSubmit(true)
                            setCallOutMessage(null)
                        }}>
                        <span
                            className="d-none d-sm-block">
                            {props.title}
                        </span>
                </button>
            </Modal.Footer>
        </Modal>
    );
}

ChangePassword.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string
};
ChangePassword.defaultProps = {
    show: false,
};

export default ChangePassword
