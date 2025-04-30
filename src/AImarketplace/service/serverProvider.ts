import axios from "axios";

import { config } from "config";

const serverProvider = {
  serverUrl: config.server,
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

      const authData = JSON.stringify({ signature, message, address });
      axios.defaults.headers.common.authentication = authData;

      axios.defaults.headers.common['Content-Type'] = 'application/json';
      return true;
    } catch (error: any) {
      console.error("Authentication Error:", error.message);
      return false;
    }
  },
  createOracle: async (data): Promise<any> => {
    serverProvider.setAuthentication();
    let response = await axios.post(serverProvider.serverUrl + "/oracle", data);
    return response.data;
  },
  getOracleList: async (): Promise<any> => {
    serverProvider.setAuthentication();
    let response = await axios.get(serverProvider.serverUrl + "/oracle");
    return response.data;
  },
  getOracleById: async (id: string) => {
    serverProvider.setAuthentication();
    let response = await axios.get(serverProvider.serverUrl + `/oracle/${id}`);
    return response.data;
  },
  getQuestions: async (): Promise<any> => {
    serverProvider.setAuthentication();
    let response = await axios.get(serverProvider.serverUrl + "/question");
    return response.data;
  },
  getQuestion: async (question_id: String): Promise<any> => {
    serverProvider.setAuthentication();
    let response = await axios.get(
      serverProvider.serverUrl + "/question/" + question_id
    );
    return response.data;
  },
  getQuestionForOracle: async (oracle_id: String): Promise<any> => {
    serverProvider.setAuthentication();
    let response = await axios.post(
      serverProvider.serverUrl + "/question/oracle/" + oracle_id
    );
    return response.data;
  },
  addQuestion: async (data: any): Promise<any> => {
    serverProvider.setAuthentication();
    let response = await axios.post(serverProvider.serverUrl + "/question", data);
    return response.data;
  },
  updateQuestion: async (data: any): Promise<any> => {
    serverProvider.setAuthentication();
    let response = await axios.post(serverProvider.serverUrl + "/question/update", data);
    return response.data;
  },
  subscribe: async (data) => {
    serverProvider.setAuthentication();
    let response = await axios.post(serverProvider.serverUrl + "/subscribe", data);
    return response.data;
  },
  getSubscriptionForUser: async (): Promise<any> => {
    serverProvider.setAuthentication();
    let response = await axios.get(
      serverProvider.serverUrl + "/subscription/user"
    );
    return response.data;
  },
  getSubscriptionForOracle: async (oracleId: String): Promise<any> => {
    serverProvider.setAuthentication();
    let response = await axios.post(
      serverProvider.serverUrl + "/subscription/oracle/" + oracleId
    );
    return response.data;
  },
  removeOracle: async (oracleId: string | null): Promise<any> => {
    serverProvider.setAuthentication();
    let response = await axios.delete(
      serverProvider.serverUrl + "/oracle/" + oracleId
    );
    return response.data;
  },
  changeOracleName: async (oracleId: string | null, name: string): Promise<any> => {
    serverProvider.setAuthentication();
    let response = await axios.post(
      serverProvider.serverUrl + "/oracle/rename", { oracleId, name }
    );
    return response.data;
  }
};

export default serverProvider;