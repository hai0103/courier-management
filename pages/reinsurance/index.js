import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import ReinsuranceManagement from "../../components/reinsuranceManagement";
import {AddressApi} from "services/address";
import cookies from "next-cookies";

export default function ReinsurancePage(props) {
    return (
        <React.Fragment>
            <Head>
                <title>{title('reinsuranceManagement.headerTitle')}</title>
            </Head>
            <ReinsuranceManagement {...props}/>
        </React.Fragment>
    );
}

export async function getServerSideProps(context) {
    try {
        const nationsResponse = await AddressApi.getNationalities(true, {
            Authorization: `Bearer ${cookies(context).access_token || ''}`
        })
        const nations = Response.getAPIData(nationsResponse);

        return {
            props: {
                nations
            }
        }
    } catch (e) {
        console.log(e);
    }

    return {
        props: {}
    }

}

ReinsurancePage.Layout = CommonLayout;
ReinsurancePage.Href = ROUTES.REINSURANCE;
ReinsurancePage.Title = trans('reinsuranceManagement.headerTitle');
