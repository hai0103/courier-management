import React, {useState} from 'react';

const AddressInfoContext = React.createContext({});

export const AddressInfoProvider = (props) => {
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    return (
        <AddressInfoContext.Provider
            value={{
                districts,
                setDistricts,
                wards,
                setWards
            }}
        >
            {props.children}
        </AddressInfoContext.Provider>
    );
};

export function useAddressInfoContext() {
    return React.useContext(AddressInfoContext);
}