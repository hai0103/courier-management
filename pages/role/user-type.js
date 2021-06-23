import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import {DataTableProvider} from "providers/dataTable";
import UserTypeManagement from "../../components/roleAndPermission/userType";

export default function UserTypeManagementPage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Loại người dùng - Vai trò</title>
      </Head>
      <DataTableProvider>
        <UserTypeManagement {...props} isStaff={false}/>
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

UserTypeManagementPage.Layout = CommonLayout;
UserTypeManagementPage.Title = 'Loại người dùng - Vai trò';
UserTypeManagementPage.Href = ROUTES.USER_TYPE;
