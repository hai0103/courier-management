import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import {AddressInfoProvider} from "providers/addressInfoProvider";
import EstimatePostage from "../../../components/estimatePostage";

export default function EstimatePostagePage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Ước tính cước phí</title>
      </Head>
      <AddressInfoProvider>
        <EstimatePostage {...props}/>
      </AddressInfoProvider>
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

EstimatePostagePage.Layout = CommonLayout;
EstimatePostagePage.Title = 'Ước tính cước phí';
EstimatePostagePage.Href = ROUTES.CRM_PACKAGE;
