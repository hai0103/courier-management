import React, {useEffect, useState} from 'react';
import SocketHelpers from "utils/socketHelpers";
import {useToasts} from "react-toast-notifications";
import {useSocket} from "providers/socket";

const GlobalComponentContext = React.createContext({});

export const GlobalComponentProvider = ({children, data}) => {
    const { addToast } = useToasts();
    const {socketClient} = useSocket();

    useEffect(() => {
        // SocketHelpers.subscribe(`/topic/company-updated-status/1`, () => {
        //     addToast('Có bản chào mới', {appearance: 'info'});
        // }, socketClient);
        //
        // return function cleanup() {
        //     SocketHelpers.unsubscribe()
        // };
    }, [])



    return (
        <GlobalComponentContext.Provider
            value={{

            }}
        >
            {children}
        </GlobalComponentContext.Provider>
    );
};

export function useGlobalComponentContext() {
    const context = React.useContext(GlobalComponentContext);
    if (context === undefined) {
        throw new Error('useGlobalComponent must be used within an SocketProvider');
    }
    return context;
}
