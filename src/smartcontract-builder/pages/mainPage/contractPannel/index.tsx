"use client";

import { Card, CardContent } from "components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Button } from "components/ui/button";
import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyIcon, Code2Icon, FileJson, CheckCircle } from "lucide-react";
import useContract from "smartcontract-builder/hooks/contract";
import { toast } from "react-toastify";
interface ContractDisplayProps {
  contractCode: string;
  contractAbi: any;
}

export function ContractDisplay({
  contractCode,
  contractAbi,
}: ContractDisplayProps) {

  const [activeTab, setActiveTab] = useState("code");

  const { isFinalStep, stepId } = useContract();

  const [loadingText, setLoadingText] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copy to clipboard`);
  };

  const steps = [
    " Requirement analyst...",
    " Code generator...",
    " Code Reviewer...",
    " Action...",
    " Result...",
  ];

  useEffect(() => {
    if (isFinalStep) return;

    setCompletedSteps((prev) => {
      const newCompleted = [...prev];
      for (let i = 0; i < stepId; i++) {
        if (!newCompleted.includes(i)) {
          newCompleted.push(i);
        }
      }
      return newCompleted;
    });

    const currentStep = steps[stepId];
    let currentCharIndex = 0;
    let typingInterval: NodeJS.Timeout;
    setLoadingText("");

    typingInterval = setInterval(() => {
      setLoadingText((prevText) => {
        // Append one character at a time
        const nextChar = currentStep[currentCharIndex];
        currentCharIndex++;

        // If we've reached the end, stop the interval
        if (currentCharIndex >= currentStep.length) {
          clearInterval(typingInterval);
        }

        return prevText + nextChar;
      });
    }, 50);

    return () => {
      clearInterval(typingInterval);
    };
    // typingInterval = setInterval(typeNextChar, 50);
    return () => clearInterval(typingInterval);
  }, [stepId, isFinalStep]);

  // Calculate progress based on current step
  const loadingProgress = ((stepId + 1) / 5) * 100;

  // Get step-specific styling
  const getStepColor = () => {
    switch (stepId) {
      case 0:
        return "from-blue-500 via-blue-400 to-blue-300";
      case 1:
        return "from-purple-500 via-purple-400 to-purple-300";
      case 2:
        return "from-cyan-500 via-cyan-400 to-cyan-300";
      case 3:
        return "from-green-500 via-green-400 to-green-300";
      case 4:
        return "from-amber-500 via-amber-400 to-amber-300";
      default:
        return "from-blue-500 via-purple-500 to-cyan-500";
    }
  };

  // Get step-specific dot colors
  const getDotColors = () => {
    switch (stepId) {
      case 0:
        return ["bg-blue-500", "bg-blue-400", "bg-blue-300"];
      case 1:
        return ["bg-purple-500", "bg-purple-400", "bg-purple-300"];
      case 2:
        return ["bg-cyan-500", "bg-cyan-400", "bg-cyan-300"];
      case 3:
        return ["bg-green-500", "bg-green-400", "bg-green-300"];
      case 4:
        return ["bg-amber-500", "bg-amber-400", "bg-amber-300"];
      default:
        return ["bg-blue-500", "bg-purple-400", "bg-cyan-300"];
    }
  };

  // Get step-specific terminal command
  // const getTerminalCommand = () => {
  //   switch (stepId) {
  //     case 0:
  //       return "solc --analyze contract.sol"
  //     case 1:
  //       return "solc --compile contract.sol"
  //     case 2:
  //       return "solc --optimize --gas contract.sol"
  //     case 3:
  //       return "solc --security-check contract.sol"
  //     case 4:
  //       return "solc --prepare-output contract.sol"
  //     default:
  //       return "solc --optimize contract.sol"
  //   }
  // }

  const dotColors = getDotColors();
  console.log(completedSteps, "completedSteps");
  console.log(activeTab, "activeTab");
  return (
    <Card className="w-full border shadow-sm min-h-[500px] max-h-[500px]">
      <Tabs
        defaultValue="code"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex items-center justify-between border-b px-4 py-2">
          <TabsList className="grid w-full max-w-[500px] grid-cols-2 bg-transparent">
            <TabsTrigger
              value="code"
              className="flex items-center gap-2 data-[state=active]:bg-[rgba(56,36,114,0.1)] data-[state=active]:text-[rgba(56,36,114,1)] data-[state=active]:shadow-none"
            >
              <Code2Icon className="h-4 w-4" />
              Contract Code
            </TabsTrigger>
            {/* <TabsTrigger
              value="abi"
              className="flex items-center gap-2 data-[state=active]:bg-[rgba(56,36,114,0.1)] data-[state=active]:text-[rgba(56,36,114,1)] data-[state=active]:shadow-none"
            >
              <FileJson classNa""me="h-4 w-4" />
              Contract ABI
            </TabsTrigger> */}
          </TabsList>
          {stepId != steps.length - 2 || isFinalStep ? (
            ""
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  activeTab === "code"
                    ? contractCode
                    : JSON.stringify(contractAbi, null, 2),
                  activeTab === "code" ? "Contract code" : "ABI"
                )
              }
              className="ml-auto hover:bg-[rgba(56,36,114,0.1)] hover:text-[rgba(56,36,114,1)]"
            >
              <CopyIcon className="h-4 w-4 mr-2" />
              Copy
            </Button>
          )}
        </div>

        <TabsContent
          value="code"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <CardContent className="p-0 overflow-auto min-h-[500px] max-h-[500px]">
            {stepId != steps.length - 2 || isFinalStep ? (
              <div className="relative bg-[#1E1E1E] text-green-400 font-mono p-4 h-full min-h-[450px]">
                {/* Step indicators */}
                <div className="flex items-center gap-2 mb-4">
                  {steps.map((step, index) => (
                    <div
                      key={step}
                      className={`flex items-center ${
                        index === stepId
                          ? "text-[#9333ea]"
                          : completedSteps.includes(index)
                          ? "text-gray-400"
                          : "text-gray-400"
                      }`}
                    >
                      {/* {completedSteps.includes(index) ? ( */}
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {/* ) : (
                        <div
                          className={`w-2 h-2 rounded-full mr-1 ${index === stepId ? "animate-pulse" : ""} ${index === stepId ? "text-red-500" : "bg-gray-600"}`}
                        ></div>
                      )} */}

                      <span className="text-xs">{`Step ${index + 1}`}</span>
                      {index < steps.length - 1 && (
                        <span className="mx-1 text-gray-600">→</span>
                      )}
                    </div>
                  ))}
                </div>
                {/*
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500">$</span>
                  <span className="text-gray-300">{getTerminalCommand()}</span>
                </div> */}

                <div className="mt-2 whitespace-pre-line">
                  <p className="capitalize whitespace-nowrap overflow-hidden text-ellipsis">
                    {loadingText &&
                      loadingText
                        .replace(/\bundefined\b/g, "")
                        .replace(/\s+/g, " ")
                        .trim()}
                    <span className="inline-block w-2 h-4 ml-0.5 bg-green-400 animate-pulse"></span>
                  </p>
                </div>

                {/* Step-specific output based on stepId */}
                {/* {stepId >= 0 && (
                  <div className="mt-4 text-xs text-gray-400 border-t border-gray-700 pt-2">
                    {stepId >= 1 && <div>✓ Contract syntax validated</div>}
                    {stepId >= 2 && <div>✓ Compilation successful</div>}
                    {stepId >= 3 && <div>✓ Gas optimization complete: -12% gas usage</div>}
                    {stepId >= 4 && <div>✓ Security audit passed: No critical vulnerabilities</div>}
                  </div>
                )} */}

                {/* Animated dots */}
                <div className="flex items-end gap-1 mt-4">
                  <div
                    className={`w-2 h-2 ${dotColors[0]} rounded-full animate-bounce`}
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 ${dotColors[1]} rounded-full animate-bounce`}
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 ${dotColors[2]} rounded-full animate-bounce`}
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                  <div
                    className={`h-full bg-gradient-to-r ${getStepColor()} transition-all duration-300 ease-out`}
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="rounded-md">
                <SyntaxHighlighter
                  language="solidity"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: "0 0 8px 8px",
                    fontSize: "14px",
                    maxHeight: "500px",
                    minHeight: "500px",
                  }}
                  showLineNumbers={true}
                >
                  {contractCode?.replace(/```/g, "")}
                </SyntaxHighlighter>
              </div>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent
          value="abi"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <CardContent className="p-0 w-full overflow-y-scroll max-h-[500px]">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: "0 0 8px 8px",
                fontSize: "14px",
                maxHeight: "500px",
                minHeight: "500px",
              }}
            >
              {JSON.stringify(contractAbi, null, 2)}
            </SyntaxHighlighter>
          </CardContent>
        </TabsContent>
      </Tabs>
      <div className="flex justify-center mt-6">
        {stepId <= 2 && (
          <div className="flex items-end gap-1">
            <div
              className="w-3 h-3 bg-[#9333ea] rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-[#9333ea] rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-[#9333ea] rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-[#9333ea] rounded-full animate-bounce"
              style={{ animationDelay: "450ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-[#9333ea] rounded-full animate-bounce"
              style={{ animationDelay: "600ms" }}
            ></div>
          </div>
        )}
      </div>
    </Card>
  );
}
