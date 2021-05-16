import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

function Progress(props) {
    const {t} = useTranslation('common');
    const defaultClassNames = 'progress-bar';
    let classNames = `${defaultClassNames}${props.type ? ' bg-' + props.type : ''}${props.striped ? ' progress-bar-striped' : ''}${props.animated ? ' progress-bar-animated' : ''}${props.fontSize ? ' font-'  + props.fontSize: ''}`;

    return (
        <div className="progress" style={{height: props.height+"px"}}>
            <div className={classNames}
                 role="progressbar"
                 // aria-valuenow="50"
                 // aria-valuemin="50"
                 // aria-valuemax="100"
                 style={{width: props.percent+"%"}}
            >
                {props.label?props.label:null}
            </div>
        </div>
    );
}

Progress.propTypes = {
    percent: PropTypes.string,
    fontSize: PropTypes.string,
    type: PropTypes.string,
    height: PropTypes.string,
    label: PropTypes.string,
    striped: PropTypes.bool,
    animated: PropTypes.bool
};

Progress.defaultProps = {

};

export default Progress;
