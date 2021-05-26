import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useTranslation} from "react-i18next";
import {IMAGES, MAIN_MENU, ROUTES, MAIN_MENU_CRM} from 'constants/common';
import {getUserProfile, getUserTypeProfile} from "utils/localStorage";

function MainMenu() {
    const {t} = useTranslation('common');
    const [userType, setUserType] = useState({});

    const [mainMenu, setMainMenu] = useState(() => {
        return MAIN_MENU;
    })
    const [loggedUser, setLoggedUser] = useState({});

    useEffect(() => {
        setLoggedUser(getUserProfile())
        setUserType(getUserTypeProfile())
    }, [])

    useEffect(() => {
        setMainMenu(userType.user_type_code === "DEALER" ? MAIN_MENU_CRM : MAIN_MENU)
    }, [userType.user_type_code])


    const hasChildrenMenu = (menu) => {
        return menu.children && menu.children.length > 0;
    }

    const hasSubClass = (menu) => {
        return hasChildrenMenu(menu) ? 'has-sub' : '';
    }

    const renderLink = (menu) => {
        const link = <Link href={menu.href}>
            <a className="menu-item">
                {
                    menu.icon ? <i className={"feather " + menu.icon}/> : ''
                }
                {
                    menu.faIcon ? <i className={"fa " + menu.faIcon}/> : ''
                }
                {
                    menu.falIcon ? <i className={"fal " + menu.falIcon}/> : ''
                }
                {
                    menu.farIcon ? <i className={"far " + menu.farIcon}/> : ''
                }
                {
                    menu.fabIcon ? <i className={"fab " + menu.fabIcon}/> : ''
                }
                {
                    menu.simpleIcon ? <i className={menu.simpleIcon}/> : ''
                }
                <span>{t(menu.title)}</span>
            </a>
        </Link>;

        if (hasChildrenMenu(menu)) {
            return <a className="menu-item">
                <i className={"fa " + menu.faIcon}/>
                <span>{t(menu.title)}</span>
            </a>
        }

        return link;
    }

    const renderSubMenu = (menu) => {
        if (!hasChildrenMenu(menu)) {
            return '';
        }
        return (
            <ul className="menu-content">
                {
                    menu.children.map(subMenu => {
                        return <li className={hasSubClass(subMenu)} key={subMenu.title}>
                            {renderLink(subMenu)}

                            {renderSubMenu(subMenu)}
                        </li>
                    })
                }
            </ul>
        );
    };

    return (
        <div className="main-menu menu-fixed menu-light menu-accordion menu-shadow border-right-0">
            <div className="main-menu-content">
                <ul className="navigation" style={{height: 56}}>
                    <li className="navigation-header h-100 p-0 py-25 border-bottom navbar-shadow nav-item">
                        {/*<div className="avatar avatar-online">*/}
                        {/*    <img src="/app-assets/images/portrait/small/no-avt.jpg" alt="avatar"/>*/}
                        {/*</div>*/}
                        {/*<h4 className="font-weight-bold mb-0 text-white text-truncate">{loggedUser?.full_name}</h4>*/}
                            <Link href={ROUTES.HOME}>
                                <a className="navbar-brand p-0 m-0 pl-4 h-100 text-decoration-none">
                                    <img className="brand-logo h-100" alt="Alpaca admin logo" src={IMAGES.WHITE_LOGO}/>
                                </a>
                            </Link>
                    </li>
                </ul>
                <ul className="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
                    {
                        mainMenu.map((menu, i) => {
                            return (
                                <React.Fragment key={i}>
                                    {
                                        menu.isLabel ? <li className="navigation-header border-top">
                                                <span>{t(menu.title)}</span><i className="feather icon-minus"/>
                                            </li> :
                                            <>
                                                {
                                                    menu.isFirst && <br />
                                                }
                                                <li title={t(menu.title)} className={"nav-item " + hasSubClass(menu)} key={menu.title}>
                                                    {renderLink(menu)}
                                                    {renderSubMenu(menu)}
                                                </li>
                                            </>

                                    }

                                </React.Fragment>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default MainMenu;
