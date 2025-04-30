import { useParams } from "react-router-dom";
import { CheckIcon } from "lucide-react";
import { useMemo } from "react";

import LinearDeterminate from "smartcontract-builder/components/linear";
import useContract from "smartcontract-builder/hooks/contract";
import useWorkflow from "smartcontract-builder/hooks/workflow";
import "./index.scss";

const Steps = () => {
  const { workflow } = useWorkflow() as UseWorkflowReturn;
  const { accessToken } = useParams();

  const steps: any = useMemo(() => {
    if (!workflow) return [];
    let _steps = workflow.assistors.map((assistor) => assistor.name);
    if (accessToken) _steps.pop();
    return _steps;
  }, [workflow]);
  // const filteredSteps = steps?.filter((_, idx) => idx !== 3) || [];
  return (
    <div
      className="container z-[1] sticky top-[110px] sm:top-[73px] md:top-[73px] lg:top-[73px] xl:top-[80px] bg-[#e5e5ff] shadowbottomsteps  w-full pt-4 md:pt-3 pb-3 place-content-center flex"
      id="steps"
    >
      {steps?.map((step: string, index: number) => (
        <div className="flex gap-3 items-center w-full" key={index}>
          <Step
            totalSteps={steps?.length}
            step={step}
            index={index}
            key={index}
          />
          <LinearDeterminate step={index} />
        </div>
      ))}
      {steps?.length > 0 && <FinalStep stepIdF={steps?.length} />}
    </div>
  );
};

const Step = ({
  step,
  index,
}: {
  totalSteps: number;
  step: string;
  index: number;
}) => {
  const { stepId, isFinalStep, changeStepId } = useContract();

  const isActive = useMemo(
    () => stepId === index && !isFinalStep,
    [stepId, isFinalStep, index]
  );

  const isCompleted = isFinalStep || stepId > index;
  const stepNumber = index + 1;

  return (
    <div
      className="text-center flex flex-col items-center h-full w-full max-w-[120px]"
      onClick={() => changeStepId(index)}
    >
      <div
        className={`${
          isCompleted || isActive ? "bg-purple-600 text-white" : "bg-white"
        }  ${
          stepId >= 3
            ? "sm:text-xs sm:w-7 sm:h-7"
            : "sm:text-xs sm:w-7 sm:h-7"
        } w-7 h-7 text-xs grid cursor-pointer place-content-center mx-auto rounded-full mb-3`}
        data-state={isActive}
      >
        {isCompleted ? <CheckIcon className="w-4 h-4" /> : `0${stepNumber}`}
      </div>

      <span
        className={`text-[6px] ${
          stepId >= 3 ? "sm:text-[9px]" : "sm:text-[9px] "
        }  uppercase tracking-wider`}
      >
        {step}
      </span>
    </div>
  );
};

const FinalStep = ({ stepIdF }: { stepIdF: number }) => {
  const { isFinalStep, changeToFinalStep, stepId } = useContract();
  let stepNumber = Number(stepIdF) + 1;

  return (
    <div
      className="text-center w-full flex flex-col h-full items-center justify-between max-w-[160px]"
      onClick={() => changeToFinalStep()}
    >
      <div
        className={`${isFinalStep ? "bg-purple-600 text-white" : "bg-white"}  ${
          stepId >= 3
            ? "sm:text-xs sm:w-7 sm:h-7"
            : "sm:text-xs sm:w-7 sm:h-7"
        } w-7 h-7 text-xs grid cursor-pointer place-content-center mx-auto rounded-full mb-3 `}
        data-state={isFinalStep}
      >
        0{stepNumber}
      </div>

      <span
        className={`text-[6px] ${
          stepId >= 3 ? "sm:text-[9px]" : "sm:text-[9px]"
        } uppercase tracking-wider`}
      >
        result
      </span>
    </div>
  );
};

export default Steps;
