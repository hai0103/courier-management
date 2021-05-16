import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

function Tooltip(props) {
    const {t} = useTranslation('common');

    return (
        <div>
            <div
                 // tooltip-type={props.type}
                 className={props.className}
                 // data-popup="tooltip"
                 // className="tooltip"
                 role="tooltip"
                 data-toggle="tooltip"
                 id={props.method}
                 data-original-title={props.content}
                 data-placement={props.positions}
                 data-html={props.html}
                 data-trigger={props.trigger}>
                {props.title}
            </div>
        </div>
    );
}

Tooltip.propTypes = {
    trigger: PropTypes.string,
    method: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    positions: PropTypes.string,
    content: PropTypes.string,
    html: PropTypes.bool,

};

Tooltip.defaultProps = {

};

export default Tooltip;
