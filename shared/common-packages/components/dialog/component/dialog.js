import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar'
import styles from './dialog.module.css';

function Dialog(props) {
    const {
        children, modalName, shouldCloseOnOverlayClick, size, className, centered, title,
        onClose, onClickOutside, onAfterClose, overlayClassName, shouldCloseOnEsc, onKeypressEscape
    } = props;
    const defaultClassNames = 'modal-dialog modal-dialog-scrollable';
    let classNames = `${defaultClassNames}${size ? ' modal-' + size : ''}`;
    classNames += `${centered ? ' modal-dialog-centered' : ''}`;
    classNames += className ? ` ${className}` : '';
    let overlay = useRef(null);
    useEffect(() => {
        document.addEventListener('keydown', keyboardClose, false)
        return () => {
            document.removeEventListener('keydown', keyboardClose, false)
        };
    }, [])
    const handleClickOverlay = e => {
        const isClickOutside = e.target === overlay
        if (shouldCloseOnOverlayClick && isClickOutside) {
            if (onClickOutside) {
                onClickOutside()
            }
            close()
        }
    }
    const keyboardClose = event => {
        const isKeyCodeEscape = event.keyCode === 27

        if (shouldCloseOnEsc && isKeyCodeEscape) {
            if (onKeypressEscape) {
                onKeypressEscape(event)
            }
            close()
        }
    }
    close = () => {
        if (onClose) {
            onClose(null);
        }
        props.close(false);
        if (onAfterClose) {
            onAfterClose(null);
        }

    }
    return (
        <div className={`${styles['react-dialog-overlay']} ${overlayClassName ? overlayClassName : ''}`}
             ref={dom => (overlay = dom)}
             onClick={handleClickOverlay}>
            <div className={classNames} id={modalName}>
                <div className="modal-content">
                    <div className="modal-header bg-light-primary">
                        <h3 className="modal-title">{title}</h3>
                        <button onClick={close} type="button" className="close rounded-pill">
                            <i className="fal fa-times"/>
                        </button>
                    </div>
                    {
                        React.Children.map(children, child => {
                            return child;
                        })
                    }
                </div>
            </div>
        </div>
    )
}

Dialog.propTypes = {
    title: PropTypes.string,
    onClickOutside: PropTypes.func,
    onKeypressEscape: PropTypes.func,
    overlayClassName: PropTypes.string,

    size: PropTypes.string,
    centered: PropTypes.bool,
    modalName: PropTypes.string,
    shouldCloseOnOverlayClick: PropTypes.bool,
    shouldCloseOnEsc: PropTypes.bool,
    onClose: PropTypes.func,
    onAfterClose: PropTypes.func,
};

Dialog.defaultProps = {
    isOpen: false,
    title: 'Untitled',
    className: '',
    centered: false,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEsc: true
};

Dialog.Body = function ModalBody({children}) {
    return (
        <PerfectScrollbar options={{
            useBothWheelAxes: false,
            suppressScrollX: true
        }} className="modal-body">
            {children}
        </PerfectScrollbar>
    );
};

Dialog.Footer = function ModalBody({children}) {
    return (
        <div className="modal-footer">
            {children}
        </div>
    );
};

export default Dialog;
