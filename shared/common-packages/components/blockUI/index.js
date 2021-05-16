import PropTypes from "prop-types";
import React from "react";
import Blocker from "react-block-ui";

function BlockUi({children, blocking}) {
    const loader = () => {
        return (
            <i className="feather icon-refresh-cw icon-spin font-medium-2" />
        );
    }
    return (
        <Blocker loader={loader} tag="div" blocking={blocking}>
            {children}
        </Blocker>
    );
}

BlockUi.propTypes = {
    blocking: PropTypes.bool
};

BlockUi.defaultProps = {
    blocking: false
};

export default BlockUi;