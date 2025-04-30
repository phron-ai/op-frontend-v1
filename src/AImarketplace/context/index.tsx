import { createContext, useContext, useState, useCallback } from 'react';

const initState: OracleState = {
  oracles: [],
  questions: [],
  isLoadingOracle: true,
  someOracles: [],
  oracleId: null
};

export const GlobalContext = createContext<OracleContextValue | undefined>(undefined);

export function useGlobalContext(): OracleContextValue {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalContext must be used within a GlobalContextProvider');
  return context;
}

export const OracleContextProvider = ({ children }: any) => {
  const [state, setState] = useState<OracleState>(initState);

  const update = useCallback((newState: Partial<OracleState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  return (
    <GlobalContext.Provider value={{ state, update }
    }>
      {children}
    </GlobalContext.Provider>
  );
};

export default OracleContextProvider;