import { useContext } from "react";

import serverProvider from "smartcontract-builder/service/server";
import { ContractContext } from "smartcontract-builder/context";
import { checkError } from "utils";

const useContracts = () => {
  const { state, update } = useContext(ContractContext) as ContractContextValue;

  const updateContracts = async () => {
    try {
      if (!state.isAuth) throw new Error("Please sign in!");
      const contracts = await serverProvider.getContracts();
      checkError(contracts, false, false);
      const revertedContracts = contracts.reverse();
      if (!state.chatMode || (!state.isUserSelectedChatMode && contracts)) {
        update({
          contracts: revertedContracts,
          chatMode: localStorage.getItem("chatMode") || "2",
          isUserSelectedChatMode: false,
        });
      } else {
        update({ contracts: contracts });
      }
    } catch (error: any) {
      //  update({ contracts: [] });
      console.log("updateContractsError: ", error.message);
    }
  };

  const changeContract = (id: number) => {
    update({
      contractId: id,
      stepId: 0,
      isFinalStep: false,
      chatMode: state.contracts[id].workflowId.toString(),
      workflowId: state.contracts[id].workflowId,
      isUserSelectedChatMode: false,
    });
  };

  const setIsUserActive = (bool: boolean) => {
    update({ isUserActive: bool });
  };

  const setIsLoading = (bool: boolean) => {
    update({ isLoading: bool });
  };

  return {
    contractId: state.contractId,
    contracts: state.contracts,
    isLoading: state.isLoading,
    updateContracts,
    changeContract,
    setIsUserActive,
    setIsLoading,
  };
};

export default useContracts;
