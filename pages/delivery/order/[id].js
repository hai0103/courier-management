import React from "react";
import Head from "next/head";
import UserForm from "components/userManagement/components/userForm";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {UserApi} from "services/user";
import {ROUTES} from "constants/common";
import cookies from "next-cookies";
import {PostOfficeApi} from "services/postOffice";
import {AddressInfoProvider} from "providers/addressInfoProvider";
import OrderDetail from "../../../components/orderManagement/components/orderDetail";
import {OrderApi} from "services/order";
import {AddressApi} from "services/address";

export default function OrderDetailPage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Quản lý đơn hàng</title>
      </Head>
      <AddressInfoProvider>
        <OrderDetail {...props} />
      </AddressInfoProvider>
    </React.Fragment>
  );
}

export async function getServerSideProps(router) {
  try {
    const {id} = router.query;
    // eslint-disable-next-line no-prototype-builtins
    const readOnly = router.query.hasOwnProperty('readOnly');
    const postOfficesResponse = await PostOfficeApi.getAll({
        pageSize: 500,
        pageNumber: 0,
        sort: [{
          key: "companyNameSort",
          asc: true
        }],
      }, true, {
        Authorization: `Bearer ${cookies(router).access_token || ''}`
      }
    );

    const postOffices = Response.getAPIData(postOfficesResponse);

    const orderDetailResponse = await OrderApi.findById(id, true,
      {Authorization: `Bearer ${cookies(router).access_token || ''}`});
    const detail = Response.getAPIData(orderDetailResponse);

    const provincesResponse = await AddressApi.getProvinces();
    const provinces = Response.getAPIData(provincesResponse) || [];

    // const roleResponse = await DecentralizationApi.getSystemRoles({}, true, {
    //     Authorization: `Bearer ${cookies(router).access_token || ''}`
    // });
    // const roles = Response.getAPIData(roleResponse);

    return {
      props: {
        id,
        postOffices: postOffices,
        provinces: provinces,
        detail,
        readOnly,
        isDealer: false
        // roles
      }
    };
  } catch (e) {
    console.log(e);
  }

  return {
    props: {}
  }
}

OrderDetailPage.Layout = CommonLayout;
OrderDetailPage.Href = ROUTES.ORDER;
OrderDetailPage.Title = 'Quản lý đơn hàng';
