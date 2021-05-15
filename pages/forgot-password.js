import React from "react";
import Head from "next/head";
import ForgotPassword from "../components/forgotPassword";
export default function ForgotPasswordPage() {
  return (
    <React.Fragment>
      <Head>
        <title>Quên mật khẩu</title>
      </Head>

      <ForgotPassword/>
    </React.Fragment>
  );
}
