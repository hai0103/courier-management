import React from "react";
import Head from "next/head";
import CommonLayout from "layouts/commonLayout";
import {title, trans} from "utils/helpers";
import {ROUTES} from "constants/common";
import ReinsuranceForm from "../../components/reinsuranceManagement/components/reinsuranceForm";
import {AddressApi} from "services/address";
import cookies from "next-cookies";
import {Response} from "utils/common";
import {ReinsuranceApi} from "services/reinsurance";
import {CreditRatingApi} from "services/creditRating";

export default function ReinsuranceDetailPage(props) {
    return (
        <React.Fragment>
            <Head>
                <title>{title('reinsuranceManagement.headerDetail')}</title>
            </Head>
            <ReinsuranceForm {...props}/>
        </React.Fragment>
    );
}

export async function getServerSideProps(router) {
    try {
        const {id} = router.query;
        const readOnly = router.query.hasOwnProperty('readOnly');

        const detailResponse = await ReinsuranceApi.findById(id, true,
            {
                Authorization: `Bearer ${cookies(router).access_token || ''}`
            });
        const detail = Response.getAPIData(detailResponse) || {};

        const nationalitiesResponse = await AddressApi.getNationalities(true, {
            Authorization: `Bearer ${cookies(router).access_token || ''}`
        })
        const nationalities = Response.getAPIData(nationalitiesResponse)

        const ratingResponse = await ReinsuranceApi.getListRating(true, {
            Authorization: `Bearer ${cookies(router).access_token || ''}`
        })
        const ratingList = Response.getAPIData(ratingResponse)

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
                Authorization: `Bearer ${cookies(router).access_token || ''}`
            }
        );
        const companies = Response.getAPIData(companiesResponse) || [];

        const listReinsurance = await ReinsuranceApi.getListReinsurance({
                id: id,
                body:{
                    pageSize: 500,
                    pageNumber: 0,
                    sort: [{
                        key: "nameContactSort",
                        asc: true
                    }],
                }
            }, true, {
                Authorization: `Bearer ${cookies(router).access_token || ''}`
            }
        );
        const list = Response.getAPIData(listReinsurance) || [];

        const companiesRatingResponse = await CreditRatingApi.getListCompany(true, {
            Authorization: `Bearer ${cookies(router).access_token || ''}`
        })
        const companiesRating = Response.getAPIData(companiesRatingResponse);

        return {
            props: {
                id,
                readOnly,
                detail,
                nationalities,
                ratingList,
                companies: companies.content,
                listReinsurance: list,
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

ReinsuranceDetailPage.Layout = CommonLayout;
ReinsuranceDetailPage.Href = ROUTES.REINSURANCE;
ReinsuranceDetailPage.Title = trans('reinsuranceManagement.headerDetail');
