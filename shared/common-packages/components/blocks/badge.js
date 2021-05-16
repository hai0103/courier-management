import PropTypes from "prop-types";
import React from "react";

function Badge(props) {
    const bg = props.bg;
    const label = props.label;

    return (
        <div className="d-flex">
            <div className="d-flex align-items-center status-table">
                <i className={"fas fa-circle fa-xs mr-50 small text-" + bg}></i>
                <div className="text-truncate text-capitalize" title={label}>{label}</div>
            </div>
            <div className={"badge badge-sm badge-" + bg}>{label}</div>
        </div>
    );
}

Badge.propTypes = {
    label: PropTypes.string,
    bg: PropTypes.string
};

Badge.defaultProps = {
    label: 'No label',
    bg: 'primary'
};

export default Badge;
