"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Search,
} from "lucide-react";
import { cn } from "lib/utils";
import { Input } from "components/ui/input";
import { ScrollArea } from "components/ui/scroll-area";

// Mock file system data
const fileSystem = {
  name: "project",
  type: "directory",
  children: [
    {
      name: "src",
      type: "directory",
      children: [
        {
          name: "components",
          type: "directory",
          children: [
            {
              name: "Button.tsx",
              type: "file",
              content:
                "export function Button() { return <button>Click me</button> }",
            },
            {
              name: "Card.tsx",
              type: "file",
              content:
                'export function Card({ children }) { return <div className="card">{children}</div> }',
            },
          ],
        },
        {
          name: "pages",
          type: "directory",
          children: [
            {
              name: "index.tsx",
              type: "file",
              content:
                "export default function Home() { return <div>Home Page</div> }",
            },
            {
              name: "about.tsx",
              type: "file",
              content:
                "export default function About() { return <div>About Page</div> }",
            },
          ],
        },
        {
          name: "styles.css",
          type: "file",
          content: "body { font-family: sans-serif; }",
        },
      ],
    },
    {
      name: "public",
      type: "directory",
      children: [
        { name: "favicon.ico", type: "file", content: "Binary content" },
        { name: "logo.svg", type: "file", content: "<svg>...</svg>" },
      ],
    },
    {
      name: "package.json",
      type: "file",
      content: '{\n  "name": "project",\n  "version": "1.0.0"\n}',
    },
    {
      name: "README.md",
      type: "file",
      content: "# Project\n\nThis is a sample project.",
    },
  ],
};

// File content cache for the mock data
export const fileContents: Record<string, string> = {};

// Flatten file paths for easy lookup
const flattenFileSystem = (item: any, path = "") => {
  const currentPath = path ? `${path}/${item.name}` : item.name;

  if (item.type === "file") {
    fileContents[currentPath] = item.content;
  }

  if (item.children) {
    item.children.forEach((child: any) =>
      flattenFileSystem(child, currentPath)
    );
  }
};

flattenFileSystem(fileSystem);

interface FileSidebarProps {
  onSelectFile: (path: string) => void;
  selectedFile: string | null;
}

export function FileSidebar({ onSelectFile, selectedFile }: FileSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({
    project: true,
    "project/src": true,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderFileIcon = (fileName: string) => {
    if (
      fileName.endsWith(".tsx") ||
      fileName.endsWith(".jsx") ||
      fileName.endsWith(".ts") ||
      fileName.endsWith(".js")
    ) {
      return <FileCode className="h-4 w-4 text-blue-500" />;
    } else if (fileName.endsWith(".json")) {
      return <FileJson className="h-4 w-4 text-yellow-500" />;
    } else if (fileName.endsWith(".md") || fileName.endsWith(".txt")) {
      return <FileText className="h-4 w-4 text-gray-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderTree = (item: any, path = "", level = 0) => {
    const currentPath = path ? `${path}/${item.name}` : item.name;
    const isExpanded = expandedFolders[currentPath];

    if (item.type === "directory") {
      return (
        <div key={currentPath}>
          <div
            className={cn(
              "flex items-center py-1 px-2 hover:bg-gray-600 rounded-md cursor-pointer",
              level > 0 && "ml-2"
            )}
            onClick={() => toggleFolder(currentPath)}
          >
            <span className="mr-1">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </span>
            <span className="mr-1">
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-yellow-500" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-500" />
              )}
            </span>
            <span className="text-sm">{item.name}</span>
          </div>

          {isExpanded && item.children && (
            <div className="ml-2">
              {item.children.map((child: any) =>
                renderTree(child, currentPath, level + 1)
              )}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          key={currentPath}
          className={cn(
            "flex items-center py-1 px-2 hover:bg-gray-600 rounded-md cursor-pointer ml-6",
            selectedFile === currentPath && "bg-gray-600"
          )}
          onClick={() => onSelectFile(currentPath)}
        >
          <span className="mr-1">{renderFileIcon(item.name)}</span>
          <span className="text-sm">{item.name}</span>
        </div>
      );
    }
  };

  return (
    <div className="w-64 border-r flex flex-col h-full">
      <div className="p-2 border-b">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search files..."
            className="h-8 text-sm"
            // prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">{renderTree(fileSystem)}</div>
      </ScrollArea>
    </div>
  );
}
