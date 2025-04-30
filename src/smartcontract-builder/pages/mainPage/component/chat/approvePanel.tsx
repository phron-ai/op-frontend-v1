import { useContext, useEffect, useMemo, useState } from "react";
import { Loader } from "lucide-react";

import { ContractContext } from "smartcontract-builder/context";
import useWorkflow from "smartcontract-builder/hooks/workflow";
import useContract from "smartcontract-builder/hooks/contract";
import Loading from "smartcontract-builder/components/loader";
import { Button } from "components/ui/button";

const ApprovePanel = ({ isAvailableToShowMessage }: { isAvailableToShowMessage: boolean }) => {
  const { state } = useContext(ContractContext) as ContractContextValue;
  const { stepId, currentMessages, approve } = useContract();
  const { workflow } = useWorkflow();

  const [autoApproveTime, setAutoApproveTime] = useState(15);

  const isAvailableToApprove = useMemo(() => {
    if (state.isLoading) return false;
    if (!workflow) return false;
    if (currentMessages.history.length === 0) return false;

    const assistor = workflow.assistors[stepId];
    if (currentMessages.history.length >= assistor?.minChatCount * 2)
      return true;
  }, [state.contracts, currentMessages, stepId, state.isLoading]);

  useEffect(() => {
    setAutoApproveTime(() => (state.isLoading ? 100 : !isAvailableToShowMessage ? 1 : 20));
  }, [stepId, state.isLoading, state.chatMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoApproveTime((autoApproveTime) => {
        if (autoApproveTime <= 0) return 0;
        return autoApproveTime - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const isAutoApprovable = useMemo(() => {
    if (!isAvailableToShowMessage) return true;
    if (state.isUserActive) return false;
    if (!workflow || workflow.assistors[stepId].isAuto === false) return false;
    if (state.isLoading) return false;
    return true;
  }, [autoApproveTime, state.isUserActive, workflow, state.isLoading, isAvailableToShowMessage]);

  useEffect(() => {
    if (!isAutoApprovable || autoApproveTime > 0) return;
    approve();
  }, [autoApproveTime, isAutoApprovable]);

  return (
    <div className="flex items-center justify-center mt-5">
      {
        !isAvailableToShowMessage ? <Loading /> :
          !isAvailableToApprove ? (
            <></>
          ) : isAutoApprovable === true ? (
            <Button
              size="lg"
              className="approve-button w-fit"
              onClick={() => approve()}
              disabled={state.isLoading}
            >
              {state.isLoading ? <Loader className="animate-spin" /> : null}
              Approve ({autoApproveTime})
            </Button>
          ) : (
            <Button
              size="lg"
              className="approve-button w-fit"
              onClick={() => approve()}
              disabled={state.isLoading}
            >
              {state.isLoading ? <Loader className="animate-spin" /> : null}
              Approve
            </Button>
          )
      }
    </div>
  );
};

export default ApprovePanel;