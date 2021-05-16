import React from 'react';
import EnhancedSwitch from 'react-icheck/lib/EnhancedSwitch';
import {Checkbox} from 'react-icheck';
import PropTypes from 'prop-types';

EnhancedSwitch.propTypes = {
  ...EnhancedSwitch.propTypes,
  cursor: PropTypes.string,
};

const ICheckbox = props => <Checkbox
    checkboxClass="icheckbox_square-blue"
    cursor="pointer" {...props}
    increaseArea="20%"
    label={props.label}
/>;

ICheckbox.propTypes = {
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

ICheckbox.defaultProps = {
  defaultChecked: false
};

export default ICheckbox;
