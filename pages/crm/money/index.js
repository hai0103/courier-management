import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import {DataTableProvider} from "providers/dataTable";
import MoenyManagement from "../../../components/infoOfDealerManagement/money";

export default function MoneyManagementPage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Quản lý tiền hàng</title>
      </Head>
      <DataTableProvider>
        <MoenyManagement {...props} isStaff={false}/>
      </DataTableProvider>
    </React.Fragment>
  );
}

export async function getServerSideProps() {
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

MoneyManagementPage.Layout = CommonLayout;
MoneyManagementPage.Title = 'Quản lý tiền hàng';
MoneyManagementPage.Href = ROUTES.CRM_PACKAGE;
