import React from "react";
import Navbar from "./_components/Navbar";
import Heroes from "./_components/Heroes";

function LandingPage() {
  return (
    <div className="flex-1 px-8 py-4">
      <Navbar />
      <Heroes />
    </div>
  );
}

export default LandingPage;
