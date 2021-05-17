import {ROUTES} from "constants/common";
import Head from "next/head";
import React from "react";
import {Response} from "utils/common";
import {title, trans} from "utils/helpers";
import CommonLayout from "layouts/commonLayout";
import CreateUser from "components/userManagement/components/userForm";
import cookies from "next-cookies";
import {PostOfficeApi} from "services/postOffice";
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
    try {
        const postOfficesResponse = await PostOfficeApi.getAll({
                pageSize: 500,
                pageNumber: 0,
                sort: [{
                    key: "companyNameSort",
                    asc: true
                }],
            }, true, {
                Authorization: `Bearer ${cookies(context).access_token || ''}`
            }
        );
        const postOffices = Response.getAPIData(postOfficesResponse);
        return {
            props: {
                postOffices: postOffices,
            }
        };
    } catch (e) {
        console.log(e);
    }

    return {
        props: {}
    }
}

CreateEmployeePage.Layout = CommonLayout;
CreateEmployeePage.Href = ROUTES.EMPLOYEE;
CreateEmployeePage.Title = 'Quản lý nhân viên';
