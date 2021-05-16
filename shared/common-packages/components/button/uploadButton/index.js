import React from 'react';
import PropTypes from 'prop-types';

function UploadButton({children, onChange, accept, ...props}) {
    const hiddenFileInput = React.useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
        hiddenFileInput.current.value = ''
    };

    const handleChange = event => {
        const fileUploaded = event.target.files;
        onChange && onChange(fileUploaded)
    };

    return (
        <button {...props} onClick={handleClick}>
            {
                children
            }
            <input onChange={handleChange}
                   ref={hiddenFileInput}
                   type="file"
                   accept={accept}
                   style={{display:'none'}} />
        </button>
    )
}

UploadButton.propTypes = {
    children: PropTypes.any,
    onChange: PropTypes.func,
    accept: PropTypes.string
};

UploadButton.defaultProps = {

};

export default UploadButton;