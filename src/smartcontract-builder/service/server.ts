import axios from "axios";

import { config } from "config";

const serverProvider = {
  serverUrl: config.server,
  contractUrl: config.deploy,
  setAuthentication: () => {
    try {
      const address: string | null = localStorage.getItem("userAddress");
      if (!address) {
        delete axios.defaults.headers.common.authentication;
        throw new Error("User address not found!");
      }
      const signInfo: string | null = localStorage.getItem(address);
      if (!signInfo) {
        delete axios.defaults.headers.common.authentication;
        throw new Error("No signInfo found for address: " + address);
      }
      const { signature, message } = JSON.parse(signInfo);
      axios.defaults.headers.common.authentication = JSON.stringify({
        signature,
        message,
        address,
      });
    } catch (error: any) {
      console.log("setAuthenticatioinError: ", error.message);
    }
  },
  createContract: async (data: any) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract",
      data
    );
    return response.data;
  },
  getContracts: async () => {
    serverProvider.setAuthentication();
    const response = await axios.get(serverProvider.serverUrl + "/contract");
    return response.data;
  },
  sendMessage: async (data: any) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/message",
      data
    );
    return response.data;
  },
  saveResult: async (data: any) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/save-result",
      data
    );
    return response.data;
  },
  getWorkflows: async () => {
    serverProvider.setAuthentication();
    const response = await axios.get(serverProvider.serverUrl + "/workflow");
    return response.data;
  },
  renameContract: async (name: string, contract_Id: string) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/rename",
      { name, contract_Id }
    );
    return response.data;
  },
  deleteContract: async (_id: string) => {
    serverProvider.setAuthentication();
    const response = await axios.delete(
      serverProvider.serverUrl + `/contract/${_id}`
    );
    return response.data;
  },
  compileContract: async (contractCode: string) => {
    serverProvider.setAuthentication();
    const response = await axios.post(serverProvider.contractUrl + "/compile", {
      contractCode,
    });

    console.log("Service provider compileContract", response);
    return response.data;
  },
  verifyContract: async (contract: any) => {
    serverProvider.setAuthentication();

    const response = await axios.post(
      serverProvider.contractUrl + "/verify",
      contract
    );
    return response.data;
  },
  auditContract: async (body: any) => {
    serverProvider.setAuthentication();

    const response = await axios.post(
      serverProvider.serverUrl + "/contract/send-audit-code",
      body
    );
    return response.data;
  },
  testContract: async (testCode: string, contractCode: string) => {
    serverProvider.setAuthentication();
    const response = await axios.post(serverProvider.contractUrl + "/test", {
      testCode,
      contractCode,
    });
    return response.data;
  },
  reduceTokens: async (token: number) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/token/reduce",
      { token }
    );
    return response.data;
  },
  getToken: async () => {
    serverProvider.setAuthentication();
    const response = await axios.get(serverProvider.serverUrl + "/token");
    return response.data;
  },
  subscribeToken: async (id: string) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/token/subscribe",
      { id }
    );
    return response.data;
  },
  shareContract: async (id: string, isPublic: boolean) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/share",
      { id, isPublic }
    );
    return response.data;
  },
  getSharedContract: async (accessToken: string) => {
    serverProvider.setAuthentication();
    const response = await axios.get(
      serverProvider.serverUrl + "/contract/shared/" + accessToken
    );
    return response.data;
  },
  addSharedContract: async (_id: string, address: any) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/shared",
      { _id, address }
    );
    return response.data;
  },
  addDeployedContract: async (data: any) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/deployed",
      data
    );
    return response.data;
  },
  updateDeployedContract: async (data: any) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/update-deployed-contract",
      data
    );
    return response.data;
  },

  updatePublishedAgents: async ({ isPublished, address, name }) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/publish-agent",
      { isPublished, address, name }
    );
    return response;
  },

  getDeployedContract: async (id: any) => {
    serverProvider.setAuthentication();
    const response = await axios.get(
      serverProvider.serverUrl + `/contract/user/deployed/${id}`
    );
    return response.data;
  },
  saveError: async (error: any) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/save-error",
      error
    );
    return response.data;
  },
  // verifyContract: async (contractCode: string, abi: any, address: string) => {
  //   console.log({ contractCode, abi, address });
  //   serverProvider.setAuthentication();
  //   const response = await axios.post(
  //     serverProvider.serverUrl + "/contract/verify",
  //     {
  //       contractCode,
  //       abi,
  //       address,
  //     }
  //   );
  //   return response.data;
  // },
  aiAgentSuggester: async (
    contractCode: string,
    selectContractAddress: string,
    userAddress: string
  ) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/agent-suggester",
      {
        contractCode,
        contractAddress: selectContractAddress,
        userAddress,
      }
    );
    return response.data;
  },
  createAiAgent: async ({
    contract_code,
    use_case,
    deployed_address,
    chain_id,
    abi,
    user_address,
  }) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/create-ai-agent",
      {
        contract_code,
        use_case,
        deployed_address,
        chain_id,
        abi,
        user_address,
      }
    );
    return response.data;
  },
  updateAgentStatus: async ({ id, status }) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/agent-update-status",
      {
        id,
        status,
      }
    );
    return response.data;
  },
  GetAgents: async () => {
    serverProvider.setAuthentication();
    const response = await axios.get(
      serverProvider.serverUrl + "/published-agent"
    );
    return response.data;
  },

  // testContract: async (testCode, contractCode) => {
  //   serverProvider.setAuthentication();
  //   const response = await axios.post(serverProvider.contractUrl + "/test", {
  //     testCode,
  //     contractCode,
  //   });
  //   return response.data;
  // },
  // reduceTokens: async (token) => {
  //   serverProvider.setAuthentication();
  //   const response = await axios.post(
  //     serverProvider.serverUrl + "/token/reduce",
  //     { token }
  //   );
  //   return response.data;
  // },
  // getToken: async () => {
  //   serverProvider.setAuthentication();
  //   const response = await axios.get(serverProvider.serverUrl + "/token");
  //   return response.data;
  // },
  // subscribeToken: async (id) => {
  //   serverProvider.setAuthentication();
  //   const response = await axios.post(
  //     serverProvider.serverUrl + "/token/subscribe",
  //     { id }
  //   );
  //   return response.data;
  // },
  // sendMessage: async (data: any) => {
  //   serverProvider.setAuthentication();
  //   const response = await axios.post(
  //     serverProvider.serverUrl + "/contract/message",
  //     data
  //   );
  //   return response.data;
  // },
  // saveResult: async (data: any) => {
  //   serverProvider.setAuthentication();
  //   const response = await axios.post(
  //     serverProvider.serverUrl + "/contract/save-result",
  //     data
  //   );
  //   return response.data;
  // },
  // getWorkflows: async () => {
  //   serverProvider.setAuthentication();
  //   const response = await axios.get(serverProvider.serverUrl + "/workflow");
  //   return response.data;
  // },
  // deleteContract: async (_id) => {
  //   serverProvider.setAuthentication();
  //   const response = await axios.delete(
  //     serverProvider.serverUrl + `/contract/${_id}`
  //   );
  //   return response.data;
  // },
  // compileContract: async (contractCode) => {
  //   serverProvider.setAuthentication();
  //   const response = await axios.post(serverProvider.contractUrl + "/compile", {
  //     contractCode,
  //   });
  //   return response.data;
  // },
};

export default serverProvider;
