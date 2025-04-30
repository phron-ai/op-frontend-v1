import React, { createContext, useState, ReactNode } from "react";

export const ContractContext = createContext<ContractContextValue | undefined>(
  undefined
);

const initState: ContractState = {
  address: "",
  stepId: Number(localStorage.getItem("stepId") || 0),
  contractId: Number(localStorage.getItem("contractId") || 0),
  contracts: [],
  workflows: [],
  sharedContract: null,
  workflowId: Number(localStorage.getItem("chatMode") || 2),
  isLoading: true,
  isUserActive: true,
  isApprove: false,
  isFinalStep: false,
  isUpgradeModalVisible: false,
  someOracles: [],
  total_token: 10000000000,
  isAuth: false,
  newTypingMessage: undefined,
  chatMode: localStorage.getItem("chatMode") || "2",
  isUserSelectedChatMode: false,
  currentContractAddress: "",
  currentContractChainId: "",
  aiAgentCode: {},
  currentContractAbis: [],
  agentId: "",
};

const ContractContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ContractState>(initState);

  const update = (newState: any) => {
    if (newState.chatMode) {
      console.log("newState.chatMode", newState.chatMode);
      localStorage.setItem("chatMode", newState.chatMode);
    }
    if (newState?.contractId >= 0) {
      localStorage.setItem("contractId", newState.contractId.toString());
    }
    if (newState?.stepId >= 0) {
      localStorage.setItem("stepId", newState.stepId.toString());
    }
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  return (
    <ContractContext.Provider value={{ state, update }}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContextProvider;
