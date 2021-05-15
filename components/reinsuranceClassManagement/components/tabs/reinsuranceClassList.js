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

function TabReinsuranceClassList(props) {
    const {t} = useTranslation('common');


    return (
        <>
            <ContentWrapper>
                {
                    <Link href={`${ROUTES.NEW_REINSURANCE_CLASS}?code=XG.1.1`}>
                        <button className="btn btn-primary btn-min-width">
                            {t('common.button.createNew')}
                        </button>
                    </Link>
                }

            </ContentWrapper>
        </>
    );
}

TabReinsuranceClassList.propTypes = {
    nations: PropTypes.array
};

TabReinsuranceClassList.defaultProps = {
    nations: []
};

export default TabReinsuranceClassList;
