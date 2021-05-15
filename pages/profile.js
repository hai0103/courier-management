import React from "react";
import Head from "next/head";
import Profile from "components/profile";
import CommonLayout from "layouts/commonLayout";
export default function ProfilePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Profile Page</title>
      </Head>

      <Profile/>
    </React.Fragment>
  );
}

ProfilePage.Layout = CommonLayout
