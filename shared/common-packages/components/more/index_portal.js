import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'
import useOnClickOutside from "hooks/useOnClickOutside";
import useWindowSize from "hooks/useWindowSize";

function More({children}) {
    const parentRef = useRef(null)
    const dropdownWrap = useRef(null)
    const [isShow, setIsShow] = useState(false)
    const windowSize = useWindowSize()
    const [dropdownWidth, setDropdownWidth] = useState(null)

    useOnClickOutside(dropdownWrap, () => {
        setIsShow(false)
    })
    // useEffect(() => {
    //     console.log(dropdownWrap);
    // }, [dropdownWrap])

    const dropdown = () => {
        const parentDom = parentRef.current

        if (parentDom) {
            const offset = parentDom.getBoundingClientRect()
            // console.log(windowSize);
            // console.log(offset.left);
            //
            // console.log(dropdownWrap.current);

            const style = {
                display: 'block',
                top: offset.top + offset.height,
                left: offset.left
            }

            const dropdown = <span ref={dropdownWrap} style={style} className="dropdown-menu">
                {children}
            </span>
            // console.log(dropdown.ref.current);
            // console.log(test);
            if (dropdown.ref.current) {
                console.log(dropdownWrap.current);
                const dropdownWidth = dropdownWrap.current.clientWidth
                console.log(dropdownWidth);
                // console.log(dropdown);
                // setDropdownWidth(dropdownWidth)
            }
            return isShow && dropdown
        }
    }
    return (
        <div className="d-flex justify-content-center">
            <span className="dropdown">
                <a className="btn btn-lg dropdown-toggle py-0" ref={parentRef}
                   onClick={() => setIsShow((status) => !status)}>
                    <i className="fal fa-ellipsis-v-alt"></i>
                </a>
                {
                    ReactDOM.createPortal(dropdown(), document.querySelector('#root-portal'))
                }
            </span>
        </div>
    )
}

More.propTypes = {
    children: PropTypes.any
};

More.defaultProps = {};

export default More;
