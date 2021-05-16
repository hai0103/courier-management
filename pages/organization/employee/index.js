import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {Response} from "utils/common";
import {ROUTES} from "constants/common";
import cookies from "next-cookies";
import UserManagement from "components/userManagement";
import {PostOfficeApi} from "services/postOffice";
import {UserTypeApi} from "services/userType";

export default function EmployeesManagementPage(props) {
    return (
        <React.Fragment>
            <Head>
                <title>Quản lý nhân viên</title>
            </Head>
            <UserManagement {...props}/>
        </React.Fragment>
    );
}

export async function getServerSideProps(context) {
    try {
        const postOfficesResponse = await PostOfficeApi.getAll();

        const postOffices = Response.getAPIData(postOfficesResponse);

        const roleResponse = await UserTypeApi.getAll();
        const roles = Response.getAPIData(roleResponse);

        return {
            props: {
                postOffices: postOffices || [],
                roles: roles || []
            }
        };

    } catch (e) {
        // Response.handleErrorAPI(e, context)
    }

    return {
        props: {}
    };
}

EmployeesManagementPage.Layout = CommonLayout;
EmployeesManagementPage.Title = 'Quản lý nhân viên';
EmployeesManagementPage.Href = ROUTES.EMPLOYEE;
