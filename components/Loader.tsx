// components/Loader.tsx
"use client";

import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
    </div>
  );
}
