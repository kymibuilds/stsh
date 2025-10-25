"use client";

import React, { useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import ItemList from "./itemList";
import { Ellipsis, Folder, Plus } from "lucide-react";
import CreateSnippetPopup from "@/components/popup/createSnippetPopup";

function Sidebar() {
  const [activeTab, setActiveTab] = useState<"personal" | "teams">("personal");
  const { user } = useUser();

  return (
    <aside className="flex flex-col h-full w-64 border-r border-gray-200">
      {/* Brand / Logo */}
      <div className="h-12 flex items-center justify-center border-b">
        <p className="font-black text-lg tracking-tight">STSH.</p>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-2 px-3 py-2 border-b">
        <UserButton />
        <p className="font-medium truncate">{user?.firstName || "User"}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b text-sm font-medium">
        {["personal", "teams"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab as "personal" | "teams")}
            className={`w-1/2 py-2 text-center cursor-pointer transition-colors duration-200
              ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            {tab === "personal" ? "Personal" : "Teams"}
          </div>
        ))}
      </div>
      <div className="w-full flex items-center justify-end py-1 px-2">
        <CreateSnippetPopup />
        <div className="p-1 shrink-0 hover:bg-gray-100">
          <Folder className="w-4 h-4"/>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "personal" ? (
          <ItemList />
        ) : (
          <div className="p-4 text-sm text-gray-500">Teams coming soon...</div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
