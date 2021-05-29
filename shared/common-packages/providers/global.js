import React, {useEffect, useState} from 'react';
import Utility from "utils/utility";
import {getUserProfile} from "utils/localStorage";

const GlobalContext = React.createContext({});

export const GlobalProvider = ({children, data}) => {
    const [global, setGlobal] = useState({
        headerTitle: ''
    });

    const [loggedUser, setLoggedUser] = useState({});

    useEffect(() => {
        setGlobalData(data);
    }, [data])

    const setGlobalData = (data) => {
        setGlobal({...global, ...data});
    }

    useEffect(() => {
        Utility.waitForLocalStorage('user-profile', function (value) {
            setLoggedUser(getUserProfile())
            console.log(loggedUser)
        })
    }, [])

    return (
        <GlobalContext.Provider
            value={{
                global,
                setGlobalData,
                loggedUser
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export function useGlobalContext() {
    const context = React.useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useLayout must be used within an LayoutProvider');
    }
    return context;
}
