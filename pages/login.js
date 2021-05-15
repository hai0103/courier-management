import React from "react";
import Head from "next/head";
import Login from "components/login";
export default function LoginPage() {
    return (
    <React.Fragment>
      <Head>
        <title>Login Page</title>
      </Head>
      <Login/>
    </React.Fragment>
  );
}
