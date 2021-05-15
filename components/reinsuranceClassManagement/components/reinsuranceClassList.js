import {ROUTES} from "constants/common";
import Link from "next/link";
import PropTypes from "prop-types";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";
import {Response} from "utils/common";
import ContentWrapper from "layouts/contentWrapper";
import Tab from "sharedComponents/tab";
import Badge from "sharedComponents/blocks/badge";
import DataTable from "sharedComponents/dataTable";
import More from "sharedComponents/more";
import SocketHelpers from "utils/socketHelpers";
import {useSocket} from "providers/socket";
import {useDataTable} from "providers/dataTable";
import {FormProvider} from "react-hook-form";
import TabReinsuranceClassList from "./tabs/reinsuranceClassList";
import TabBusiness from "./tabs/business";

function ReinsuranceClassList(props) {
    const {t} = useTranslation('common');


    const filterTab = () => {
        const tabList = [
            {
                name: t("reinsuranceClassManagement.tabReinsuranceClassList.title"),
                child: <TabReinsuranceClassList/>
            },
            {
                name: t("reinsuranceClassManagement.tabBusiness.title"),
                child: <TabBusiness/>
            },
        ]

        return tabList

    }


    return (
        <>
            <Tab content={filterTab()}/>
        </>
    );
}

ReinsuranceClassList.propTypes = {
    nations: PropTypes.array
};

ReinsuranceClassList.defaultProps = {
    nations: []
};

export default ReinsuranceClassList;
