import React, {useEffect, useState} from 'react';
import {UserApi} from "services/user";
import {Response} from "utils/common";
import {useIsAuthenticated} from "providers/auth";
import {includes} from "lodash";
import {SERVICE_STATUS_CODE} from "globalConstants/common";
import Forbidden from "sharedComponents/forbidden";

const AccessControlContext = React.createContext({});

export const AccessControlProvider = ({children, deniedPermissions}) => {
    const isAuthenticated = useIsAuthenticated()
    const [permissions, setPermission] = useState([])
    const [isForbidden, setIsForbidden] = useState(false)

    const permissionGate = (userPermissions, deniedPermissions = []) => {
        let isAllowed = true;
        if (deniedPermissions.length) {
            deniedPermissions.forEach(p => {
                isAllowed = includes(userPermissions, p)

                if (!isAllowed) {
                    setIsForbidden(true)
                }
            })
        }
    }

    if (isAuthenticated) {
        // useEffect(() => {
            // UserApi.getPermissions().then(res => {
            //     const userPermissions = Response.getAPIData(res);
            //     setPermission(userPermissions || [])
            //
            //     if (deniedPermissions) {
            //         permissionGate(userPermissions, deniedPermissions)
            //     }
            // }).catch((error) => {
            //     // if (error.response.status === SERVICE_STATUS_CODE.FORBIDDEN) {
            //     //     setIsForbidden(true)
            //     // }
            //
            //     console.error('Can not get user permissions when logged in')
            // })
        // }, [])
    }

    return (
        <AccessControlContext.Provider
            value={{
                permissions
            }}
        >
            {
                // isForbidden ? <Forbidden /> : children
                children
            }
        </AccessControlContext.Provider>
    );
};

export function useAccessControlContext() {
    const context = React.useContext(AccessControlContext);
    if (context === undefined) {
        throw new Error('useAccessControlContext must be used within an AccessControlProvider');
    }
    return context;
}

export function useGate() {
    const context = useAccessControlContext();
    const allows = (permission) => {
        return includes(context.permissions, permission)
    }

    return [allows]
}
