import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import {AddressInfoProvider} from "providers/addressInfoProvider";
import EstimatePostage from "../../../components/estimatePostage";
import SearchPostOffice from "../../../components/searchPostOffice";

export default function SearchPostOfficePage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Tra cứu bưu cục</title>
      </Head>
      <AddressInfoProvider>
        <SearchPostOffice {...props}/>
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

SearchPostOfficePage.Layout = CommonLayout;
SearchPostOfficePage.Title = 'Tra cứu bưu cục';
SearchPostOfficePage.Href = ROUTES.CRM_PACKAGE;
