import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import PostOfficeManagement from "../../../components/postOfficeManagement";

export default function PostOfficesManagementPage(props) {
    return (
        <React.Fragment>
            <Head>
                <title>Quản lý bưu cục</title>
            </Head>
            <PostOfficeManagement {...props}/>
        </React.Fragment>
    );
}

export async function getServerSideProps(context) {
    try {
        const provincesResponse = await AddressApi.getProvinces();
        const provinces = Response.getAPIData(provincesResponse);

        return {
            props: {
                provinces: provinces || [],
            }
        };

    } catch (e) {
        console.log(e)
    }

    return {
        props: {}
    };
}

PostOfficesManagementPage.Layout = CommonLayout;
PostOfficesManagementPage.Title = 'Quản lý bưu cục';
PostOfficesManagementPage.Href = ROUTES.POST_OFFICE;
