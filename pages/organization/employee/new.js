import {ROUTES} from "constants/common";
import Head from "next/head";
import React from "react";
import {Response} from "utils/common";
import {title, trans} from "utils/helpers";
import CommonLayout from "layouts/commonLayout";
import CreateUser from "components/userManagement/components/userForm";
import cookies from "next-cookies";
import {PostOfficeApi} from "services/postOffice";
import {UserTypeApi} from "services/userType";
import {AddressApi} from "services/address";
import {AddressInfoProvider} from "providers/addressInfoProvider";

export default function CreateEmployeePage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Quản lý nhân viên</title>
      </Head>
      <AddressInfoProvider>
        <CreateUser {...props} />
      </AddressInfoProvider>
    </React.Fragment>
  );
}

export async function getServerSideProps(context) {
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
      roles,
      provinces
    }
  };
}

CreateEmployeePage.Layout = CommonLayout;
CreateEmployeePage.Href = ROUTES.EMPLOYEE;
CreateEmployeePage.Title = 'Quản lý nhân viên';
