import React from "react";
import {useTranslation} from "react-i18next";
import Modal from "./index";
import PropTypes from "prop-types";

function ModalConfirmation(props) {
    const {t} = useTranslation('common');
    return (
        <div>
            <Modal
                isOpen={props.show}
                modalName="modal-confirm"
                onClose={() => props.onClose()}
                // onAfterOpen={() => setIsOpenModal(false)}
                // onAfterClose={() => setIsOpenModal(true)}
                title={props.title}
                centered
            >
                {
                    props.content && <Modal.Body>
                        {props.content}
                    </Modal.Body>
                }
                <Modal.Footer>
                    {props.showButtonCancel && <button type="button" className="btn btn-outline-secondary mr-25" data-dismiss="modal"
                             onClick={() => props.onClose()}>
                        <span
                            className="d-none d-sm-block">{props.cancelButtonLabel || t('common.button.cancel')}</span>
                    </button>}
                    {props.showButtonConfirm && <button type="button" className="btn btn-primary btn-min-width" data-dismiss="modal"
                             onClick={() => props.onConfirm()}>
                        <span
                            className="d-none d-sm-block">{props.confirmButtonLabel || t('common.button.clear')}</span>
                    </button>}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

ModalConfirmation.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    content: PropTypes.string,
    confirmButtonLabel: PropTypes.string,
    cancelButtonLabel: PropTypes.string,
    onConfirm: PropTypes.func,
    showButtonCancel: PropTypes.bool,
    showButtonConfirm: PropTypes.bool
};

ModalConfirmation.defaultProps = {
    show: false,
    confirmButtonLabel: '',
    showButtonCancel: true,
    showButtonConfirm: true
};

export default ModalConfirmation;
