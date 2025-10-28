"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/Loader";
import Topbar from "./_components/Topbar";
import Navbar from "./_components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return <Loader />;
  
  if (!isSignedIn) {
    return <Loader />; // Show loader while redirecting
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Navbar />
      {/* Right section */}
      <div className="flex flex-col flex-1 h-full">
        <Topbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}