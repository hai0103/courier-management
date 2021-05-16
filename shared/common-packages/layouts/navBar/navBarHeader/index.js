import React from 'react';
import {IMAGES, ROUTES} from "constants/common";
import Link from "next/link";

class NavBarHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="navbar-header">
                <ul className="nav navbar-nav flex-row">
                    <li className="nav-item mobile-menu d-md-none mr-auto">
                        <a className="nav-link nav-menu-main menu-toggle hidden-xs" href="#">
                            <i className="fal fa-bars font-large-1"/>
                        </a>
                    </li>
                    {/*<li className="nav-item">*/}
                    {/*    <Link href={ROUTES.HOME}>*/}
                    {/*        <a className="navbar-brand">*/}
                    {/*            <img className="brand-logo" alt="Alpaca admin logo" src={IMAGES.WHITE_LOGO}/>*/}
                    {/*        </a>*/}
                    {/*    </Link>*/}
                    {/*</li>*/}
                    <li className="nav-item d-md-none">
                        <a className="nav-link open-navbar-container" data-toggle="collapse" data-target="#navbar-mobile">
                            <i className="fal fa-ellipsis-v-alt"/>
                        </a>
                    </li>
                </ul>
            </div>
        )
    }

}

export default NavBarHeader;
