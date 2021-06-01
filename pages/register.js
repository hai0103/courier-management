import React from "react";
import Head from "next/head";
import Register from "components/register";

export default function RegisterPage() {
  return (
    <React.Fragment>
      <Head>
        <title>Đăng ký</title>
      </Head>

      <Register/>
    </React.Fragment>
  );
}
