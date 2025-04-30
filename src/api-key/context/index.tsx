import { createContext, useState } from 'react'

export const ApikeyContext = createContext<any>({});

const initState = {
    apiKeys: []
}

const ApikeyContextProvider = ({ children }) => {
    const [state, setState] = useState(initState);

    const update = (newState: any) => {
        setState((prevState) => ({ ...prevState, ...newState }));
    };

    return (
        <ApikeyContext.Provider value={{ state, update, setState }} >
            {children}
        </ApikeyContext.Provider>
    );
}

export default ApikeyContextProvider;