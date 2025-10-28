"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ArrowLeft,
  Plus,
  MoreVertical,
  Code2,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Share2,
  Copy,
} from "lucide-react";
import React, { useState } from "react";

function FolderIdPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Mock folder data
  const folder = {
    id: 1,
    name: "React Components",
    description: "Reusable React components and custom hooks",
    color: "bg-blue-500",
    colorKey: "blue",
    createdAt: "2 weeks ago",
  };

  const colorMap = {
    blue: "rgba(59, 130, 246, 0.15)",
  };

  // Mock snippets in this folder
  const mockSnippets = [
    {
      id: 1,
      title: "useLocalStorage Hook",
      description:
        "Custom hook for managing localStorage with React state synchronization",
      language: "JavaScript",
      lastModified: "2 days ago",
      views: 234,
      lines: 45,
    },
    {
      id: 2,
      title: "Modal Component",
      description:
        "Accessible modal dialog with backdrop and keyboard navigation",
      language: "TypeScript",
      lastModified: "5 days ago",
      views: 412,
      lines: 78,
    },
    {
      id: 3,
      title: "useDebounce Hook",
      description: "Debounce hook for optimizing search inputs and API calls",
      language: "JavaScript",
      lastModified: "1 week ago",
      views: 567,
      lines: 23,
    },
    {
      id: 4,
      title: "Dropdown Menu",
      description:
        "Customizable dropdown with keyboard navigation and positioning logic",
      language: "TypeScript",
      lastModified: "1 week ago",
      views: 189,
      lines: 92,
    },
    {
      id: 5,
      title: "useIntersectionObserver",
      description:
        "Hook for detecting element visibility with lazy loading support",
      language: "JavaScript",
      lastModified: "3 days ago",
      views: 321,
      lines: 34,
    },
    {
      id: 6,
      title: "Toast Notification",
      description:
        "Lightweight toast component with auto-dismiss and positioning",
      language: "TypeScript",
      lastModified: "4 days ago",
      views: 445,
      lines: 67,
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Folders
        </Button>

        {/* Folder Header */}
        <div className="rounded-lg p-6 mb-6 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-12 h-12 ${folder.color} bg-opacity-10 rounded-lg flex items-center justify-center`}
                >
                  <Code2
                    className={`w-6 h-6 ${folder.color.replace(
                      "bg-",
                      "text-"
                    )}`}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">{folder.name}</h1>
                  <p className="text-sm opacity-70">{folder.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm opacity-70 mt-3">
                <span>{mockSnippets.length} snippets</span>
                <span>•</span>
                <span>Created {folder.createdAt}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Snippet
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
            <Input
              placeholder="Search snippets in this folder..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort:{" "}
                {sortBy === "recent"
                  ? "Recent"
                  : sortBy === "name"
                  ? "Name"
                  : "Most Viewed"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("recent")}>
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("views")}>
                Most Viewed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="border rounded-lg p-4 hover:border-opacity-100 transition-all cursor-pointer group flex flex-col h-full"
              onClick={() => {}}
            >
              {/* Content Section */}
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{snippet.title}</h3>
                    <p className="text-sm opacity-70 line-clamp-2">
                      {snippet.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs opacity-70 mb-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{snippet.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Code2 className="w-3 h-3" />
                    <span>{snippet.lines} lines</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{snippet.lastModified}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t mt-auto">
                <Badge variant="secondary" className="text-xs">
                  <Code2 className="w-3 h-3 mr-1" />
                  {snippet.language}
                </Badge>
                <Button variant="ghost" size="sm" className="text-xs h-8">
                  View Code
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {mockSnippets.length === 0 && (
          <div className="text-center py-16 border rounded-lg">
            <Code2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">No snippets yet</h3>
            <p className="text-sm opacity-70 mb-4">
              Start adding snippets to this folder
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add First Snippet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FolderIdPage;
