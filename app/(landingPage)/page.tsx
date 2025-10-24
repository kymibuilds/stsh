import { Button } from "@/components/ui/button";
import React from "react";
import Navbar from "./_components/navbar";
import Heroes from "./_components/heroes";

function MainPage() {
  return (
    <div className="flex-1 h-screen py-6 px-12">
      <Navbar />
      <Heroes />
    </div>
  );
}

export default MainPage;
