import React, {useEffect, useState} from 'react';

const GlobalContext = React.createContext({});

export const GlobalProvider = ({children, data}) => {
    const [global, setGlobal] = useState({
        headerTitle: ''
    });

    useEffect(() => {
        setGlobalData(data);
    }, [data])

    const setGlobalData = (data) => {
        setGlobal({...global, ...data});
    }

    return (
        <GlobalContext.Provider
            value={{
                global,
                setGlobalData
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