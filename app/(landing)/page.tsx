"use client";
import React from "react";
import Navbar from "./_components/Navbar";
import Heroes from "./_components/Heroes";
import ColorBends from "@/components/ColorBends";
import Features from "./_components/Features";

function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background - Fixed and behind everything */}
      <div className="fixed inset-0 -z-10">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={30}
          speed={0.2}
          scale={3}
          frequency={1.8}
          warpStrength={1.2}
          mouseInfluence={0.8}
          parallax={0.6}
          noise={0.08}
          transparent
        />
      </div>

      {/* Content - Scrollable and above background */}
      <div className="relative h-screen z-10 flex-1 px-8 py-4 items-center justify-center">
        <Navbar />
        <Heroes />
        <Features />
      </div>
    </div>
  );
}

export default LandingPage;
