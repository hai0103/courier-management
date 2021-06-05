import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import DealerAddressManagement from "../../../components/infoOfDealerManagement/address";
import {DataTableProvider} from "providers/dataTable";

export default function DealerAddressManagementPage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Sổ địa chỉ</title>
      </Head>
      <DataTableProvider>
        <DealerAddressManagement {...props} isStaff={false}/>
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

DealerAddressManagementPage.Layout = CommonLayout;
DealerAddressManagementPage.Title = 'Sổ địa chỉ';
DealerAddressManagementPage.Href = ROUTES.CRM_ADDRESS;
