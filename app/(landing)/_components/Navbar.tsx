"use client";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const items = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Github", href: "#" },
];

function Navbar() {
  const router = useRouter();
  return (
    <div className="w-full bg-transparent p-2 flex items-center justify-between">
      <div>STSH</div>
      <div className="flex items-center justify-center gap-2">
        <Button variant={"ghost"} size={"sm"}>
          Features
        </Button>
        <Button variant={"ghost"} size={"sm"}>
          Pricing
        </Button>
        <SignedIn>
          <Button size={"sm"} onClick={() => router.push("/space")}>
            Let's Go
          </Button>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button size={"sm"}>Get Started</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

export default Navbar;
