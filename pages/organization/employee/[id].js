import React from "react";
import Head from "next/head";
import UserForm from "components/userManagement/components/userForm";
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

export default function EmployeeDetailPage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Quản lý nhân viên</title>
      </Head>
      <AddressInfoProvider>
        <UserForm {...props}/>
      </AddressInfoProvider>
    </React.Fragment>
  );
}

export async function getServerSideProps(router) {
  const {id} = router.query;
  // eslint-disable-next-line no-prototype-builtins
  const readOnly = router.query.hasOwnProperty('readOnly');
  let detail = {}
  let postOffices = [], roles = [], provinces = []

  try {
    const postOfficesResponse = await PostOfficeApi.getAll();

    postOffices = Response.getAPIData(postOfficesResponse) || [];

  } catch (e) {
    console.log(e);
  }

  try {
    const userDetailResponse = await UserApi.findById(id);
    detail = Response.getAPIData(userDetailResponse);

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
      id,
      postOffices,
      detail,
      provinces,
      readOnly,
      roles
    }
  };
}

EmployeeDetailPage.Layout = CommonLayout;
EmployeeDetailPage.Href = ROUTES.EMPLOYEE;
EmployeeDetailPage.Title = 'Quản lý nhân viên';
