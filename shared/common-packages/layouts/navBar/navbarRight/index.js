import React, {useEffect, useState} from 'react';
import { useTranslation } from "react-i18next";
import { useAuth } from "providers/auth";
import Authentication from "services/authentication";
import {getUserProfile} from "utils/localStorage";
import ChangePassword from "sharedComponents/changePassword";

function NavBarRight(props) {
    const {setAuthenticated} = useAuth();
    const {t} = useTranslation('common');
    const [loggedUser, setLoggedUser] = useState({});
    const [isShowChangePassword, setIsShowChangePassword] = useState(false);
    const logout = async () => {
        Authentication.logout();

    }

    useEffect(() => {
        setLoggedUser(getUserProfile())
    }, [])

    const changeLanguage = () => {

    }

    return (
        <>
            <ul className="nav navbar-nav float-right">
                <li className="dropdown dropdown-language nav-item">
                    <a
                        className="dropdown-toggle nav-link"
                        id="dropdown-flag" href="#"
                        data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                        <i className="flag-icon flag-icon-vn"/>
                        <span className="selected-language"/>
                    </a>
                    <div className="dropdown-menu" aria-labelledby="dropdown-flag">
                        <a className="dropdown-item" href="#">
                            <i className="flag-icon flag-icon-vn"/>
                            Vietnamese
                        </a>
                        <a
                            className="dropdown-item" href="#">
                            <i className="flag-icon flag-icon-us"/>
                            English
                        </a>
                    </div>
                </li>

                <li className="dropdown dropdown-notification nav-item">
                    <a
                        className="nav-link nav-link-label" href="#"
                        data-toggle="dropdown">
                        <i className="fal fa-envelope"/>
                        <span
                            className="badge badge-pill badge-warning badge-up">1</span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-media dropdown-menu-right">
                        <li className="dropdown-menu-header">
                            <h6 className="dropdown-header m-0"><span
                                className="grey darken-2">Messages</span>
                                <span
                                    className="notification-tag badge badge-warning float-right m-0">1 New</span>
                            </h6>
                        </li>
                        <li className="scrollable-container media-list">
                            <a href="#">
                                <div className="media">
                                    <div className="media-left">
                                        <div className="avatar avatar-online avatar-sm rounded-circle">
                                            <img
                                                src="/app-assets/images/portrait/small/no-avt.jpg"
                                                alt="avatar"/>
                                            <i></i>
                                        </div>
                                    </div>
                                    <div className="media-body">
                                        <h6 className="media-heading">Margaret Govan</h6>
                                        <p className="notification-text font-small-3 text-muted">I like your
                                            portfolio,
                                            let's start.</p>
                                        <small>
                                            <time className="media-meta text-muted"
                                                  dateTime="2015-06-11T18:29:20+08:00">Today
                                            </time>
                                        </small>
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li className="dropdown-menu-footer">
                            <a
                                className="dropdown-item text-muted text-center"
                                href="#">Read all messages
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="dropdown dropdown-user nav-item">
                    <a
                        className="dropdown-toggle nav-link dropdown-user-link"
                        href="#" data-toggle="dropdown">
                        <h5 className="user-name mb-0 mx-2 font-weight-bold"
                            style={{
                                height: 36,
                                lineHeight: '36px'
                            }}
                        >
                            {loggedUser?.full_name} - <span className="font-weight-light">{loggedUser?.user_type}</span>
                        </h5>
                        <div className="avatar avatar-online">
                            <img
                                src="/app-assets/images/portrait/small/no-avt.jpg"
                                alt="avatar"/>
                            {/*<i></i>*/}
                        </div>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right rounded">
                        <a className="dropdown-item">
                            <h5 className={loggedUser?.title ? "font-weight-bold" : "font-weight-bold mb-0"}>{loggedUser?.full_name}</h5>
                            <p className="mb-0">{loggedUser?.phone}</p>
                        </a>
                        <div className="dropdown-divider m-0"></div>
                        {/* <Link href={ROUTES.PROFILE}>
                        <a className="dropdown-item">{t('profile.profile')}</a>
                    </Link> */}
                        <a onClick={() => setIsShowChangePassword(true)} className="dropdown-item">{t('profile.changePass')}</a>
                        <a className="dropdown-item" href="#" onClick={() => logout()}>{t('profile.logout')}</a>
                    </div>
                </li>
            </ul>
            <ChangePassword
                show={isShowChangePassword}
                onClose={() => setIsShowChangePassword(false)}
                title={t('profile.changePass')}
            />
        </>

    )

}

export default NavBarRight;
