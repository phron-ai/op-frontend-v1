import { useMemo } from "react";
import { useAccount } from "wagmi";

import serverProvider from "AImarketplace/service/serverProvider";
import { useGlobalContext } from "AImarketplace/context";
import { useEthersSigner } from "utils/useSigner";
import { checkError } from "utils";

const useOracles = () => {
    const { signer } = useEthersSigner();
    const { address } = useAccount();
    const { state, update } = useGlobalContext() as OracleContextValue;

    const userOracles = useMemo(() => {
        if (!address) return [];
        return state.oracles.filter((item) => item.owner === address);
    }, [state.oracles, address]);

    const updateOracles = async (): Promise<void> => {
        try {
            const oracles = await serverProvider.getOracleList();
            checkError(oracles, false, false);
            update({ oracles });
            return oracles;
        } catch (error: any) {
            update({ oracles: [] });
            console.error("updateOraclesError: ", error.message);
        }
    };

    const updateSomeOracle = async (): Promise<void> => {
        try {
            const len = 10;
            const oracles = await serverProvider.getOracleList();
            if (oracles.length <= len) {
                update({ someOracles: oracles });
                return;
            }
            let someOracles = oracles.slice(len * (-1));
            update({ someOracles });
            return;
        } catch (error: any) {
            update({ someOracles: [] });
            console.log("Update some oracle error", error.message);
        }
    }

    const createOracle = async ({ name, description, price }: { name: string; description: string; price: string }): Promise<void> => {
        try {
            if (!signer) throw new Error("Sign Error!");
            const result = await serverProvider.createOracle({ name, description, subscriptionPrice: price });
            await _addOracle(result);
            await updateOracles();

            console.log("Oracle created successfully.");
        } catch (error: any) {
            console.error("Error creating oracle:", error.message);
        }
    };

    const getOracleById = async (oracleId: string) => {
        try {
            const oracle = await serverProvider.getOracleById(oracleId);
            return oracle;
        } catch (error: any) {
            console.log("getOracleById: ", error.message);
        }
    }

    const _addOracle = async (oracle: any) => {
        if (!oracle) return;
        update({ oracles: [...state.oracles, oracle] });
    }

    return {
        oracles: state.oracles,
        userOracles,
        someOracles: state.someOracles,
        updateOracles,
        createOracle,
        getOracleById,
        updateSomeOracle
    };
};

export default useOracles;