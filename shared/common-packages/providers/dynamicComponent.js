import React, {useState} from 'react';

const DynamicComponentContext = React.createContext({});

export const DynamicComponentProvider = ({children}) => {
    const [component, setComponent] = useState(null);
    const [data, setData] = useState({});

    const useComponent = (activeComponent, props = {}) => {
        if (activeComponent) {
            setComponent(activeComponent);
            setData(props);
        }
    }

    return (
        <DynamicComponentContext.Provider
            value={{
                component,
                data,
                useComponent,
            }}
        >
            {children}
        </DynamicComponentContext.Provider>
    );
};

export function useDynamicComponentContext() {
    const context = React.useContext(DynamicComponentContext);
    if (context === undefined) {
        throw new Error('useDynamicComponentContext must be used within an DynamicComponentProvider');
    }
    return context;
}