import React from 'react';
import PropTypes from "prop-types";

const Spinner = (props) => {
    const LoadingBlock = <div className="text-center">
        <div className={`spinner-${props.type} text-${props.bg}`}>
        </div>
    </div>

    return props.loading ? LoadingBlock : (props.children || <></>)
}

Spinner.propTypes = {
    children: PropTypes.any,
    bg: PropTypes.string,
    loading: PropTypes.bool,
    type: PropTypes.string,
};
Spinner.defaultProps = {
    bg: 'primary', // primary | secondary | danger | success | info | light | dark
    type: 'border', //grow | border
    loading: true
};

export default Spinner;
