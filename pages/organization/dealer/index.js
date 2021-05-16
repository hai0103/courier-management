import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import cookies from "next-cookies";
import UserManagement from "components/userManagement";
import {PostOfficeApi} from "services/postOffice";
import {UserTypeApi} from "services/userType";

export default function DealersManagementPage(props) {
    return (
        <React.Fragment>
            <Head>
                <title>Quản lý khách hàng - người gửi</title>
            </Head>
            <UserManagement {...props}/>
        </React.Fragment>
    );
}

export async function getServerSideProps(context) {
    try {
        const postOfficesResponse = await PostOfficeApi.getAll();

        const postOffices = Response.getAPIData(postOfficesResponse);

        const roleResponse = await UserTypeApi.getAll();
        const roles = Response.getAPIData(roleResponse);

        return {
            props: {
                postOffices: postOffices || [],
                roles: roles || [],
                isDealer: true
            }
        };

    } catch (e) {
        // Response.handleErrorAPI(e, context)
    }

    return {
        props: {}
    };
}

DealersManagementPage.Layout = CommonLayout;
DealersManagementPage.Title = 'Quản lý khách hàng - người gửi';
DealersManagementPage.Href = ROUTES.DEALER;
