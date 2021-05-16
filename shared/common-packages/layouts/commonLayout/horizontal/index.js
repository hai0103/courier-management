import React, {useEffect} from "react";
import Nav from "../../navBar";
import Footer from "../../footer";
import Head from "next/head";
import MainMenu from "../../mainMenu";
import withAuth from "hocs/withAuth";
import withoutAuth from "hocs/withoutAuth";

const CommonLayout = ({children}) => {

    useEffect(() => {
        document.body.classList.add(
            "horizontal-layout",
            "horizontal-menu",
            "horizontal-menu-padding",
            "2-columns",
        );
    });

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
                <link rel="apple-touch-icon" href="/app-assets/images/ico/apple-icon-120.png"/>
                <link rel="shortcut icon" type="image/x-icon"
                      href="/app-assets/images/ico/favicon.ico"/>
                <link
                    href="https://fonts.googleapis.com/css?family=Montserrat:300,300i,400,400i,500,500i%7COpen+Sans:300,300i,400,400i,600,600i,700,700i"
                    rel="stylesheet"/>
                <link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/vendors.min.css" />
                {/*<link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/charts/jquery-jvectormap-2.0.3.css"/>*/}
                {/*<link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/charts/morris.css"/>*/}
                {/*<link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/extensions/unslider.css"/>*/}
                <link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/weather-icons/climacons.min.css"/>
                <link rel="stylesheet" type="text/css" href="/app-assets/css/bootstrap.css"/>
                <link rel="stylesheet" type="text/css" href="/app-assets/css/bootstrap-extended.css"/>
                <link rel="stylesheet" type="text/css" href="/app-assets/css/colors.css"/>
                <link rel="stylesheet" type="text/css" href="/app-assets/css/components.css"/>
                <link rel="stylesheet" type="text/css" href="/app-assets/css/core/menu/menu-types/horizontal-menu.css"/>
                <link rel="stylesheet" type="text/css" href="/app-assets/css/core/colors/palette-gradient.css"/>
                <link rel="stylesheet" type="text/css" href="/assets/css/style.css"/>
            </Head>
            <Nav />
            <MainMenu />

            <div className="app-content container center-layout mt-2">
                <div className="content-overlay"></div>
                <div className="content-wrapper">
                    <div className="content-header row">
                    </div>
                    <div className="content-body">{children}</div>
                </div>
            </div>

            {/*<div className="sidenav-overlay"></div>*/}
            {/*<div className="drag-target"></div>*/}
            <Footer/>
            <script src="/app-assets/vendors/js/vendors.min.js"></script>
            <script src="/app-assets/vendors/js/ui/jquery.sticky.js"></script>
            {/*<script src="/app-assets/vendors/js/charts/jquery.sparkline.min.js"></script>*/}
            {/*<script src="/app-assets/vendors/js/extensions/jquery.knob.min.js"></script>*/}
            {/*<script src="/app-assets/js/scripts/extensions/knob.js"></script>*/}
            {/*<script src="/app-assets/vendors/js/charts/raphael-min.js"></script>*/}
            {/*<script src="/app-assets/vendors/js/charts/morris.min.js"></script>*/}
            {/*<script src="/app-assets/vendors/js/charts/jvector/jquery-jvectormap-2.0.3.min.js"></script>*/}
            {/*<script src="/app-assets/vendors/js/charts/jvector/jquery-jvectormap-world-mill.js"></script>*/}
            {/*<script src="/app-assets/data/jvector/visitor-data.js"></script>*/}
            {/*<script src="/app-assets/vendors/js/charts/chart.min.js"></script>*/}
            <script src="/app-assets/vendors/js/charts/jquery.sparkline.min.js"></script>
            {/*<script src="/app-assets/vendors/js/extensions/unslider-min.js"></script>*/}
            <link rel="stylesheet" type="text/css" href="/app-assets/css/core/colors/palette-climacon.css"/>
            <link rel="stylesheet" type="text/css" href="/app-assets/fonts/simple-line-icons/style.min.css"/>

            <script src="/app-assets/js/core/app-menu.js"></script>
            <script src="/app-assets/js/core/app.js"></script>

            <script src="/app-assets/js/scripts/ui/breadcrumbs-with-stats.js"></script>
        </React.Fragment>
    );
}

// export default withAuth(CommonLayout);
export default withoutAuth(CommonLayout);
