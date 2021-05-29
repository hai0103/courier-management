import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import OrderManagement from "../../../components/orderManagement";
import OrderListContainer from "../../../components/orderManagement/components/orderListContainer";
import {ProcessStatusApi} from "services/processStatus";

export default function OrdersManagementPage(props) {
    return (
        <React.Fragment>
            <Head>
                <title>Quản lý đơn hàng - vận đơn</title>
            </Head>
            <OrderListContainer {...props}/>
        </React.Fragment>
    );
}

export async function getServerSideProps(context) {
    let provinces = [], processStatus = []

    try {
        const provincesResponse = await AddressApi.getProvinces();
        provinces = Response.getAPIData(provincesResponse) || [];

    } catch (e) {
        console.log(e)
    }

    try {
        const processStatusResponse = await ProcessStatusApi.getList();
        processStatus = Response.getAPIData(processStatusResponse) || [];

    } catch (e) {
        console.log(e)
    }

    return {
        props: {
            provinces: provinces || [],
            processStatus: [
                {
                    id: 0,
                    code: 0,
                    name: 'Tất cả'
                },
                ...processStatus
            ] || [],
        }
    };
}

OrdersManagementPage.Layout = CommonLayout;
OrdersManagementPage.Title = 'Quản lý đơn hàng - vận đơn';
OrdersManagementPage.Href = ROUTES.ORDER;
