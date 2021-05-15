import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import ReinsuranceClassManagement from "../../components/reinsuranceClassManagement";
import {AddressApi} from "services/address";
import cookies from "next-cookies";

export default function ReinsuranceClassPage(props) {
    return (
        <React.Fragment>
            <Head>
                <title>{title('reinsuranceClassManagement.headerTitle')}</title>
            </Head>
            <ReinsuranceClassManagement {...props}/>
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

ReinsuranceClassPage.Layout = CommonLayout;
ReinsuranceClassPage.Href = ROUTES.REINSURANCE_CLASS;
ReinsuranceClassPage.Title = trans('reinsuranceClassManagement.headerTitle');
