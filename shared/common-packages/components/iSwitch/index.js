import React from 'react';
import PropTypes from 'prop-types';
import Switch from "react-switch";

const ISwitch = props => <Switch
    uncheckedIcon={false}
    checkedIcon={false}
    height={20}
    width={40}
    handleDiameter={15}
    {...props}
/>;

ISwitch.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};

ISwitch.defaultProps = {
  checked: false
};

export default ISwitch;
