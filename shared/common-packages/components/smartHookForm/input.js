import React from "react";
import PropTypes from "prop-types";

function Input({register, name, ...rest}) {
    return <input name={name} ref={register} {...rest} />;
}

Input.propTypes = {
    register: PropTypes.any,
    name: PropTypes.string
}

export default Input
