import { MessageCircleMore } from "lucide-react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

import LoadingButton from "smartcontract-builder/components/buttons";
import { ContractContext } from "smartcontract-builder/context";
import useContract from "smartcontract-builder/hooks/contract";
import { Textarea } from "components/ui/textarea";
import { Button } from "components/ui/button";
import "./index.scss";

// function camelToNormal(text: string) {
//   return text
//     .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before capital letters
//     .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // Handle consecutive uppercase letters properly
//     .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
// }

interface WorkflowStepsProps {
  // requirements?: { [x: string]: string };
  // onStartAgain?: () => void;
  // chatMode: string;
}

function WorkflowSteps(props: WorkflowStepsProps) {
  // requirements, onStartAgain
  // const { chatMode } = props;

  const { address } = useAccount();
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const { createContract } = useContract();
  const { state } = useContext(ContractContext) as ContractContextValue;

  const createIdea = async () => {
    if (!idea.trim()) return;

    if (!address) {
      alert("You must connect!");
      return;
    }

    // let _idea = "";

    //     if (requirements) {
    //       _idea =
    //         idea +
    //         `\n
    // Scope:
    // ${Object.entries(chatMode)
    //   .map(([key, value]) => `- ${camelToNormal(key)}: ${value}`)
    //   .join("\n")}
    // `;
    //     }

    const result = await createContract(idea, state.chatMode);
    if (!result) return;
    navigate(`/agent`);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents a new line from being added
      console.log("Enter key pressed");
      createIdea();
    }
  };

  return (
    <div className="w-full max-w-[700px] mx-auto p-4">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-4">
        Need a smart contract? <br />
        <span className="text-xl font-normal">
          Let AI handle the heavy lifting!
        </span>
      </h2>

      {/* {Object.keys(requirements).map((key) => (
        <div>
          {key} : {requirements[key]}
        </div>
      ))} */}

      <div className="rounded-xl bg-white sm:rounded-[20px] w-full shadow-lg p-3">
        {/* {requirements ? (
          <>
            <Button variant="link" className="p-0" onClick={onStartAgain}>
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>

            <h2 className="font-bold mb-2">Initial Requirements:</h2>

            <ul className="flex mb-4  gap-2 flex-wrap">
              {Object.entries(requirements).map(([key, value]) => (
                <li key={key} className="flex">
                  <p className="text-sm flex gap-2 items-center">
                    <span className="font-semibold">{camelToNormal(key)}:</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>{value}</span>
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : null} */}

        <div>
          <Textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Share your idea!"
            className="placeholder:text-black/20 rounded-xl bg-[#E5E5FF]/50 p-3 border-0 focus:ring-0 focus:outline-none min-h-[100px] w-full resize-none"
            onKeyDown={handleKeyDown}
          />
          {/* <p className="text-sm text-black/60 p-4">
            openPhron can make mistakes. Check important info.
          </p> */}
        </div>
        <p className="text-sm text-center text-black/60 p-3">
          Don't rely entirely on OpenPhron; double-check important facts.
        </p>
      </div>

      <div className="text-center flex justify-center mt-6">
        <Button
          size="lg"
          onClick={createIdea}
          className="px-5 py-3 w-full max-w-[240px] uppercase tracking-widest font-light rounded-full text-sm"
          asChild
        >
          <LoadingButton>
            <MessageCircleMore />
            Create
          </LoadingButton>
        </Button>
      </div>
    </div>
  );
}

export default WorkflowSteps;
