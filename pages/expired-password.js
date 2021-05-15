import React from "react";
import Head from "next/head";
import ExpiredPassword from "../components/expiredPassword";

export default function ChangePasswordPage(props) {
  return (
    <React.Fragment>
      <Head>
        <title>Đổi mật khẩu</title>
      </Head>

      <ExpiredPassword {...props} />
    </React.Fragment>
  );
}

export async function getServerSideProps(router) {
    return {
        props: {
        }
    };
}
