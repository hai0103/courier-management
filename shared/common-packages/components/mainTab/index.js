import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Spinner from "sharedComponents/spinner";

function MainTab(props) {
    const {t} = useTranslation('common');
    const [tab, setTab] = useState(props.activeTab);
    const [content, setContent] = useState(null);
    const tabRefs = useRef([]);
    const tabWrapperRef = useRef(null);
    const tabTransitionRef = useRef(null);
    const cardContentRef = useRef(null);
    const [hasResponsive, setHasResponsive] = useState(false)
    const [allWidth, setAllWidth] = useState([])
    const [tabIndex, setTabIndex] = useState(0)
    const [stopNavigate, setStopNavigate] = useState(false)

    const Loading = () => {
        return <div className="modal-dialog modal-sm modal-dialog-centered mt-n5 d-flex justify-content-center" role="document">
            <div className="card-title d-flex justify-content-center">
                <Spinner/>
            </div>
        </div>
    }

    useEffect(() => {

        generateContent(tab).catch(e => console.log(e))
        return (
            setContent(<Loading/>)

        )
    }, [tab])

    useEffect(() => {
        if (allWidth[tabIndex] && tabIndex >= 0) {
            let currentTransition = 0
            let restTransition = tabWrapperRef.current.clientWidth
            if (tabIndex > 0) {
                const current = allWidth.slice(0, tabIndex)
                const rest = allWidth.slice(tabIndex)
                currentTransition = current.reduce((sum, x) => sum + x)
                restTransition = rest.reduce((sum, x) => sum + x)

            }

            setStopNavigate(restTransition < tabWrapperRef.current.clientWidth)
            tabTransitionRef.current.style.transform = `translateX(-${currentTransition}px)`
        }
    }, [tabIndex])

    useEffect(() => {
        const allWidth = tabRefs.current.map(
            ref => ref.clientWidth
        );
        const extWidth = 100
        const cardContentWidth = cardContentRef.current.clientWidth
        const totalTabWidth = allWidth.reduce((sum, width) => sum + width)
        tabTransitionRef.current.style.width = `${totalTabWidth + extWidth}px`
        if (cardContentWidth < totalTabWidth + extWidth) {
            tabWrapperRef.current.style.width = `${cardContentWidth - extWidth}px`
            setHasResponsive(true)
            setAllWidth(allWidth)
        }
    }, [])


    const next = (e) => {
        e.preventDefault()
        if (tabIndex < allWidth.length - 1 && !stopNavigate) {
            setTabIndex(tabIndex + props.step)
        }
    }

    const prev = (e) => {
        e.preventDefault()
        if (tabIndex > 0) {
            setTabIndex(tabIndex - props.step)
        }
    }

    const generateContent = async (index) => {
        try {
            const contentFunction = await props.content[index]()
            setContent(contentFunction || null)
        } catch (e) {
            setContent(null)
        }
    }

    return (
        <div className="animated slideInRight">
            <div className="card card-no-border shadow-none" ref={cardContentRef}>
                <div className="card-content p-0">
                    <div className="card-header card-header-main">
                        <div className="mr-1 pr-5">
                            <div className="responsive-tabs-carousel-container">
                                <div ref={tabWrapperRef} className="tabs-container">
                                    {
                                        hasResponsive && <a href="#" onClick={prev} className="tab-previous"><i className="far fa-chevron-left fa-lg"></i></a>
                                    }
                                    <ul ref={tabTransitionRef} className="nav nav-pills nav-pills-sm nav-pills-sm-light">
                                        {props.menu && props.menu.length > 0 && props.menu.map((item, index) => {
                                            return (
                                                <li ref={(el) => tabRefs.current[index] = el} key={index} className="nav-item"
                                                    onClick={() => setTab(index)}>
                                                    <a className={`nav-link ${item.dropdown ? "dropdown-toggle" : ""} ${(item.active || tab === index) ? "active" : ""}`}
                                                       id={`main-tab-menu-${index}`}
                                                       data-toggle={item.dropdown ? "dropdown" : "tab"}
                                                       aria-controls={`main-tab-menu-${index}`} role="tab"
                                                       aria-selected="true">{item[props.menuNameKey]}</a>
                                                    {item.dropdown && <div className="dropdown-menu">
                                                        {item.option && item.option.length > 0 && item.option.map((_item, i) => {
                                                            return (
                                                                <a key={i} className="dropdown-item" id="dropdownOpt1-tab1"
                                                                   data-toggle="tab" aria-controls={`main-tab-menu-${index}`}
                                                                   role="tab"
                                                                   aria-selected="true">{_item[props.menuNameKey]}
                                                                </a>
                                                            )
                                                        })}
                                                    </div>}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    {
                                        hasResponsive && <a href="#" onClick={next} className="tab-next"><i className="far fa-chevron-right fa-lg"></i></a>
                                    }

                                </div>
                            </div>
                        </div>
                        {
                            props.rightControl && props.rightControl()
                        }
                    </div>
                    {
                        props.rightSlider && props.rightSlider()
                    }
                    <div className="slide-content">
                        <div className="tab-content">
                            {content || <div className="card-body">{t('common.noData')}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

MainTab.propTypes = {
    menuNameKey: PropTypes.string,
    menu: PropTypes.array,
    content: PropTypes.array,
    activeTab: PropTypes.number,
    step: PropTypes.number,
    rightControl: PropTypes.func,
    rightSlider: PropTypes.func,
};

MainTab.defaultProps = {
    activeTab: 0,
    menuNameKey: 'name',
    step: 5
};

export default React.memo(MainTab);
