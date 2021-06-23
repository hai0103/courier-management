import PropTypes from "prop-types";
import React from "react";

function Badge(props) {
  const bg = props.bg;
  const label = props.label;

  return (
    <div className="content-header-sub">
      {
        props.isInForm ? <div className='d-flex align-items-center'>
            <label>{props.title || 'Trạng thái'}:</label>
            <div className="d-flex align-items-center mx-1">
              <i className={"fas fa-circle fa-xs mr-1 small text-" + bg}></i>
              <span className="text-truncate" title={label}>{label}</span>
            </div>
          </div> :
          props.isClassicBadge
            ? <div className={"badge badge-" + bg}>
              {label}
            </div>
            : <div className="d-flex align-items-center">
        <i className={"fas fa-circle fa-xs mx-50 small text-" + bg}></i>
        <div className="text-truncate" title={label}>{label}</div>
        </div>
      }
    </div>
  );
}

Badge.propTypes = {
  label: PropTypes.string,
  title: PropTypes.string,
  bg: PropTypes.string,
  isInForm: PropTypes.bool,
  isClassicBadge: PropTypes.bool
};

Badge.defaultProps = {
  label: 'No label',
  bg: 'primary',
  isInForm: false,
  isClassicBadge: false,
};

export default Badge;
