"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Button } from "components/ui/button";
import { Save } from "lucide-react";

interface CodeEditorPanelProps {
  selectedFile: { path: string[]; content: string } | null;
  onFileChange: (newContent: string) => void;
}

export function CodeEditorPanel({
  selectedFile,
  onFileChange,
}: CodeEditorPanelProps) {
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    if (selectedFile) {
      setContent(selectedFile.content);

      // Determine language based on file extension
      const fileName = selectedFile.path[selectedFile.path.length - 1];
      if (fileName.endsWith(".js")) {
        setLanguage("javascript");
      } else if (fileName.endsWith(".json")) {
        setLanguage("json");
      } else if (fileName.endsWith(".md")) {
        setLanguage("markdown");
      } else if (fileName.startsWith(".env")) {
        setLanguage("plaintext");
      } else {
        setLanguage("plaintext");
      }
    }
  }, [selectedFile]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    if (selectedFile) {
      onFileChange(content);
    }
  };

  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a file to edit
      </div>
    );
  }

  const fileName = selectedFile.path.join("/");

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-2 flex justify-between items-center">
        <div className="text-sm font-medium">{fileName}</div>
        {/* <Button size="sm" variant="outline" onClick={handleSave}>
          <Save size={16} className="mr-2" />
          Save
        </Button> */}
      </div>
      <div className="h-full relative">
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-background"
          spellCheck={false}
        />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <pre className="p-4 font-mono text-sm opacity-0">{content}</pre>
        </div>
      </div>
    </div>
  );
}
