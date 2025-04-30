import { useMemo } from "react";
import { ethers } from "ethers";

import serverProvider from "AImarketplace/service/serverProvider";
import { useGlobalContext } from "AImarketplace/context";
import { useEthersSigner } from "utils/useSigner";
import useQuestions from "./useQuestions";
import { useMarketplaceContract } from "../blockchain";

const useOracle = (): UseOracleReturn => {
    const { marketplaceContract } = useMarketplaceContract();
    const { state, update } = useGlobalContext() as OracleContextValue;
    const { updateQuestions } = useQuestions() as UseQuestionsReturn;
    const { signer } = useEthersSigner();

    const oracle: any = useMemo(() => {
        const _oracle = state.oracles.find(oracle => oracle.id === state.oracleId);
        if (state.oracles.length === 0 || !_oracle) return "";
        return _oracle;
    }, [state.oracles, state.oracleId]);

    const subscribe = async (data: any) => {
        const { oracleId, userContract, price, expire, owner, signature } = data;

        if (!signer || !oracle) return;
        try {
            const tx = await marketplaceContract.subscribe(
                oracleId,
                userContract,
                price,
                expire,
                owner,
                signature,
                {
                    value: price
                });
            await tx.wait();
        } catch (error) {
            console.error("Subscription failed:", error);
        }
    };

    const updateQuestion = async (data: any): Promise<void> => {
        try {
            await serverProvider.updateQuestion(data);
            await updateQuestions();
        } catch (error: any) {
            console.error("updateQuestionError: ", error.message);
        }
    };

    const changeOracleId = async (oracleId: string | null) => {
        update({ oracleId });
    };

    const renameOracle = async (name: string) => {
        try {
            await serverProvider.changeOracleName(state.oracleId, name);
            const oracles = state.oracles.map(oracle => {
                if (oracle.id === state.oracleId) {
                    return { ...oracle, name };
                }
                return oracle;
            });
            update({ oracles });
        } catch (error: any) {
            console.error("changeOracleNameError: ", error.message);
        }
    }

    const removeOracle = async () => {
        try {
            await serverProvider.removeOracle(state.oracleId);
            const filteredOracles = state.oracles.filter(oracle => oracle.id !== state.oracleId);
            update({ oracles: filteredOracles, oracleId: null });
        } catch (error: any) {
            console.error("removeOracleError: ", error.message);
            throw error;
        }
    };

    return {
        oracleId: state.oracleId,
        oracle,
        subscribe,
        updateQuestion,
        changeOracleId,
        renameOracle,
        removeOracle,
    };
};

export default useOracle;