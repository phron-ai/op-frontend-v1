import { useContext, useMemo } from "react";

import { ContractContext } from "smartcontract-builder/context";
import useContract from "smartcontract-builder/hooks/contract";
import useWorkflow from "smartcontract-builder/hooks/workflow";
import ChatHistory from "./chathistory";
import ActionNode from "../actionNode";
import ChatInputnew from "./chatinputnew";
import "./index.scss";

const Chat = () => {
  const { state } = useContext(ContractContext) as ContractContextValue;
  const { workflow } = useWorkflow();
  const { stepId } = useContract();

  const isAvailableToShowMessage = useMemo(() => {
    if (workflow?.disableMessage && state.stepId !== 0) return false;
    return true;
  }, [state.stepId, state.chatMode]);

  return (
    <div className="w-full">
      {workflow &&
      workflow.assistors[stepId] &&
      workflow.assistors[stepId].action ? (
        <ActionNode />
      ) : (
        <>
          <ChatHistory isAvailableToShowMessage={isAvailableToShowMessage} />
          <ChatInputnew isAvailableToShowMessage={isAvailableToShowMessage} />
        </>
      )}
    </div>
  );
};

export default Chat;
