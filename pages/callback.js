import React, {useEffect} from "react";
import Authentication from "services/authentication";
import {Utility} from "utils/common";
import {ROUTES} from "constants/common";
import Loading from "sharedComponents/loading";

export default function CallbackPage(props) {
    useEffect(() => {
        Authentication.loginSso(props.code).then(() => {
            Utility.redirect(ROUTES.HOME)
        });
    }, [])

    return (
        <Loading />
    );
}
CallbackPage.getInitialProps = function (router) {
    const {code} = router.query
    return {code};
}
