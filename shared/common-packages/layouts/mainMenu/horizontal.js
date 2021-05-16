import React, {useState} from 'react';
import Link from 'next/link';

function MainMenu() {
    const [mainMenu] = useState([
        {
            title: 'Dashboard',
            icon: 'icon-home',
            href: '/'
        },
        // {
        //     title: 'Template',
        //     icon: 'icon-monitor',
        //     href: '/template',
        //     children: [
        //         {
        //             title: 'Users',
        //             href: '#',
        //         },
        //         {
        //             title: 'Team',
        //             href: '#',
        //             children: [
        //                 {
        //                     title: 'Users',
        //                     href: '#',
        //                 },
        //                 {
        //                     title: 'Team',
        //                     href: '#',
        //                 }
        //             ]
        //         }
        //     ]
        // },
        {
            title: 'Policy',
            icon: 'icon-monitor',
            href: '/policy',
        },
        {
            title: 'Claim',
            icon: 'icon-monitor',
            href: '/claim',
        },
    ])

    const getMenuDataToggle = (menu) => {
        if (hasChildrenMenu(menu)) {
            return 'dropdown';
        }

        return '';
    };

    const getSubMenuClasses = (menu) => {
        if (hasChildrenMenu(menu)) {
            return 'dropdown-submenu';
        }

        return '';
    };

    const hasChildrenMenu = (menu) => {
        return menu.children && menu.children.length > 0;
    }

    const renderSubMenu = (menu) => {
        if (!hasChildrenMenu(menu)) {
            return '';
        }
        return (
            <ul className="dropdown-menu">
                {
                    menu.children.map(subMenu => {
                        return <li className={"dropdown " + getSubMenuClasses(subMenu)}
                            data-menu="dropdown-submenu" key={subMenu.title}>
                            <Link href={subMenu.href}>
                                <a className="dropdown-item" data-toggle={getMenuDataToggle(subMenu)}>
                                    {subMenu.title}
                                </a>
                            </Link>
                            {renderSubMenu(subMenu)}
                        </li>
                    })
                }
            </ul>
        );
    };

    return (
        <div
            className="header-navbar navbar-expand-sm navbar navbar-horizontal navbar-fixed navbar-light navbar-without-dd-arrow navbar-shadow menu-border"
            role="navigation">
            <div className="navbar-container main-menu-content container center-layout" data-menu="menu-container">
                <ul className="nav navbar-nav" id="main-menu-navigation">
                    {
                        mainMenu.map(menu => {
                            return <li className="dropdown nav-item" data-menu="dropdown" key={menu.title}>
                                <Link href={menu.href}>
                                    <a className="dropdown-toggle nav-link"
                                        data-toggle={getMenuDataToggle(menu)}>
                                        <i className={"feather " + menu.icon}/>
                                        <span>{menu.title}</span>
                                    </a>
                                </Link>
                                {renderSubMenu(menu)}
                            </li>
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default MainMenu;
