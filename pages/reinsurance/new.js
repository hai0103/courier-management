import {ROUTES} from "constants/common";
import Head from "next/head";
import React from "react";
import {title, trans} from "utils/helpers";
import CommonLayout from "layouts/commonLayout";
import {Response} from "utils/common";
import ReinsuranceForm from "components/reinsuranceManagement/components/reinsuranceForm";
import {AddressApi} from "services/address";
import {ReinsuranceApi} from "services/reinsurance";
import cookies from "next-cookies";
import {CreditRatingApi} from "services/creditRating";

export default function NewReinsurancePage(props) {
    return (
        <React.Fragment>
            <Head>
                <title>{title('reinsuranceManagement.headerTitle')}</title>
            </Head>

            <ReinsuranceForm {...props} />
        </React.Fragment>
    );
}

export async function getServerSideProps(context) {
    try {
        const nationalitiesResponse = await AddressApi.getNationalities(true, {
            Authorization: `Bearer ${cookies(context).access_token || ''}`
        })
        const nationalities = Response.getAPIData(nationalitiesResponse)

        const ratingResponse = await ReinsuranceApi.getListRating(true, {
            Authorization: `Bearer ${cookies(context).access_token || ''}`
        })
        const ratingList = Response.getAPIData(ratingResponse)

        const companiesRatingResponse = await CreditRatingApi.getListCompany(true, {
            Authorization: `Bearer ${cookies(context).access_token || ''}`
        })
        const companiesRating = Response.getAPIData(companiesRatingResponse);

        const companiesResponse = await ReinsuranceApi.getList({
                pageSize: 500,
                pageNumber: 0,
                type: null,
                status: null,
                keyword:"",
                sort: [{
                    key: "reinsuranceNameSort",
                    asc: true
                }],
            }, true, {
                Authorization: `Bearer ${cookies(context).access_token || ''}`
            }
        );
        const companies = Response.getAPIData(companiesResponse) || [];

        return {
            props: {
                nationalities,
                ratingList,
                companies: companies.content,
                companiesRating
            }
        };
    } catch (e) {
        console.log(e);
    }

    return {
        props: {}
    }
}

NewReinsurancePage.Layout = CommonLayout;
NewReinsurancePage.Href = ROUTES.REINSURANCE;
NewReinsurancePage.Title = trans('reinsuranceManagement.headerTitle');

