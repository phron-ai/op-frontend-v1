import { useContext, useMemo } from "react";

import serverProvider from "smartcontract-builder/service/server";
import { ContractContext } from "smartcontract-builder/context";
import { checkError } from "utils";

const useWorkflow = () => {
    const { state, update } = useContext(ContractContext) as ContractContextValue;

    const workflow = useMemo<Workflow | undefined>(() => {
        if (state.workflows.length === 0) return undefined;
        return state.workflows.find((workflow: Workflow) => workflow.id === state.workflowId.toString());
    }, [state.workflowId, state.workflows]);

    const updateWorkflow = async () => {
        try {
            if (!state.isAuth) throw new Error("Please sign in!");
            const workflows: Workflow[] | any = await serverProvider.getWorkflows();
            checkError(workflows, false, false);
            update({ workflows });
        } catch (error: any) {
            update({ workflows: [] });
            console.log("updateWorkflowError: ", error.message);
        }
    };

    const changeWorkFlowId = (id: number) => {
        update({ workflowId: id });
    };

    return {
        workflow,
        updateWorkflow,
        changeWorkFlowId,
    };
};

export default useWorkflow;