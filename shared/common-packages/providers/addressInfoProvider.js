import React, {useState} from 'react';

const AddressInfoContext = React.createContext({});

export const AddressInfoProvider = (props) => {
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [districts1, setDistricts1] = useState([])
  const [wards1, setWards1] = useState([])

  return (
    <AddressInfoContext.Provider
      value={{
        districts,
        setDistricts,
        wards,
        setWards,
        districts1,
        setDistricts1,
        wards1,
        setWards1
      }}
    >
      {props.children}
    </AddressInfoContext.Provider>
  );
};

export function useAddressInfoContext() {
  return React.useContext(AddressInfoContext);
}
