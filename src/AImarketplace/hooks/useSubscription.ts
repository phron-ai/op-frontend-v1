import { useAccount } from "wagmi";

import serverProvider from "AImarketplace/service/serverProvider";
import useOracle from "./useOracle";
import { checkError } from "utils";

const useSubscription = () => {
    const { address } = useAccount();
    const { oracleId } = useOracle() as UseOracleReturn;

    const subscribeForSign = async (userContract: string): Promise<any> => {
        try {
             if (!address) return;
            const subscription = await serverProvider.subscribe({ userContract, oracleId });
            checkError(subscription);
            return subscription;
        } catch (error: any) {
            console.log("subscribeError: ", error.message);
        }
    }

    const getSubscriptionForOracle = async (oracle_id: String): Promise<SubScription[] | any> => {
        try {
            const subscriptions = await serverProvider.getSubscriptionForOracle(oracle_id);
            checkError(subscriptions);
            return subscriptions;
        } catch (error: any) {
            console.log("getSubscriptionForOracleError: ", error.message);
        }
    }

    const getSubscriptionForUser = async (): Promise<any> => {
        try {
            if (!address) return;
            const subscriptions = await serverProvider.getSubscriptionForUser();
            checkError(subscriptions);
            return subscriptions;
        } catch (error: any) {
            console.log("getSubscriptionForUserError: ", error.message);
        }
    }

    return {
        subscribeForSign,
        getSubscriptionForOracle,
        getSubscriptionForUser
    }
}

export default useSubscription;