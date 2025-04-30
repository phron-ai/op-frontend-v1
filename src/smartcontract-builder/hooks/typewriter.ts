import { useContext } from "react";

import { ContractContext } from "smartcontract-builder/context";

const useTypeWriterEffect = () => {
    const { state, update } = useContext(ContractContext) as ContractContextValue;

    const updateTypingMessage = (contractId: string, stepId: number, index: number) => {
        update({ newTypingMessage: { contractId, stepId, index } })
    }

    const cleanTypingMessage = () => {
        update({ newTypingMessage: undefined })
    }

    return {
        newTypingMessage: state.newTypingMessage,
        updateTypingMessage,
        cleanTypingMessage
    }
}

export default useTypeWriterEffect;