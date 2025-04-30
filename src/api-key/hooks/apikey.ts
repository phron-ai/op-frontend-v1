import { useContext } from "react";

import { ApikeyContext } from "../context";
import apikeyService from "../service";
import { checkError } from "utils";

const useAPIkey = () => {
    const { state, update } = useContext(ApikeyContext) as any;

    const getAPIkeys = async () => {
        try {
            const result = await apikeyService.getAPIkeys();
            console.log("result", result)
            if (!result.status) return;
            update({ apiKeys: result.data })
        } catch (error: any) {
            console.log("Error getting API keys", error.message);
        }
    }

    const createAPIkey = async (apiName: string) => {
        try {
            const result = await apikeyService.createAPIkey(apiName);
            checkError(result);
            if (!result.status) return;
            _addApiKey(result.data)
            return result.data;
        } catch (error: any) {
            checkError(error.message, true);
            console.log("Error Creating API key", error.message);
        }
    }

    const deleteAPIkey = async (apiKey: string) => {
        try {
            const result = await apikeyService.deleteAPIkey(apiKey)
            if (!result.status) return;
            _removeApiKey(apiKey);
        } catch (error: any) {
            console.log("Error Deleting API key", error.message);
        }
    }

    const _addApiKey = (apiKey: string) => {
        update({ apiKeys: [...state.apiKeys, apiKey] })
    }

    const _removeApiKey = (apiKey: string) => {
        update({ apiKeys: state.apiKeys.filter((item: any) => item.apiKey !== apiKey) })
    }

    return {
        apiKeys: state.apiKeys,
        getAPIkeys,
        createAPIkey,
        deleteAPIkey
    }
}

export default useAPIkey;