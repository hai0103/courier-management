import React from "react";
import PropTypes from "prop-types";

function Select({register, name, ...rest}) {
    return <input name={name} ref={register} {...rest} />;
}

Select.propTypes = {
    register: PropTypes.any,
    name: PropTypes.string
}

export default Select
