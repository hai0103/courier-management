import React, { useState } from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import { title, trans } from "utils/helpers";
import { ROUTES } from "constants/common";
import { AddressApi } from "services/address";
import cookies from "next-cookies";
import { Response } from "utils/common";
import ReinsuranceClassForm from "../../components/reinsuranceClassManagement/components/reinsuranceClassForm";

export default function ReinsuranceClassDetailPage(props) {

  return (
    <React.Fragment>
      <Head>
        <title>{title('reinsuranceClassManagement.headerDetail')}</title>
      </Head>
          <ReinsuranceClassForm {...props}/>
    </React.Fragment>
  );
}

export async function getServerSideProps(router) {
  try {
    const {id} = router.query;
    const readOnly = router.query.hasOwnProperty('readOnly');

    // const detailResponse = await ReinsuranceApi.findById(id, true,
    //   {
    //     Authorization: `Bearer ${cookies(router).access_token || ''}`
    //   });
    // const detail = Response.getAPIData(detailResponse) || {};

    return {
      props: {
        id,
        readOnly,
        detail: {},
      }
    };
  } catch (e) {
    console.log(e);
  }

  return {
    props: {}
  }
}

ReinsuranceClassDetailPage.Layout = CommonLayout;
ReinsuranceClassDetailPage.Href = ROUTES.REINSURANCE_CLASS;
ReinsuranceClassDetailPage.Title = trans('reinsuranceClassManagement.headerDetail');
