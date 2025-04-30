import React, { useState, useEffect } from "react";

import { cleanErrorMessage } from "smartcontract-builder/utils/deploy";
import serverProvider from "smartcontract-builder/service/server";
import useContracts from "smartcontract-builder/hooks/contracts";
import useWorkflow from "smartcontract-builder/hooks/workflow";
import useContract from "smartcontract-builder/hooks/contract";
import ErrorMessage from "./errorMessage";
import ErrorModal from "./errorModal";

interface ErrorPanelProps {
  errors: {
    form: "compile" | "test";
    message: string;
  };
  isModalOpen: boolean;
  generateTestScript?: (
    message: string,
    stepId?: number,
    isTest?: boolean
  ) => Promise<boolean>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ErrorPanel(props: ErrorPanelProps) {
  const { errors, isModalOpen, generateTestScript, setIsModalOpen } = props;
  const { currentContract, sendMessage, changeStepId } = useContract();
  const { setIsUserActive, setIsLoading, isLoading } = useContracts();
  const { workflow } = useWorkflow();

  const [isModifyLoading, setIsModifyLoading] = useState(false);

  useEffect(() => {
    const saveError = async () => {
      if (errors.message !== "") {
        if (!errors?.message?.includes("PASS")) {
          console.log("saveError");
          const result = await serverProvider.saveError({
            contractId: currentContract._id,
            error: errors,
          });
        }
      }
    };
    saveError();
  }, [errors]);

  const handleModify = async () => {
    try {
      if (!currentContract || isLoading || !workflow) return;

      console.log("modify...");
      setIsModifyLoading(true);
      const reviewerStepId = workflow?.assistors.findIndex(
        (step) => step.name === "reviewer"
      );
      const stepId =
        errors.form === "compile" ? reviewerStepId : reviewerStepId + 1; //if compile error, go to step 2(reviewer), if test error, go to step 3(tester)
      const isTest = errors.form === "test";

      if (generateTestScript) {
        await generateTestScript(cleanErrorMessage(errors), stepId, isTest);
      } else {
        await sendMessage(
          currentContract._id,
          cleanErrorMessage(errors),
          stepId
        );
        changeStepId(stepId);
      }
      setIsUserActive(false);
      setIsLoading(false);
      setIsModifyLoading(false);
      console.log("modify end!");
    } catch (error: any) {
      console.error("Error modifying contract:", error.message);
    }
  };

  // useEffect(() => {
  //     if(errors?.message?.includes('PASS')) return;
  //     setTimeout(() => handleModify(), 5000)
  // },[isModifyLoading])

  return (
    <>
      <ErrorModal
        errors={errors}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isLoading={isLoading}
        handleModify={handleModify}
        isModifyLoading={isModifyLoading}
      />
      {errors.message && !errors.message.includes("Running") && (
        <ErrorMessage
          errors={errors}
          handleModify={handleModify}
          setIsModalOpen={setIsModalOpen}
          isLoading={isLoading}
        />
      )}
    </>
  );
}

export default ErrorPanel;
