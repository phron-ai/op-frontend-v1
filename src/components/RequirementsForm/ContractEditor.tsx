"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import type { ContractFormValues } from "../../lib/schema";

export default function ContractEditor() {
  const { getValues } = useFormContext<ContractFormValues>();
  const [code, setCode] = useState("");

  useEffect(() => {
    const { contractScope, thirdPartyLibrary, contractType, contractPattern } =
      getValues();

    // Generate a mock contract based on user selections
    const mockContract = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

${
  thirdPartyLibrary
    ? `import "@openzeppelin/contracts/${thirdPartyLibrary}.sol";`
    : ""
}

${
  contractPattern === "upgradeable"
    ? 'import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";'
    : ""
}

contract MyCustomContract ${
      contractPattern === "upgradeable" ? "is Initializable" : ""
    } {
    // Contract type: ${contractType}
    // Scope: ${contractScope}

    // Add your custom logic here based on the selected scope and type

    constructor() {
        // Initialize your contract
    }

    // Add functions based on the selected scope
    ${contractScope === "defi" ? "// DeFi related functions" : ""}
    ${contractScope === "escrow" ? "// Escrow related functions" : ""}
    ${contractScope === "voting" ? "// Voting related functions" : ""}
    ${contractScope === "staking" ? "// Staking related functions" : ""}
    ${contractScope === "minting" ? "// Minting related functions" : ""}
    ${contractScope === "airdrop" ? "// Airdrop related functions" : ""}
}
`;
    setCode(mockContract);
  }, [getValues]);

  const handleEditorChange = (value: string) => {
    setCode(value);
  };

  const handleSave = () => {
    console.log("Saving edited contract:", code);
    // Here you would typically send the code to your backend or perform further processing
  };

  return (
    <div className="space-y-4">
      <div className="h-[400px] relative border rounded-md overflow-hidden">
        {/* <MonacoEditor
          height="100%"
          language="solidity"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        /> */}
      </div>
      <Button onClick={handleSave} className="w-full">
        Save Contract
      </Button>
    </div>
  );
}
