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
  try {
    const {id} = router.query;
    // eslint-disable-next-line no-prototype-builtins
    const readOnly = router.query.hasOwnProperty('readOnly');
    const postOfficesResponse = await PostOfficeApi.getAll({
        pageSize: 500,
        pageNumber: 0,
        sort: [{
          key: "companyNameSort",
          asc: true
        }],
      }, true, {
        Authorization: `Bearer ${cookies(router).access_token || ''}`
      }
    );

    const postOffices = Response.getAPIData(postOfficesResponse);

    const userDetailResponse = await UserApi.findById(id, true,
      {Authorization: `Bearer ${cookies(router).access_token || ''}`});
    const detail = Response.getAPIData(userDetailResponse);

    // const roleResponse = await DecentralizationApi.getSystemRoles({}, true, {
    //     Authorization: `Bearer ${cookies(router).access_token || ''}`
    // });
    // const roles = Response.getAPIData(roleResponse);

    return {
      props: {
        id,
        postOffices: postOffices,
        detail,
        readOnly,
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

EmployeeDetailPage.Layout = CommonLayout;
EmployeeDetailPage.Href = ROUTES.EMPLOYEE;
EmployeeDetailPage.Title = 'Quản lý nhân viên';
