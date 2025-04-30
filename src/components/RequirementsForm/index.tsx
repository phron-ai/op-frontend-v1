"use client";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import * as z from "zod";
import { Form } from "../ui/form";
import ContractScope from "./ContractScope";
import ThirdPartyIntegration from "./ThirdPartyIntegration";
import ContractType from "./ContractType";
import ContractPattern from "./ContractPattern";
import ContractEditor from "./ContractEditor";
import { contractFormSchema, type ContractFormValues } from "../../lib/schema";
import WorkflowSteps from "../../smartcontract-builder/pages/dashboard/component/workFlowSteps";
import { ContractContext } from "../../smartcontract-builder/context";

const steps = [
  { title: "Contract Scope", component: ContractScope },
  { title: "3rd Party Integration", component: ThirdPartyIntegration },
  { title: "Contract Type", component: ContractType },
  { title: "Contract Pattern", component: ContractPattern },
  // { title: "Final Review", component: WorkflowSteps },
  // { title: "Final Review", component:  <section className="">
  //   {/* <AILibraryGrid /> */}
  //   <div className="subscribeButton"></div>
  //   <WorkflowSteps />
  // </section> },
];

export default function MultiStepForm() {
  // const { state } = useContext(ContractContext) as ContractContextValue;

  const [currentStep, setCurrentStep] = useState(0);

  const [showWorkflowStep, setShowWorkflowStep] = useState(false);
  const [requirements, setRequirements] = useState<{ [x: string]: string }>({});

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      contractScope: "",
      thirdPartyLibrary: "",
      contractType: undefined,
      contractPattern: undefined,
    },
  });

  const nextStep = async () => {
    const fields = [
      "contractScope",
      "thirdPartyLibrary",
      "contractType",
      "contractPattern",
    ];
    const currentField = fields[currentStep];

    const isValid = await form.trigger(
      currentField as keyof ContractFormValues
    );
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: ContractFormValues) => {
    // console.log(data);
    setRequirements(data);
    setShowWorkflowStep(true);
    // Here you would typically send the data to your backend
  };

  const CurrentStepComponent = steps[currentStep].component;

  const onStartAgain = () => {
    setCurrentStep(currentStep - 1);
    setShowWorkflowStep(false);
  };

  // if (state.chatMode === "Basic") {
  // }
  return <WorkflowSteps />;

  // return showWorkflowStep ? (
  //   <WorkflowSteps requirements={requirements} onStartAgain={onStartAgain} />
  // ) : (
  //   <div className="max-w-[500px] mx-auto">
  //     <h2 className="text-center text-2xl md:text-3xl font-bold mb-4">
  //       Need a smart contract? <br />
  //       <span className="text-xl font-normal">
  //         Let AI handle the heavy lifting!
  //       </span>
  //     </h2>
  //     <Card className="w-full bg-white/70 shadow-none max-w-4xl mx-auto">
  //       <CardHeader>
  //         <CardTitle className="text-2xl font-bold">
  //           {steps[currentStep].title}
  //         </CardTitle>
  //       </CardHeader>
  //       <Form {...form}>
  //         <form onSubmit={form.handleSubmit(onSubmit)}>
  //           <CardContent className="">
  //             <CurrentStepComponent />
  //           </CardContent>
  //           <CardFooter className="flex justify-between">
  //             <Button
  //               type="button"
  //               onClick={prevStep}
  //               disabled={currentStep === 0}
  //               variant="outline"
  //             >
  //               Previous
  //             </Button>
  //             {currentStep === steps.length - 1 ? (
  //               <Button type="submit">Proceed to Chat</Button>
  //             ) : (
  //               <Button type="button" onClick={nextStep}>
  //                 Next
  //               </Button>
  //             )}
  //           </CardFooter>
  //         </form>
  //       </Form>
  //     </Card>
  //   </div>
  // );
}
