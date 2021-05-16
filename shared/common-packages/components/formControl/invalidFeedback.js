import PropTypes from 'prop-types';
import React from 'react';

const InvalidFeedBack = (props) => {
    return (
        <React.Fragment>
            <div className="form-control-position">
                <i className="far fa-exclamation-triangle"/>
            </div>
            <div className="invalid-feedback">{props.message}</div>
        </React.Fragment>
    );
};

InvalidFeedBack.propTypes = {
    message: PropTypes.string,
};

InvalidFeedBack.defaultProps = {
    message: ''
};

export default InvalidFeedBack;
