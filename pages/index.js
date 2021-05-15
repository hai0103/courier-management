import Head from "next/head";
import React from "react";
import { useTranslation } from "react-i18next";
import CommonLayout from "layouts/commonLayout";
import Maintenance from "components/maintenance";
import { trans } from "utils/helpers";

function HomePage() {
    const {t} = useTranslation('common');
    return (
        <React.Fragment>
            <Head>
                <title>{t('mainMenu.dashboard')}</title>
            </Head>
            <Maintenance/>
        </React.Fragment>
    );
}

HomePage.Layout = CommonLayout;
HomePage.Title = trans('mainMenu.dashboard');
export default HomePage;
