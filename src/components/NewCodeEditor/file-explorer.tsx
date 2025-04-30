"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { cn } from "lib/utils";

interface FileExplorerProps {
  fileStructure: Record<string, any>;
  onFileSelect: (path: string[], content: string) => void;
}

export function FileExplorer({
  fileStructure,
  onFileSelect,
}: FileExplorerProps) {
  return (
    <div className="p-2">
      <h2 className="text-sm font-semibold mb-2 px-2">Files</h2>
      {Object.entries(fileStructure).map(([key, value]) => (
        <FileTreeNode
          key={key}
          name={key}
          value={value}
          path={[key]}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
}

interface FileTreeNodeProps {
  name: string;
  value: any;
  path: string[];
  onFileSelect: (path: string[], content: string) => void;
}

function FileTreeNode({ name, value, path, onFileSelect }: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isFile = typeof value === "string";

  const handleClick = () => {
    if (isFile) {
      onFileSelect(path, value);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".js")) return "js";
    if (fileName.endsWith(".json")) return "json";
    if (fileName.endsWith(".md")) return "md";
    if (fileName.startsWith(".env")) return "env";
    return "file";
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 rounded cursor-pointer hover:bg-accent/50 text-sm",
          isFile && "hover:bg-accent"
        )}
        onClick={handleClick}
      >
        {!isFile ? (
          <>
            <span className="mr-1">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
            <Folder size={16} className="mr-2 text-yellow-500" />
          </>
        ) : (
          <>
            <span className="ml-5 mr-2">
              <File
                size={16}
                className={cn(
                  getFileIcon(name) === "js" && "text-yellow-500",
                  getFileIcon(name) === "json" && "text-green-500",
                  getFileIcon(name) === "md" && "text-blue-500",
                  getFileIcon(name) === "env" && "text-purple-500"
                )}
              />
            </span>
          </>
        )}
        <span className="truncate">{name}</span>
      </div>
      {!isFile && isOpen && (
        <div className="ml-4 border-l border-border pl-2">
          {Object.entries(value).map(([childName, childValue]) => (
            <FileTreeNode
              key={childName}
              name={childName}
              value={childValue}
              path={[...path, childName]}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
