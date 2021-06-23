import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response, Utility} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import {DataTableProvider} from "providers/dataTable";
import PermissionManagement from "../../components/roleAndPermission/permission";
import {DecentralizationApi} from "services/decentralization";
import {PermissionApi} from "services/permission";

export default function PermissionManagementPage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Phân quyền</title>
      </Head>
      <DataTableProvider>
        <PermissionManagement {...props} isStaff={false}/>
      </DataTableProvider>
    </React.Fragment>
  );
}

export async function getServerSideProps() {
  let provinces = [], roles = [], permissions = []

  try {
    const provincesResponse = await AddressApi.getProvinces();
    provinces = Response.getAPIData(provincesResponse) || [];

  } catch (e) {
    console.log(e)
  }
  try {
    const roleResponse = await PermissionApi.getSystemRoles();
    roles = Response.getAPIData(roleResponse);

    const permissionResponse = await PermissionApi.getPermissionFrame();
    permissions = Response.getAPIData(permissionResponse);

  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      provinces: provinces || [],
      roles,
      permissions
    }
  };
}

PermissionManagementPage.Layout = CommonLayout;
PermissionManagementPage.Title = 'Phân quyền';
PermissionManagementPage.Href = ROUTES.PERMISSION;
