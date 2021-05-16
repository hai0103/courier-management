import React from "react";
import {useTranslation} from "react-i18next";
import Dialog from "./component/dialog";
import showDialog from "./showDialog";
import PropTypes from "prop-types";

function DialogConfirmation(props) {
    const {t} = useTranslation('common');
    return (
        <Dialog
            modalName="modal-confirm"
            title={props.title}
            centered
            {...props}
        >
            {
                props.content && <Dialog.Body>
                    {props.content}
                </Dialog.Body>
            }
            <Dialog.Footer>
                <button type="button" className="btn btn-outline-secondary mr-25" data-dismiss="modal"
                        onClick={() => props.close(false)}>
                    <span className="d-none d-sm-block">{props.cancelButtonLabel || t('common.button.cancel')}</span>
                </button>
                <button type="button" className="btn btn-primary btn-min-width" data-dismiss="modal"
                        onClick={() => props.close(true)}>
                    <span className="d-none d-sm-block">{props.confirmButtonLabel || t('common.button.clear')}</span>
                </button>
            </Dialog.Footer>
        </Dialog>
    )
}

DialogConfirmation.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    content: PropTypes.string,
    confirmButtonLabel: PropTypes.string,
    cancelButtonLabel: PropTypes.string,
    onConfirm: PropTypes.func
};

DialogConfirmation.defaultProps = {
    show: false,
    confirmButtonLabel: ''
};

export default async function showConfirm(title, content) {
    return showDialog(DialogConfirmation, {title: title, content: content})
}
