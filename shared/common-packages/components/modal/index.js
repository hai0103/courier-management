import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import PerfectScrollbar from 'react-perfect-scrollbar'

function Modal({children, modalName, isOpen, size, className, centered, title, onClose, onAfterOpen, onAfterClose, ...props}) {
    const defaultClassNames = 'modal-dialog modal-dialog-scrollable';
    let classNames = `${defaultClassNames}${size ? ' modal-' + size : ''}`;
    classNames += `${centered ? ' modal-dialog-centered' : ''}`;
    classNames += className ? ` ${className}` : '';

    useEffect(() => {
        ReactModal.setAppElement('body');
    }, []);

    return (
        <ReactModal
            isOpen={isOpen}
            id={modalName}
            portalClassName={
                "ReactModalPortal"
            }
            shouldCloseOnEsc={props.shouldCloseOnEsc}
            className={classNames}
            shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick}
            bodyOpenClassName={"modal-open"}
            onAfterOpen={onAfterOpen}
            onAfterClose={onAfterClose}
            onRequestClose={onClose}
            style={{
                overlay: {
                    zIndex: 1040,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }
            }}
        >
            <div className="modal-content">
                <div className="modal-header bg-light-primary">
                    <h3 className="modal-title">{title}</h3>
                    <button onClick={onClose} type="button" className="close rounded-pill">
                        <i className="fal fa-times" />
                    </button>
                </div>
                {
                    React.Children.map(children, child => {
                        return child;
                    })
                }
            </div>

        </ReactModal>
    )
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.string,
    centered: PropTypes.bool,
    modalName: PropTypes.string,
    shouldCloseOnOverlayClick: PropTypes.bool,
    shouldCloseOnEsc: PropTypes.bool,
    onClose: PropTypes.func,
};

Modal.defaultProps = {
    isOpen: false,
    title: 'Untitled',
    className: '',
    centered: false,
    shouldCloseOnOverlayClick: false,
    shouldCloseOnEsc: true
};

Modal.Body = function ModalBody({children}) {
    return (
        <PerfectScrollbar options={{
            useBothWheelAxes: false,
            suppressScrollX: true
        }} className="modal-body">
            {children}
        </PerfectScrollbar>
    );
};

Modal.Footer = function ModalBody({children}) {
    return (
        <div className="modal-footer">
            {children}
        </div>
    );
};

export default Modal;
