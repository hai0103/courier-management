import {ROUTES} from "constants/common";
import Head from "next/head";
import React from "react";
import {Response} from "utils/common";
import {title, trans} from "utils/helpers";
import CommonLayout from "layouts/commonLayout";
import OrderForm from "../../../components/orderManagement/components/orderForm";
import cookies from "next-cookies";
import {PostOfficeApi} from "services/postOffice";
import {AddressInfoProvider} from "providers/addressInfoProvider";
import {AddressApi} from "services/address";
import {UserTypeApi} from "services/userType";

export default function CreateOrderPage(props) {
    return (
        <React.Fragment>
            <Head>
                <title>Quản lý đơn hàng</title>
            </Head>
          <AddressInfoProvider>
            <OrderForm {...props} />
          </AddressInfoProvider>
        </React.Fragment>
    );
}

export async function getServerSideProps(context) {
  let postOffices = [], roles = [], provinces = []

  try {
    const postOfficesResponse = await PostOfficeApi.getAll();
    postOffices = Response.getAPIData(postOfficesResponse) || [];

  } catch (e) {
    console.log(e);
  }

  try {
    const provincesResponse = await AddressApi.getProvinces();
    provinces = Response.getAPIData(provincesResponse) || [];

  } catch (e) {
    console.log(e);
  }

  try {
    const roleResponse = await UserTypeApi.getAll();
    roles = Response.getAPIData(roleResponse) || [];

  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      postOffices,
      roles,
      provinces,
    }
  };
}

CreateOrderPage.Layout = CommonLayout;
CreateOrderPage.Href = ROUTES.CRM_ORDER;
CreateOrderPage.Title = 'Quản lý đơn hàng';
