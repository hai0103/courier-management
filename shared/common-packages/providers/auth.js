import React from 'react';
import Authentication from "services/authentication";

const AuthContext = React.createContext({
    isAuthenticated: false,
    setAuthenticated: () => {
    },
});

export const AuthProvider = ({children}) => {
    const isAuth = !!Authentication.isAuthenticated();
    const [isAuthenticated, setAuthenticated] = React.useState(isAuth);
    const [isLoading, setLoading] = React.useState(true);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                setAuthenticated,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function useIsAuthenticated() {
    const context = useAuth();
    return context.isAuthenticated;
}
