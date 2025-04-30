import { useContext, useMemo, useState } from "react";
import { useAccount } from "wagmi";

import serverProvider from "smartcontract-builder/service/server";
import { ContractContext } from "smartcontract-builder/context";
import { checkError, createNotification } from "utils";
import { tokenize } from "smartcontract-builder/utils";
import useTypeWriterEffect from "./typewriter";
import useContracts from "./contracts";
import useWorkflow from "./workflow";
import useCost from "./cost";

const useContract = () => {
  const { address } = useAccount();
  const { state, update } = useContext(ContractContext) as ContractContextValue;
  const { updateTypingMessage } = useTypeWriterEffect();
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [agentLoading, setAgentLoading] = useState(false);
  const [createAgentLoading, setCreateAgentLoading] = useState(false);
  const [useCases, setUseCases] = useState();
  // const [currentContractAddress, setCurrentContractAddress] = useState("");
  // const [currentContractChainId, setCurrentContractChainId] = useState("");
  // const {} = useContract();
  const { updateContracts }: any = useContracts();
  const { getToken, reduceToken } = useCost();
  const { workflow } = useWorkflow();

  const currentContract: any = useMemo(() => {
    if (state.sharedContract) return state.sharedContract;
    if (state.contracts.length === 0) return null;
    return state.contracts[state.contractId];
  }, [state.contractId, state.contracts, state.sharedContract]);

  const currentMessages = useMemo(() => {
    if (!currentContract || !currentContract.steps[state.stepId])
      return { history: [] };
    return currentContract.steps[state.stepId];
  }, [state.stepId, currentContract]);

  const results: any[] = useMemo(() => {
    if (!currentContract) return [];
    if (!workflow) return [];
    if (currentContract.steps.length !== workflow.assistors.length) return [];
    return currentContract.steps.map((step: Step, index: number) => ({
      name: workflow.assistors[index]?.name,
      content: step.result,
    }));
  }, [currentContract, workflow]);

  const reviewerStepId = workflow?.parameters.contractNode;

  const contractCode: string = useMemo(() => {
    if (!reviewerStepId || !results[reviewerStepId]) return "";
    return results[reviewerStepId]?.content;
  }, [results]);

  const testCode: string = useMemo(() => {
    if (!reviewerStepId || !results[reviewerStepId + 1]) return "";
    return results[reviewerStepId + 1]?.content;
  }, [results]);

  const createContract = async (idea: string, chatMode: string) => {
    try {
      if (!state.isAuth) {
        createNotification("error", "Please sign in!");
        return;
      }
      update({ isLoading: true });
      let data = {
        userAddress: address,
        initMessage: idea,
        chatMode: chatMode,
      };
      let contract = await serverProvider.createContract(data);
      if (!contract._id) throw new Error("Network Error!");
      checkError(contract);
      updateTypingMessage(contract._id, 0, 1);

      _addContract(contract);
      const contractIndex = 0;
      await getToken();

      console.log("create: ", contractIndex, contract.workflowId);
      update({
        contractId: contractIndex,
        stepId: 0,
        workflowId: contract.workflowId,
      });
      update({ isLoading: false });
      return contract;
    } catch (error: any) {
      update({ isLoading: false, isUserActive: true });
      checkError(error.message, true);
      console.log("createContractError: ", error.message);
    }
  };

  const sendMessage = async (
    _id: string | undefined,
    message: string,
    _stepId?: number,
    isApprove: boolean = false
  ) => {
    try {
      if (!state.isAuth) {
        createNotification("error", "Please sign in!");
        return;
      }
      if (!_id) {
        createNotification("error", "No contract found.");
        return;
      }
      if (state.total_token < tokenize(message)) {
        update({ isUpgradeModalVisible: true });
        return false;
      }
      await reduceToken(tokenize(message));

      update({ isLoading: true });

      const stepId = !_stepId ? state.stepId : _stepId;
      _addMessage(stepId, { role: "user", content: message });
      const data = { _id, stepId, content: message };

      const botResponse = await serverProvider.sendMessage({
        ...data,
        chatMode: state.chatMode,
      });

      checkError(botResponse);
      updateTypingMessage(
        _id,
        stepId,
        isApprove
          ? 1
          : state.contracts[state.contractId].steps[stepId]?.history.length
      );

      _addMessage(stepId, botResponse.responseMessage);
      await getToken();
      await updateContracts(address);

      return botResponse.responseMessage ? true : false;
    } catch (error: any) {
      update({ isLoading: false, isUserActive: true });
      checkError(error.message, true);
      console.log("sendMessageError: ", error.message);
    }
  };

  const _addMessage = (stepId: number, message: any) => {
    if (typeof message == "string") return;
    const contracts = [...state.contracts];
    contracts[state.contractId].steps[stepId].history.push(message);
    update({ contracts: contracts });
  };

  const _addContract = (contract: Contract | string) => {
    if (typeof contract == "string") return;
    update({ contracts: [contract, ...state.contracts] });
  };

  const approve = async (isTest: boolean = false) => {
    console.log("approve");
    try {
      update({ isLoading: true, isApprove: true });

      const result = await _saveResult();

      checkError(result);

      // if (state.stepId === currentContract.steps.length - 1) {
      //   update({ isFinalStep: true });
      //   await updateContracts(address);
      //   update({ isLoading: false });
      //   return;
      // }

      const response = await sendMessage(
        currentContract._id,
        result,
        isTest ? state.stepId : state.stepId + 1,
        true
      );

      !isTest && update({ stepId: state.stepId + 1 });
      update({ isLoading: false, isUserActive: !response, isApprove: false });
    } catch (error: any) {
      update({ isLoading: false, isUserActive: true, isApprove: false });
      console.log("approveError: ", error.message);
    }
  };

  const _saveResult = async () => {
    try {
      if (!currentContract) throw new Error("No contract");
      const data = {
        _id: currentContract._id,
        stepId: state.stepId,
      };
      const result = await serverProvider.saveResult({
        ...data,
        chatMode: state.chatMode,
      });

      return result;
    } catch (error: any) {
      console.log("saveResultError: ", error.message);
    }
  };

  const changeStepId = (id: number) => {
    if (!currentContract) {
      createNotification("error", "No contract found.");
      return;
    }
    if (id < 0 || currentContract.steps[id]?.history.length === 0) {
      createNotification("error", "There are no messages in this step.");
      return;
    }
    console.log("changeStepId: ", id);
    update({
      stepId: id,
      isFinalStep: false,
      isUserActive: true,
    });
  };

  const changeToFinalStep = () => {
    if (!results[results.length - 2]?.content) {
      createNotification("error", "There is no result available.");
      return;
    }
    update({ isFinalStep: true });
  };

  const renameContract = async (name: string) => {
    const result = await serverProvider.renameContract(
      name,
      currentContract._id
    );
    if (result.res === "success") {
      const _contracts = state.contracts.map((contract) => {
        if (contract._id === currentContract._id) contract.name = name;
        return contract;
      });
      update({ ...state, contracts: _contracts });
    }
  };

  const deleteContract = async (id: number | string = state.contractId) => {
    try {
      let _id = state.contracts[id]._id;
      const result = await serverProvider.deleteContract(_id);
      checkError(result);
      update({ contractId: Number(id) > 0 ? Number(id) - 1 : 0 });
      await updateContracts(address);
    } catch (error: any) {
      console.log("deleteContractError: ", error.message);
    }
  };

  const compileContract = async (): Promise<any> => {
    try {
      if (!contractCode) throw new Error("ContractCode is wrong!");
      let reply = await serverProvider.compileContract(contractCode);
      console.log("compileContract", reply);
      checkError(reply);
      return reply;
    } catch (error: any) {
      console.log("compile-contract-error: ", error.message);
      checkError(error.message, true);
    }
  };

  // const verifyContract = async (
  //   contractCode: string,
  //   abi: any,
  //   address: string
  // ): Promise<any> => {
  //   try {
  //     setVerifyLoading(true);

  //     if (!contractCode) return null;
  //     let data = await serverProvider.verifyContract(
  //       contractCode,
  //       abi,
  //       address
  //     );
  //     checkError(data);
  //     setVerifyLoading(false);
  //     return data;
  //   } catch (error: any) {
  //     console.log("verify-contract-error: ", error.message);
  //     checkError(error.message, true);
  //   } finally {
  //     setVerifyLoading(false);
  //   }
  // };

  const aiAgentSuggester = async (
    contractCode: string,
    selectContractAddress: string,
    chainId: string,
    abi: string
  ) => {
    try {
      setAgentLoading(true);

      update({ currentContractAddress: selectContractAddress });
      update({ currentContractChainId: chainId });
      update({ currentContractAbis: abi });

      const userAddress = localStorage.getItem("userAddress") as string;

      console.log("userAddress", userAddress);

      const data = await serverProvider.aiAgentSuggester(
        contractCode,
        selectContractAddress,
        userAddress
      );

      setUseCases(data.use_cases);
    } catch (error: any) {
      console.log("verify-contract-error: ", error.message);
      checkError(error.message, true);
    } finally {
      setAgentLoading(false);
    }
  };

  const testContract = async (): Promise<any> => {
    try {
      if (!testCode) throw new Error("TestScript is wrong!");
      let reply: any = await serverProvider.testContract(
        testCode,
        contractCode
      );
      return reply;
    } catch (error: any) {
      console.log("test-error: ", error.message);
      checkError(error.message, true);
    }
  };

  const addDeployedContract = async (
    contractAddress: string,
    name: string,
    abi: any,
    chainId: string,
    contractId: string,
    contractName: string,
    constructorValues?: any
  ) => {
    try {
      if (!state.isAuth) {
        createNotification("error", "Please sign in!");
        return;
      }
      update({ isLoading: true });
      let data = {
        userAddress: address,
        name,
        contractAddress: contractAddress,
        abi: abi,
        chainId: chainId,
        contractId: contractId,
        contractName: contractName,
        contractCode,
        constructorValues,
      };

       console.log("contractCode", contractCode);

      let contract = await serverProvider.addDeployedContract(data);
      checkError(contract);
      updateTypingMessage(contract._id, 0, 1);
      await getToken();

      update({ isLoading: false });
      return contract;
    } catch (error: any) {
      update({ isLoading: false, isUserActive: true });
      checkError(error.message, true);
      console.log("createContractError: ", error.message);
    }
  };

  const shareContract = async (id: string, isPublic: boolean) => {
    try {
      const accessToken = await serverProvider.shareContract(id, isPublic);
      return accessToken;
    } catch (error: any) {
      console.log("share-contract-error: ", error.message);
      checkError(error.message, true);
    }
  };

  const getSharedContract = async (accessToken: string) => {
    try {
      const contract = await serverProvider.getSharedContract(accessToken);
      update({ ...state, sharedContract: contract[0] });
      return;
    } catch (error: any) {
      console.log("get-shared-contract-error: ", error.message);
      checkError(error.message, true);
    }
  };

  const addSharedContract = async () => {
    try {
      const result = await serverProvider.addSharedContract(
        state.sharedContract._id,
        address
      );
      checkError(result);
      update({
        contracts: [...state.contracts, state.sharedContract],
        sharedContract: null,
      });
      return result;
    } catch (error: any) {
      console.log(
        "create-new-contract-with-shared-contract-error: ",
        error.message
      );
      checkError(error.message, true);
    }
  };

  return {
    currentMessages,
    currentContract,
    stepId: state.stepId,
    isFinalStep: state.isFinalStep,
    currentContractId: state.contracts[state.contractId]?._id,
    sharedContract: state.sharedContract,
    results,
    contractCode,
    testCode,
    addDeployedContract,
    createContract,
    sendMessage,
    approve,
    changeStepId,
    changeToFinalStep,
    renameContract,
    deleteContract,
    compileContract,
    // verifyContract,
    verifyLoading,
    testContract,
    shareContract,
    getSharedContract,
    addSharedContract,
  };
};

export default useContract;
