import React, {useEffect, useState} from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import {AddressApi} from "services/address";
import DealerReceiverManagement from "../../../components/infoOfDealerManagement/receiver";
import {getUserProfile} from "utils/localStorage";

export default function DealerReceiverManagementPage(props) {
  const [loggedUser, setLoggedUser] = useState({});
  useEffect(() => {
    const _loggedUser = getUserProfile();
    setLoggedUser(_loggedUser)

  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Người nhận quen</title>
      </Head>
      <DealerReceiverManagement {...props} userId={loggedUser?.id} isStaff={false}/>
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

DealerReceiverManagementPage.Layout = CommonLayout;
DealerReceiverManagementPage.Title = 'Người nhận quen';
DealerReceiverManagementPage.Href = ROUTES.CRM_RECEIVER;
