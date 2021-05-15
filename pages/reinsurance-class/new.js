import {ROUTES} from "constants/common";
import Head from "next/head";
import React from "react";
import {title, trans} from "utils/helpers";
import CommonLayout from "layouts/commonLayout";
import ReinsuranceClassForm from "../../components/reinsuranceClassManagement/components/reinsuranceClassForm";

export default function NewReinsuranceClassPage(props) {
    return (
        <React.Fragment>
            <Head>
                <title>{title('reinsuranceClassManagement.headerTitle')}</title>
            </Head>

            <ReinsuranceClassForm {...props} />
        </React.Fragment>
    );
}

export async function getServerSideProps(context) {
    try {

    } catch (e) {
        console.log(e);
    }

    return {
        props: {}
    }
}

NewReinsuranceClassPage.Layout = CommonLayout;
NewReinsuranceClassPage.Href = ROUTES.REINSURANCE_CLASS;
NewReinsuranceClassPage.Title = trans('reinsuranceClassManagement.headerTitle');

