import React, {useEffect} from "react";
import Nav from "../../navBar";
import Head from "next/head";
import MainMenu from "../../mainMenu";
import withAuth from "hocs/withAuth";
import withoutAuth from "hocs/withoutAuth";

const CommonLayout = ({children, ...restProps}) => {
    useEffect(() => {
        document.body.classList.add(
            "vertical-layout",
            "vertical-menu",
            "fixed-navbar",
            "2-columns"
        );
        document.body.setAttribute('data-menu', 'vertical-menu');
        document.body.setAttribute('data-col', '2-columns');
    }, []);

    return (
        <React.Fragment>
            <Head>
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui"/>
                <meta name="author" content="Alpaca"/>
                <meta name="robots" content="noindex" />
                <link rel="apple-touch-icon" href="/app-assets/images/ico/apple-icon-120.png"/>
                {/*<link rel="shortcut icon" type="image/x-icon" href="/app-assets/images/ico/favicon-alpaca.png"/>*/}
                <link rel="shortcut icon" type="image/x-icon" href="/app-assets/images/ico/favicon-default.ico"/>
                <link
                    href="https://fonts.googleapis.com/css?family=Montserrat:300,300i,400,400i,500,500i%7COpen+Sans:300,300i,400,400i,600,600i,700,700i"
                    rel="stylesheet"/>

                {/*Vendor*/}
                <link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/vendors.min.css"/>
                <link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/weather-icons/climacons.min.css"/>
                {/*Theme*/}
                <link rel="stylesheet" type="text/css" href="/app-assets/css/components.css"/>
                <link rel="stylesheet" type="text/css" href="/app-assets/css/core/menu/menu-types/vertical-menu.css"/>
                {/*Custom*/}
                <link rel="stylesheet" type="text/css" href="/app-assets/css/pages/filters.css"/>
            </Head>
            <Nav/>
            <MainMenu/>

            <div className="app-content content">
                <div className="content-overlay"/>
                <div className="content-wrapper p-0">{children}</div>
            </div>

            <div className="sidenav-overlay" style={{}}/>
            <div className="drag-target"/>
            <div id="root-portal"></div>
            {/*Vendor*/}
            <script src="/app-assets/vendors/js/vendors.min.js"/>
            {/*Font*/}
            <link rel="stylesheet" type="text/css" href="/app-assets/fonts/simple-line-icons/style.min.css"/>
            {/*Core*/}
            <script src="/app-assets/js/core/app-menu.js"/>
            <script src="/app-assets/js/core/app.js"/>

        </React.Fragment>
    );
}

CommonLayout.ContentBody = function CommonLayoutContentBody({children}) {
    return (
        <div className="content-body">{children}</div>
    );
}

CommonLayout.ContentHeader = function CommonLayoutContentHeader({children}) {
    return (
        <div className="content-header row">
            {
                React.Children.map(children, child => {
                    // code here
                })
            }
        </div>
    );
}

CommonLayout.LeftContentHeader = function CommonLayoutLeftContentHeader({children}) {
    return (
        <div className="content-header-left col-md-6 col-12">
            {children}
        </div>
    );
}

CommonLayout.RightContentHeader = function CommonLayoutRightContentHeader({children}) {
    return (
        <div className="content-header-right col-md-6 col-12">
            {children}
        </div>
    );
}

export default withAuth(CommonLayout);
