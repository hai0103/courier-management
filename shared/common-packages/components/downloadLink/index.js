import React from 'react';
import PropTypes from 'prop-types';
import {download} from "utils/helpers";

function DownloadLink(props) {
    return <a title={props?.name} href="#" onClick={(e) => {
        e.preventDefault()
        download(props.id, props?.name)
    }}>{props?.name}</a>
}

DownloadLink.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string
};

DownloadLink.defaultProps = {};

export default DownloadLink;
