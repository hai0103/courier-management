import React, {useEffect} from "react";
import Head from "next/head";

function OutsideLayout({children}) {
    useEffect(() => {
        document.body.classList.add(
            "horizontal-layout",
            "horizontal-menu",
            "1-column",
            "login-page",
            "blank-page",
        );
    }, []);

    return (
        <React.Fragment>
            <Head>
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui"/>
                <meta name="description"
                    content="Stack admin is super flexible, powerful, clean &amp; modern responsive bootstrap 4 admin template with unlimited possibilities."/>
                <meta name="keywords"
                    content="admin template, stack admin template, dashboard template, flat admin template, responsive admin template, web app"/>
                <meta name="author" content="Alpaca"/>
                <meta name="robots" content="noindex" />
                <link rel="apple-touch-icon" href="/app-assets/images/ico/apple-icon-120.png"/>
                <link rel="shortcut icon" type="image/x-icon"
                    href="/app-assets/images/ico/favicon.ico"/>
                <link
                    href="https://fonts.googleapis.com/css?family=Montserrat:300,300i,400,400i,500,500i%7COpen+Sans:300,300i,400,400i,600,600i,700,700i"
                    rel="stylesheet"/>
                <link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/vendors.min.css"/>
                {/*<link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/forms/icheck/icheck.css"/>*/}
                {/*<link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/forms/icheck/custom.css"/>*/}
                {/*<link rel="stylesheet" type="text/css" href="/app-assets/css/bootstrap.css"/>*/}
                {/*<link rel="stylesheet" type="text/css" href="/app-assets/css/bootstrap-extended.css"/>*/}
                {/*<link rel="stylesheet" type="text/css" href="/app-assets/css/colors.css"/>*/}
                <link rel="stylesheet" type="text/css" href="/app-assets/css/components.css"/>
                {/*<link rel="stylesheet" type="text/css" href="/app-assets/css/core/menu/menu-types/horizontal-menu.css"/>*/}
                {/*<link rel="stylesheet" type="text/css" href="/app-assets/css/core/colors/palette-gradient.css"/>*/}
            </Head>
            <div className="app-content content">
                <div className="content-wrapper">
                    <div className="content-header row">
                    </div>
                    <div className="content-body">{children}</div>
                </div>
            </div>
            <script src="/app-assets/vendors/js/vendors.min.js"/>
            {/*<script src="/app-assets/vendors/js/ui/jquery.sticky.js"></script>*/}
            {/*<script src="/app-assets/vendors/js/charts/jquery.sparkline.min.js"></script>*/}
            {/*<script src="/app-assets/vendors/js/forms/icheck/icheck.min.js"></script>*/}
            {/*<script src="/app-assets/js/core/app-menu.js"></script>*/}
            {/*<script src="/app-assets/js/core/app.js"></script>*/}
            {/*<script src="/app-assets/js/scripts/forms/form-login-register.js"></script>*/}
            {/*<script>*/}
            {/*        window.AdminManageConfig.activeMenu = ""*/}
            {/*</script>*/}
        </React.Fragment>
    );
}

export default OutsideLayout;
