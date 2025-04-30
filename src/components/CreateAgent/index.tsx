//@ts-nocheck
"use client";

import { useContext, useState } from "react";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { Input } from "components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Switch } from "components/ui/switch";
import {
  Bot,
  ChevronRight,
  PenLine,
  Code2,
  Settings2,
  PlayCircle,
  Check,
  Loader,
  CheckCircle,
  Loader2,
} from "lucide-react";
import useContract from "smartcontract-builder/hooks/contract";
import EditorPage from "../CodeEditor";
import NewCodeEditor from "../NewCodeEditor";
import { ContractContext } from "smartcontract-builder/context";

interface UseCase {
  title: string;
  description: string;
  potential_users: string[];
  industries: string[];
}

const sampleUseCases: UseCase[] = [
  {
    title: "Decentralized Voting System",
    description:
      "The smart contract can be used to create a decentralized voting system where each address can vote only once for a candidate. This can help prevent voter fraud and bring transparency to the voting process.",
    potential_users: [
      "Government Organizations",
      "Non-Profit Organizations",
      "Educational Institutions",
    ],
    industries: ["Government", "Education", "Non-Profit"],
  },
  {
    title: "Public Opinion Polls",
    description:
      "The smart contract can be used to conduct public opinion polls on various topics. This can be an effective way to gauge public sentiment on important issues in a transparent and tamper-proof manner.",
    potential_users: [
      "Media Companies",
      "Market Research Agencies",
      "Government Agencies",
    ],
    industries: ["Media", "Market Research", "Government"],
  },
  {
    title: "Community Decision Making",
    description:
      "The smart contract can be used in decentralized autonomous organizations (DAOs) or other community-based projects to make important decisions based on member voting.",
    potential_users: ["DAOs", "Community Projects", "Online Communities"],
    industries: ["Blockchain", "Community Development", "Technology"],
  },
  {
    title: "Corporate Governance",
    description:
      "This smart contract can be used for corporate governance to allow shareholders to vote on important company decisions, such as electing board members or making major operational decisions.",
    potential_users: ["Corporations", "Shareholders", "Investment Firms"],
    industries: ["Finance", "Corporate", "Investment"],
  },
];

interface ConfigOption {
  name: string;
  key: string;
  type: "text" | "number" | "boolean";
  description: string;
  default: string | number | boolean;
}

const defaultConfigs: Record<string, ConfigOption[]> = {
  "Decentralized Voting System": [
    {
      name: "Minimum Voting Period",
      key: "minVotingPeriod",
      type: "number",
      description: "Minimum time (in hours) that voting should remain open",
      default: 24,
    },
    {
      name: "Enable Delegate Voting",
      key: "delegateVoting",
      type: "boolean",
      description: "Allow voters to delegate their voting power to others",
      default: true,
    },
    {
      name: "Result Publication Delay",
      key: "resultDelay",
      type: "number",
      description:
        "Time to wait after voting ends before publishing results (hours)",
      default: 1,
    },
  ],
  // Add configurations for other use cases...
};

export default function CreateAgent(props: any) {
  const { useCases } = props;

  const [loading, setLoading] = useState(false);

  const { state, update } = useContext(ContractContext) as ContractContextValue;

  const { handleCreateAiAgents, handleAgentDeploy } = useContract();

  const [wantAgent, setWantAgent] = useState<boolean | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<string>("");
  const [customUseCase, setCustomUseCase] = useState("");
  const [step, setStep] = useState(1);
  const [configs, setConfigs] = useState<Record<string, any>>({});
  // const [deploymentStatus, setDeploymentStatus] = useState<
  //   "idle" | "deploying" | "success" | "error"
  // >("idle");
  const [generateAgentStatus, setGenerateAgentStatus] = useState<
    "idle" | "deploying" | "success" | "error"
  >("idle");

  const [createAgentLoading, setCreateAgentLoading] = useState(false);

  const [generateStep, setGenerateStep] = useState<
    "generating-code" | "reviewing"
  >("generating-code");

  const handleContinue = async () => {
    if (
      step === 1 &&
      (selectedUseCase || (selectedUseCase === "custom" && customUseCase))
    ) {
      // Initialize configs with defaults
      if (selectedUseCase !== "custom") {
        const defaultValues = defaultConfigs[selectedUseCase]?.reduce(
          (acc, config) => {
            acc[config.key] = config.default;
            return acc;
          },
          {} as Record<string, any>
        );
        setConfigs(defaultValues || {});
      }

      setCreateAgentLoading(true);

      setGenerateAgentStatus("deploying");

      setTimeout(() => {
        setGenerateStep("reviewing");
      }, 10000);

      const useCase = useCases.find(
        (useCase) => useCase.title === selectedUseCase
      );

      const data = await handleCreateAiAgents({
        use_case: `${useCase.title}: ${useCase.description}`,
      });

      console.log("data", data);

      setStep(2);

      setGenerateAgentStatus("success");

      setCreateAgentLoading(false);
    } else if (step === 2) {
      handleDeploy();
    }
  };

  const handleDeploy = async () => {
    // setDeploymentStatus("deploying");
    // try {
    //   // Simulate deployment
    //   setDeploymentStatus("success");
    // } catch (error) {
    //   setDeploymentStatus("error");
    // }
    try {
      setLoading(true);

      await handleAgentDeploy({
        id: state.agentId,
        status: "pending",
      });

      setLoading(false);

      setStep(4);
    } catch (error) {
      setLoading(false);
    }
  };

  const getStepIndicator = (stepNumber: number, label: string) => (
    <div
      className={`flex flex-wrap text-center items-center justify-center ${
        step >= stepNumber ? "text-[#4A3880]" : "text-gray-600"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= stepNumber ? "bg-[#4A3880] text-white" : "bg-gray-50"
        }`}
      >
        {step > stepNumber ? <Check className="w-5 h-5" /> : stepNumber}
      </div>
      <span className="ml-2">{label}</span>
    </div>
  );

  return (
    <div>
      <div className="">
        {/* Step Indicator */}
        <div className="flex justify-center gap-8">
          {/* {getStepIndicator(1, "Choose Agent")} */}
          {/* <div className="border-t-2 w-16 mt-4" /> */}
          {getStepIndicator(1, "Select Use Case")}
          <div className="border-t-2 w-16 mt-4" />
          {getStepIndicator(2, "Configure & Deploy")}
        </div>

        <div className="">
          {step === 1 ? null : (
            <div className="px-6 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStep(step - 1);
                  setGenerateAgentStatus("idle");
                }}
              >
                Go Back
              </Button>
            </div>
          )}

          {/* {step === 1 && (
            <Card className="mb-6 p-0 border-none shadow-none">
              <CardHeader className="text-center pt-5">
                <CardTitle className="text-2xl font-semibold text-[#4A3880]">
                  Create AI Agent
                </CardTitle>
                <CardDescription>
                  Would you like to create an AI agent for your deployed
                  contract?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    variant={wantAgent === true ? "default" : "outline"}
                    className={`flex-1 h-24 ${
                      wantAgent === true
                        ? "bg-[#4A3880] hover:bg-[#4A3880]/90"
                        : ""
                    }`}
                    onClick={() => setWantAgent(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Bot className="h-6 w-6" />
                      <span>Yes, create an agent</span>
                    </div>
                  </Button>
                  <Button
                    variant={wantAgent === false ? "default" : "outline"}
                    className={`flex-1 h-24 ${
                      wantAgent === false
                        ? "bg-[#4A3880] hover:bg-[#4A3880]/90"
                        : ""
                    }`}
                    onClick={() => setWantAgent(false)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ChevronRight className="h-6 w-6" />
                      <span>No, continue without agent</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-[#4A3880] hover:bg-[#4A3880]/90"
                  disabled={wantAgent === null}
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          )} */}

          {step === 1 && (
            <Card className="p-0 border-none shadow-none">
              <CardHeader className="text-center pt-5">
                <CardTitle className="text-2xl font-semibold text-[#4A3880]">
                  Select Use Case
                </CardTitle>
                <CardDescription>
                  Choose a use case for your AI agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-0">
                {generateAgentStatus === "idle" ? (
                  <RadioGroup
                    value={selectedUseCase}
                    onValueChange={setSelectedUseCase}
                  >
                    {useCases.map((useCase, index) => (
                      <div
                        key={index}
                        className={`relative flex items-start space-x-4 rounded-lg border p-4 transition-colors ${
                          selectedUseCase === useCase.title
                            ? "border-[#4A3880] bg-[#4A3880]/5"
                            : ""
                        }`}
                      >
                        <RadioGroupItem
                          value={useCase.title}
                          id={useCase.title}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={useCase.title}
                            className="text-base font-semibold"
                          >
                            {useCase.title}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {useCase.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {useCase.industries.map((industry) => (
                              <span
                                key={industry}
                                className="inline-flex items-center rounded-full bg-[#4A3880]/10 px-2.5 py-0.5 text-xs font-medium text-[#4A3880]"
                              >
                                {industry}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div
                      className={`relative flex items-start space-x-4 rounded-lg border p-4 transition-colors ${
                        selectedUseCase === "custom"
                          ? "border-[#4A3880] bg-[#4A3880]/5"
                          : ""
                      }`}
                    >
                      <RadioGroupItem
                        value="custom"
                        id="custom"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="custom"
                          className="text-base font-semibold flex items-center gap-2"
                        >
                          <PenLine className="h-4 w-4" />
                          Create your own use case
                        </Label>
                        {/* {selectedUseCase === "custom" && (
                        <Textarea
                          placeholder="Describe your custom use case here..."
                          value={customUseCase}
                          onChange={(e) => setCustomUseCase(e.target.value)}
                          className="mt-4 min-h-[100px]"
                        />
                      )} */}
                        {selectedUseCase === "custom" && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Coming Soon!
                          </p>
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                ) : null}

                {generateAgentStatus === "deploying" && (
                  <div className="text-center">
                    <Loader className="w-16 h-16 text-[#4A3880] animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">
                      {generateStep === "generating-code"
                        ? "Generating Agent..."
                        : "Reviewing Generated Code"}
                    </h2>
                    <p className="">
                      Please wait while we{" "}
                      {generateStep === "generating-code"
                        ? "generate"
                        : "review"}{" "}
                      the code for your agent...
                    </p>
                  </div>
                )}

                {generateAgentStatus === "success" && (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Success</h2>
                    <p className="">Agent Generated!</p>
                    <p className=" mt-4">
                      You Agent is generated successfully!...
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-0 mt-4">
                {generateAgentStatus === "idle" ? (
                  <Button
                    className="w-full bg-[#4A3880] hover:bg-[#4A3880]/90"
                    disabled={createAgentLoading}
                    onClick={handleContinue}
                  >
                    {createAgentLoading ? (
                      <Loader className="animate-spin w-4 h-4" />
                    ) : null}
                    Generate Agent
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-0 border-none shadow-none">
              <CardHeader className="text-center pt-5">
                <div className="flex gap-2 items-center justify-center">
                  <CardTitle className="text-2xl font-semibold text-[#4A3880]">
                    Configure Agent
                  </CardTitle>
                  <p className="text-sm text-primary">(coming soon)</p>
                </div>
                <CardDescription>
                  {selectedUseCase === "custom"
                    ? "Configure your custom agent"
                    : `Configure your ${selectedUseCase} agent`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <NewCodeEditor />
              </CardContent>
              <CardFooter className="flex flex-col p-0 mt-4 gap-4">
                <Button
                  className="w-full bg-[#4A3880] hover:bg-[#4A3880]/90"
                  onClick={handleDeploy}
                  // disabled={deploymentStatus === "deploying"}
                  disabled={createAgentLoading}
                >
                  Deploy
                  {/* {deploymentStatus === "deploying" ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Deploying Agent...
                    </div>
                  ) : deploymentStatus === "success" ? (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Agent Deployed Successfully
                    </div>
                  ) : (
                    "Deploy Agent"
                  )} */}
                </Button>
                {/* {deploymentStatus === "success" && (
                  <p className="text-sm text-center text-green-600">
                    Your AI agent has been successfully deployed and is ready to
                    use!
                  </p>
                )} */}
              </CardFooter>
            </Card>
          )}

          {step === 4 ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Success</h2>
              <p className="">
                We have created your request to deploy your agent.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
