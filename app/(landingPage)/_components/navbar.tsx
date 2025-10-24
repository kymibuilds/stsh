"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import BrandingTitle from "./brandingTitle";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  
  return (
    <div className="w-full flex items-center justify-between">
      <BrandingTitle />
      <div className="flex items-center justify-center gap-2">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant={"ghost"}>Login</Button>
          </SignInButton>
          <SignInButton mode="modal">
            <Button>Get Started</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="relative group">
            <button className="w-9 h-9 bg-black text-white flex items-center justify-center font-semibold hover:bg-neutral-800 transition-colors">
              {user?.firstName?.[0] || user?.username?.[0] || "U"}
            </button>
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50">
              <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden min-w-40">
                <button
                  onClick={() => openUserProfile()}
                  className="block w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  My Account
                </button>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-t border-neutral-200 dark:border-neutral-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
          <Button onClick={() => router.push("/myspace")}>Let's Go</Button>
        </SignedIn>
      </div>
    </div>
  );
}

export default Navbar;