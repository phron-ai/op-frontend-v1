"use client";

import { useContext, useState } from "react";
import { FileExplorer } from "./file-explorer";
import { CodeEditorPanel } from "./code-editor-panel";
import { Button } from "components/ui/button";
import { Moon, Sun } from "lucide-react";
import { ContractContext } from "smartcontract-builder/context";

export default function NewCodeEditor() {
  const { state, update } = useContext(ContractContext) as ContractContextValue;

  //   const [fileStructure, setFileStructure] = useState(initialFileStructure);
  const [selectedFile, setSelectedFile] = useState<{
    path: string[];
    content: string;
  } | null>(null);

  const handleFileSelect = (path: string[], content: string) => {
    setSelectedFile({ path, content });
  };

  const handleFileChange = (newContent: string) => {
    if (!selectedFile) return;

    // Create a deep copy of the file structure
    const newFileStructure = JSON.parse(JSON.stringify(state.aiAgentCode));

    // Navigate to the file's parent directory
    let current = newFileStructure;
    for (let i = 0; i < selectedFile.path.length - 1; i++) {
      current = current[selectedFile.path[i]];
    }

    // Update the file content
    current[selectedFile.path[selectedFile.path.length - 1]] = newContent;

    // Update state
    // setFileStructure(newFileStructure);
    update({ aiAgentCode: newFileStructure });
    setSelectedFile({ ...selectedFile, content: newContent });
  };

  return (
    <div className="flex flex-col bg-background text-foreground">
      <header className="border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Code Editor</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r border-border overflow-y-auto">
          <FileExplorer
            fileStructure={state.aiAgentCode}
            onFileSelect={handleFileSelect}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <CodeEditorPanel
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
