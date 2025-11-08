"use client";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();
  return (
    <nav className="w-full bg-transparent px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Image 
          src={"/logo-dark.png"} 
          width={80} 
          height={80} 
          alt="logo"
          className="cursor-pointer"
          priority
        />
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-sm font-medium hover:bg-accent"
          onClick={() => window.open("https://github.com/kymibuilds/stsh", "_blank")}
        >
          Github
        </Button>
        
        <SignedIn>
          <Button 
            size="sm" 
            onClick={() => router.push("/space")}
            className="font-medium"
          >
            Let's Go
          </Button>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="sm" className="font-medium">
              Get Started
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}

export default Navbar;