import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import ConfigFormula from "../../../components/orderManagement/components/configFormula";
import {DataTableProvider} from "providers/dataTable";

export default function ConfigFormulaPage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Cấu hình cước phí</title>
      </Head>
      <DataTableProvider>
        <ConfigFormula {...props}/>
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

ConfigFormulaPage.Layout = CommonLayout;
ConfigFormulaPage.Title = 'Thiết lập cước phí';
ConfigFormulaPage.Href = ROUTES.CONFIG_FORMULA;
