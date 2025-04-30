"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { fileContents } from "./FileSidebar";
import { ScrollArea } from "components/ui/scroll-area";
import { cn } from "lib/utils";

interface FileEditorProps {
  selectedFile: string | null;
}

export function FileEditor({ selectedFile }: FileEditorProps) {
  const [content, setContent] = useState<string>("");
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      if (!openTabs.includes(selectedFile)) {
        setOpenTabs((prev) => [...prev, selectedFile]);
      }
      setActiveTab(selectedFile);
      setContent(fileContents[selectedFile] || "");
    }
  }, [selectedFile, openTabs]); // Added openTabs to dependencies

  const handleTabClose = (tab: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = openTabs.filter((t) => t !== tab);
    setOpenTabs(newTabs);

    if (activeTab === tab) {
      setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
      setContent(
        newTabs.length > 0
          ? fileContents[newTabs[newTabs.length - 1]] || ""
          : ""
      );
    }
  };

  const getFileName = (path: string) => {
    return path.split("/").pop() || path;
  };

  const getLanguage = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "css":
        return "css";
      case "html":
        return "html";
      case "json":
        return "json";
      case "md":
        return "markdown";
      default:
        return "plaintext";
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (activeTab) {
      fileContents[activeTab] = e.target.value;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {openTabs.length > 0 ? (
        <>
          <div className="border-b flex">
            <ScrollArea className="w-full">
              <div className="flex">
                {openTabs.map((tab) => (
                  <div
                    key={tab}
                    className={cn(
                      "px-3 py-2 flex items-center gap-1 border-r cursor-pointer text-sm",
                      activeTab === tab
                        ? "bg-gray-600"
                        : "bg-black hover:bg-black/80"
                    )}
                    onClick={() => {
                      setActiveTab(tab);
                      setContent(fileContents[tab] || "");
                    }}
                  >
                    <span>{getFileName(tab)}</span>
                    <button
                      className="ml-1 rounded-full hover:bg-muted hover:text-black p-0.5"
                      onClick={(e) => handleTabClose(tab, e)}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 overflow-hidden">
            <textarea
              value={content}
              onChange={handleContentChange}
              className="w-full bg-black h-full p-4 font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p>No file selected</p>
            <p className="text-sm">
              Select a file from the sidebar to start editing
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
