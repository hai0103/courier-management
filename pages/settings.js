import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import Maintenance from "../components/maintenance";
import {useTranslation} from "react-i18next";
import {trans} from "utils/helpers";
import HomePage from "./index";

function SettingsPage() {
    const {t} = useTranslation('common');
    return (
        <React.Fragment>
            <Head>
                <title>{t('mainMenu.settings')}</title>
            </Head>
            <Maintenance/>
        </React.Fragment>
    );
}

SettingsPage.Layout = CommonLayout;
SettingsPage.Title = trans('mainMenu.settings');
export default SettingsPage;
