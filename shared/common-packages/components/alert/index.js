import React from 'react';
import PropTypes from 'prop-types';

function Alert(props) {
    const bg = `bg-${props.bg}`;
    const dismissibleClass = props.dismissible ? ' alert-dismissible' : '';
    const iconLeft = props.hasIconLeft ? ' alert-icon-left' : '';
    const iconRight = props.hasIconRight ? ' alert-icon-right' : '';
    const customClasses = ` ${props.classes}`
    const classes = `alert ${bg}${dismissibleClass}${iconLeft}${iconRight}${customClasses}`;
    const isShow = props.content || false;
    let icon = ''
    switch (props.bg) {
        case 'danger':
        case 'warning':
            icon = 'fa-exclamation-triangle'
            break
        case 'success':
            icon = 'fa-check-circle'
            break
        case 'info':
            icon = 'fa-info-circle'
            break
        default:
            icon = 'fa-exclamation-triangle'
            break
    }
    return(
        isShow && <div className={classes}>
            {
                props.dismissible &&
                <button  type="button" className="close rounded-pill" data-dismiss="alert" aria-label="Close">
                    <i className="fal fa-times fa-xs"></i>
                </button>
            }
            <i className={`far ${icon} pr-50`} />
            {props.content || props.children}
        </div>
    )
}

Alert.propTypes = {
    bg: PropTypes.string,
    content: PropTypes.string,
    classes: PropTypes.string,
    dismissible: PropTypes.bool,
    hasIconLeft: PropTypes.bool,
    hasIconRight: PropTypes.bool,
    children: PropTypes.any
};

Alert.defaultProps = {
    bg: 'primary',
    content: '',
    classes: '',
    dismissible: true,
    hasIconLeft: false,
    hasIconRight: false
};

export default Alert;
