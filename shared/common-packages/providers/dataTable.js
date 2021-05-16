import React, {useState} from 'react';

const DataTableContext = React.createContext({});

export const DataTableProvider = ({children}) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const refresh = () => {
        setRefreshKey((key) => key + 1);
    }

    return (
        <DataTableContext.Provider
            value={{
                refreshKey,
                refresh
            }}
        >
            {children}
        </DataTableContext.Provider>
    );
};

export function useDataTable() {
    const context = React.useContext(DataTableContext);
    if (context === undefined) {
        throw new Error('useDataTable must be used within an DataTableProvider');
    }
    return context;
}