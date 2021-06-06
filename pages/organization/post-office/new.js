import {ROUTES} from "constants/common";
import Head from "next/head";
import React from "react";
import {Response} from "utils/common";
import {title, trans} from "utils/helpers";
import CommonLayout from "layouts/commonLayout";
import {AddressInfoProvider} from "providers/addressInfoProvider";
import {AddressApi} from "services/address";
import PostOfficeForm from "../../../components/postOfficeManagement/components/postOfficeForm";

export default function CreatePostOfficePage(props) {
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
export async function getServerSideProps() {
  try {
    const provincesResponse = await AddressApi.getProvinces();
    const provinces = Response.getAPIData(provincesResponse);

    return {
      props: {
        provinces: provinces || [],
      }
    };

  } catch (e) {
    console.log(e)
  }

  return {
    props: {}
  };
}

CreatePostOfficePage.Layout = CommonLayout;
CreatePostOfficePage.Href = ROUTES.POST_OFFICE;
CreatePostOfficePage.Title = 'Quản lý bưu cục';
