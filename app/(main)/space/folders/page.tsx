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
import { Search, Folder, Plus, MoreVertical, Code2, Calendar, FileText } from "lucide-react";
import React, { useState } from "react";

function FolderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Mock data for folders
  const mockFolders = [
    {
      id: 1,
      name: "React Components",
      description: "Reusable React components and custom hooks",
      snippetCount: 12,
      lastModified: "2 days ago",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Algorithms",
      description: "Common algorithms and data structures implementations",
      snippetCount: 8,
      lastModified: "5 days ago",
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "API Utils",
      description: "Helper functions for API calls and data fetching",
      snippetCount: 15,
      lastModified: "1 week ago",
      color: "bg-purple-500"
    },
    {
      id: 4,
      name: "Authentication",
      description: "Auth middleware, guards, and token management",
      snippetCount: 6,
      lastModified: "3 days ago",
      color: "bg-orange-500"
    },
    {
      id: 5,
      name: "Database Queries",
      description: "SQL queries and ORM patterns",
      snippetCount: 20,
      lastModified: "1 day ago",
      color: "bg-red-500"
    },
    {
      id: 6,
      name: "CSS Utilities",
      description: "Custom CSS classes and styling helpers",
      snippetCount: 9,
      lastModified: "4 days ago",
      color: "bg-pink-500"
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold">My Folders</h1>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          </div>
          <p className="text-sm opacity-70">
            Organize your snippets into folders for better management
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
            <Input 
              placeholder="Search folders..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stats and Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm opacity-70">{mockFolders.length} folders</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort: {sortBy === "recent" ? "Recent" : sortBy === "name" ? "Name" : "Snippet Count"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("recent")}>
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("count")}>
                Snippet Count
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockFolders.map((folder) => (
            <div 
              key={folder.id}
              className="border rounded-lg p-4 hover:border-opacity-100 transition-all cursor-pointer group"
              onClick={() => {}}
            >
              {/* Header with Icon and Menu */}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 ${folder.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                  <Folder className={`w-6 h-6 ${folder.color.replace('bg-', 'text-')}`} />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Change Color</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Folder Info */}
              <div className="mb-3">
                <h3 className="font-semibold mb-1">{folder.name}</h3>
                <p className="text-sm opacity-70 line-clamp-2">{folder.description}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-1 text-xs opacity-70">
                  <FileText className="w-3 h-3" />
                  <span>{folder.snippetCount} snippets</span>
                </div>
                <div className="flex items-center gap-1 text-xs opacity-70">
                  <Calendar className="w-3 h-3" />
                  <span>{folder.lastModified}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {mockFolders.length === 0 && (
          <div className="text-center py-16">
            <Folder className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">No folders yet</h3>
            <p className="text-sm opacity-70 mb-4">Create your first folder to organize snippets</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Folder
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FolderPage;