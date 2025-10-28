"use client";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { getCurrentTime } from "@/lib/utils";
import { UserButton, UserProfile } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { PlusIcon, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function Topbar() {
    const router = useRouter();
    const {user,} = useUser();
  return (
    <div className="w-full py-2 px-10 flex items-center justify-between border-b">
      {/* search bar */}
      <div className="flex items-center justify-center gap-2">
        <UserButton />
        <p className="font-semibold">{user?.firstName}</p>
      </div>

        <div className="text-muted-foreground text-xs">{getCurrentTime()}</div>
      {/* right side */}
      <div className="flex items-center gap-3">
        <Button className="flex items-center justify-center gap-2" variant={"outline"} onClick={()=>{router.push("/space/folders")}}>
          <PlusIcon className="w-4 h-4" />
          <span className="font-semibold">New Folder</span>
        </Button>
        <Button className="flex items-center justify-center gap-2" onClick={()=>{router.push("/space/add")}}>
          <PlusIcon className="w-4 h-4" />
          <span className="font-semibold">New Snippet</span>
        </Button>
        
      </div>
    </div>
  );
}

export default Topbar;
