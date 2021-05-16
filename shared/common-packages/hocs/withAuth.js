import withAuthRedirect from './withAuthRedirect';
import {AUTH_LOGIN_SERVICE_URI, LOGIN_SERVICE_URI} from "globalConstants/serviceUri";
import { ROUTES } from 'constants/common';

/**
 * Require the user to be authenticated in order to render the component.
 * If the user isn't authenticated, forward to the given URL.
 */
export default function withAuth(WrappedComponent, location = ROUTES.LOGIN) {
    return withAuthRedirect({
        WrappedComponent,
        location,
        expectedAuth: true
    });
}
