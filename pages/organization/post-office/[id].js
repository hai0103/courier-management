import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import cookies from "next-cookies";
import {PostOfficeApi} from "services/postOffice";
import {AddressInfoProvider} from "providers/addressInfoProvider";
import PostOfficeForm from "../../../components/postOfficeManagement/components/postOfficeForm";
import {AddressApi} from "services/address";

export default function DetailPostOfficePage(props) {
    return (
      <React.Fragment>
        <Head>
          <title>Quản lý bưu cục</title>
        </Head>
        <AddressInfoProvider>
          <PostOfficeForm {...props} />
        </AddressInfoProvider>
      </React.Fragment>
    );
}

export async function getServerSideProps(router) {
    try {
        const {id} = router.query;
        // eslint-disable-next-line no-prototype-builtins
        const readOnly = router.query.hasOwnProperty('readOnly');

        const detailResponse = await PostOfficeApi.findById(id, true,
            {Authorization: `Bearer ${cookies(router).access_token || ''}`});
        const detail = Response.getAPIData(detailResponse);

      const provincesResponse = await AddressApi.getProvinces();
      const provinces = Response.getAPIData(provincesResponse);

        return {
            props: {
                id,
                detail,
                readOnly,
              provinces: provinces || [],
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

DetailPostOfficePage.Layout = CommonLayout;
DetailPostOfficePage.Href = ROUTES.POST_OFFICE;
DetailPostOfficePage.Title = 'Quản lý bưu cục';
