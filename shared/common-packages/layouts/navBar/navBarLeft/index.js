import Link from 'next/link';
import React from 'react';
import {useGlobalContext} from "providers/global";

export default function NavBarLeft() {
    const {global} = useGlobalContext();

    return (
        <ul className="nav navbar-nav mr-auto float-left">
            <li className="nav-item d-none d-md-block"><a
                className="nav-link nav-menu-main menu-toggle hidden-xs pt-2"
                href="#"><i className="far fa-bars"/></a>
            </li>
            <li className="nav-item d-none d-md-block">
                <Link href={global.headerHref || '#'}>
                    <a className="nav-link nav-link-expand px-0">
                        <h5 className="font-weight-bold mb-0 text-uppercase">{global.headerTitle || ''}</h5>
                    </a>
                </Link>
            </li>
            <li className="nav-item d-none">
                <a className="nav-link nav-link-expand" href="#">
                    <i className="ficon feather icon-maximize"/>
                </a>
            </li>
        </ul>
    )
}
