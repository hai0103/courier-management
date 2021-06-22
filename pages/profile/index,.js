import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {UserApi} from "services/user";
import {ROUTES} from "constants/common";
import cookies from "next-cookies";
import {PostOfficeApi} from "services/postOffice";
import {AddressInfoProvider} from "providers/addressInfoProvider";
import {UserTypeApi} from "services/userType";
import {AddressApi} from "services/address";
import ProfileForm from "../../components/profile";
import {getUserProfile} from "utils/localStorage";

export default function ProfilePage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Thông tin cá nhân</title>
      </Head>
      <AddressInfoProvider>
        <ProfileForm {...props}/>
      </AddressInfoProvider>
    </React.Fragment>
  );
}

export async function getServerSideProps(router) {
  // eslint-disable-next-line no-prototype-builtins
  const readOnly = router.query.hasOwnProperty('readOnly');
  let postOffices = [], roles = [], provinces = []

  try {
    const postOfficesResponse = await PostOfficeApi.getAll();

    postOffices = Response.getAPIData(postOfficesResponse) || [];

  } catch (e) {
    console.log(e);
  }

  try {
    const provincesResponse = await AddressApi.getProvinces();
    provinces = Response.getAPIData(provincesResponse) || [];

  } catch (e) {
    console.log(e);
  }

  try {
    const roleResponse = await UserTypeApi.getAll();
    roles = Response.getAPIData(roleResponse) || [];

  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      postOffices,
      provinces,
      readOnly,
      roles
    }
  };
}

ProfilePage.Layout = CommonLayout;
ProfilePage.Href = ROUTES.PROFILE;
ProfilePage.Title = 'Thông tin cá nhân';
