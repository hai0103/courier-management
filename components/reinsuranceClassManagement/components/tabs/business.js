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

function TabBusiness(props) {
    const {t} = useTranslation('common');


    return (
        <>
            <ContentWrapper>
                {

                }

            </ContentWrapper>
        </>
    );
}

TabBusiness.propTypes = {
    nations: PropTypes.array
};

TabBusiness.defaultProps = {
    nations: []
};

export default TabBusiness;
