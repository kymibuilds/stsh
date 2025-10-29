"use client";
import { JetBrains_Mono } from "next/font/google";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ArrowRight } from "lucide-react";
import React from "react";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

function Heroes() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-12 py-24 px-6 max-w-6xl mx-auto">
      {/* Left */}
      <div className="flex-1 text-left">
        <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-4">
          A place to store your code snippets.
        </h1>
        <p className="text-gray-500 text-lg max-w-md">
          Save, organize, and access your favorite pieces of code effortlessly.
        </p>
        <div className="h-5" />
        <RainbowButton
          variant="outline"
          className="flex items-center justify-center gap-1"
          size="lg"
        >
          Get Started <ArrowRight />
        </RainbowButton>
      </div>

      {/* Right: Code Block */}
      <div className="flex-1 w-full max-w-lg relative">
        <div className="bg-[#0F172A] text-gray-100 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700 bg-[#1E293B]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="ml-3 text-sm text-gray-400 font-medium select-none">
              snippet.js
            </span>
          </div>

          {/* Code block */}
          <div className={`p-6 text-sm leading-relaxed ${jetbrains.className}`}>
            <div className="text-gray-500 mt-2">
              // that's a good fucking code.
            </div>
            <span className="text-cyan-400">const</span>
            <span className="text-gray-100"> snippet </span>
            <span className="text-white">=</span>
            <span className="text-amber-400"> "saved";</span>
            <div className="text-gray-500 mt-2">// never lose it again</div>
            <div className="text-green-400 mt-4">saveSnippet(snippet);</div>
          </div>
        </div>

        {/* VSCode Extension Badge */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-max">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-6 py-3 shadow-2xl">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-blue-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
              </svg>
              <span className="text-white font-medium text-sm tracking-wide">
                VSCode Extension Coming Soon
              </span>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Heroes;
