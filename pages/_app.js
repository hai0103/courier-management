import i18next from "i18next";
import {GlobalProvider} from "providers/global";
import React, {useEffect} from "react";
import "react-datepicker/dist/react-datepicker.css";
import {I18nextProvider} from "react-i18next";
import {ToastProvider} from 'react-toast-notifications';
import "style/scss/core/bootstrap.scss";
import "style/scss/core/bootstrap-extended.scss";
import "style/scss/core/colors.scss";
import "style/scss/font-awesome/css/all.min.css";
import "style/scss/core/plugins/animate/animate.scss";
import "style/scss/style.scss";
import 'icheck/skins/all.css';
import OutsideLayout from "layouts/outsideLayout";
import 'i18n';
import {AuthProvider} from "providers/auth";
import {SocketProvider} from "providers/socket";
import {AccessControlProvider} from "providers/accessControl";
import {SYSTEM_PERMISSIONS} from "../constants/common";

function Default({Component, pageProps}) {
    const Layout = Component.Layout ? Component.Layout : OutsideLayout;
    return (
        <AuthProvider>
            <AccessControlProvider deniedPermissions={[]}>
                <I18nextProvider i18n={i18next}>
                    <ToastProvider autoDismiss autoDismissTimeout={1000} placement="bottom-right">
                        <GlobalProvider data={{
                            headerTitle: Component.Title || '',
                            headerHref: Component.Href || '#'
                        }}>
                            <Layout>
                                <SocketProvider>
                                    <Component {...pageProps} />
                                </SocketProvider>
                            </Layout>
                        </GlobalProvider>
                    </ToastProvider>
                </I18nextProvider>
            </AccessControlProvider>
        </AuthProvider>
    );
}

export default Default
