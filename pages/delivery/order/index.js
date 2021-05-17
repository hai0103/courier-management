import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import OrderManagement from "../../../components/orderManagement";

export default function OrdersManagementPage(props) {
    return (
        <React.Fragment>
            <Head>
                <title>Quản lý đơn hàng - vận đơn</title>
            </Head>
            <OrderManagement {...props}/>
        </React.Fragment>
    );
}

export async function getServerSideProps(context) {
    let provinces = []

    try {
        const provincesResponse = await AddressApi.getProvinces();
        provinces = Response.getAPIData(provincesResponse) || [];

    } catch (e) {
        console.log(e)
    }

    return {
        props: {
            provinces: provinces || [],
        }
    };
}

OrdersManagementPage.Layout = CommonLayout;
OrdersManagementPage.Title = 'Quản lý đơn hàng - vận đơn';
OrdersManagementPage.Href = ROUTES.ORDER;
