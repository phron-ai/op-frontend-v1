"use client";

import { useState } from "react";
import { FileEditor } from "./FileEditor";
import { FileSidebar } from "./FileSidebar";

export default function EditorPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <FileSidebar onSelectFile={setSelectedFile} selectedFile={selectedFile} />
      <FileEditor selectedFile={selectedFile} />
    </div>
  );
}
