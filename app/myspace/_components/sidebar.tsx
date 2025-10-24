"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function Sidebar() {
  const [activeTab, setActiveTab] = useState("personal");
  const { user } = useUser();
  const { userId } = useAuth();

  return (
    <div className="flex flex-col h-full w-64 p-2 border-r border-gray-200 gap-3">
      <div className="w-full h-9 flex items-center justify-center">
        <p className="font-black">STSH.</p>
      </div>
      {/* User Info */}
      <div className="w-full border h-9 flex items-center justify-center gap-2">
        <UserButton />
        <p>{user?.firstName}</p>
      </div>

      <div className="w-full h-9 flex border">
        <div
          className={`w-1/2 flex items-center justify-center cursor-pointer transition-colors duration-200
          ${
            activeTab === "personal"
              ? "bg-black text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("personal")}
        >
          <p>Personal</p>
        </div>
        <div
          className={`w-1/2 flex items-center justify-center cursor-pointer transition-colors duration-200
          ${
            activeTab === "teams" ? "bg-black text-white" : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("teams")}
        >
          <p>Teams</p>
        </div>
      </div>

      <div className="h-full w-full p-2"></div>
    </div>
  );
}

export default Sidebar;
