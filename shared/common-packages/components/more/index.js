import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

function More({children}) {

    return (
        <div className="d-flex justify-content-center ">
            <span className="dropdown">
                <a id="more-dropdown" data-toggle="dropdown" aria-haspopup="true" className="btn btn-lg dropdown-toggle py-0">
                    <i className="fal fa-ellipsis-v-alt"></i>
                </a>
                <span aria-labelledby="more-dropdown" className="dropdown-menu dropdown-menu-left">
                    {children}
                </span>
            </span>
        </div>
    )
}

More.propTypes = {
    children: PropTypes.any
};

More.defaultProps = {

};

export default More;
