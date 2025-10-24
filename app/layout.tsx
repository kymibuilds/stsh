import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "@/app/globals.css";
import { Oxanium } from "next/font/google";
import { shadcn } from "@clerk/themes";

// Import Oxanium font
const oxanium = Oxanium({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "STSH.",
  description: "Stash Now, find later.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        theme: "simple",
      }}
    >
      <html lang="en" className={oxanium.className}>
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
