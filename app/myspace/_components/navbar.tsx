"use client";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useClerk, useUser } from "@clerk/nextjs";
import { Settings } from "lucide-react";
import React from "react";

function Navbar() {
  const { signOut, openUserProfile } = useClerk();
  const { user } = useUser();

  return (
    <div className="w-full flex items-center justify-end gap-2 p-2 border-b border-gray-200">
      {/* User Menu */}
      <div className="relative group">
        <button className="w-9 h-9 bg-white text-black border border-black flex items-center justify-center font-semibold ">
          <p className="font-light text-xl"> {user?.firstName?.[0] || user?.username?.[0] || "U"}</p>
        </button>
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <button
            onClick={() => openUserProfile()}
            className="block w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            Profile
          </button>
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Settings Drawer */}
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <button className="w-9 h-9 bg-white border border-black flex items-center justify-center">
            <Settings color="black" strokeWidth={1.25} />
          </button>
        </DrawerTrigger>
        <DrawerContent className="w-80 sm:max-w-80">
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>
              <AnimatedThemeToggler />
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Appearance</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Customize how the app looks and feels.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Manage your notification preferences.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Privacy</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Control your privacy settings.
              </p>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default Navbar;