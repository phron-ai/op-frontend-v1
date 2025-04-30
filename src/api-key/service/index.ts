import axios from "axios"

const baseUrl = process.env.REACT_APP_SERVER_URL;

const apikeyService = {
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
            axios.defaults.headers.common.authentication = JSON.stringify({ signature, message, address });
        } catch (error: any) {
            console.log("setAuthenticatioinError: ", error.message);
        }
    },
    getAPIkeys: async () => {
        apikeyService.setAuthentication();
        const response = await axios.get(`${baseUrl}/key`)
        return response.data;
    },
    createAPIkey: async (apiName: string) => {
        apikeyService.setAuthentication();
        console.log("basUrl: ", baseUrl)
        const response = await axios.post(`${baseUrl}/key`, { apiName })
        return response.data;
    },
    deleteAPIkey: async (apiKey: string) => {
        apikeyService.setAuthentication();
        const response = await axios.delete(`${baseUrl}/key/` + apiKey)
        return response.data;
    }
}

export default apikeyService;