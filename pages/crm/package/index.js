import React, {useEffect, useState} from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import {getUserProfile} from "utils/localStorage";
import DealerPackageManagement from "../../../components/infoOfDealerManagement/package";

export default function DealerPackageManagementPage(props) {
  const [loggedUser, setLoggedUser] = useState({});
  useEffect(() => {
    const _loggedUser = getUserProfile();
    setLoggedUser(_loggedUser)

  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Gói hàng đã lưu</title>
      </Head>
      <DealerPackageManagement {...props} userId={loggedUser?.id} isStaff={false}/>
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

DealerPackageManagementPage.Layout = CommonLayout;
DealerPackageManagementPage.Title = 'Gói hàng đã lưu';
DealerPackageManagementPage.Href = ROUTES.CRM_PACKAGE;
