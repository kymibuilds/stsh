"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Heroes() {
  const router = useRouter();

  return (
    <div className="w-full px-6">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-5xl w-full space-y-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter">
                STSH
              </h1>
              <p className="text-2xl md:text-4xl font-light text-gray-500">
                stash your code. find it instantly. no cap.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                className="px-8 py-6 text-lg"
                onClick={() => router.push("/myspace")}
              >
                start stashing →
              </Button>
              <Button variant="ghost" className="px-8 py-6 text-lg">
                see how it works
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              "instant search",
              "syntax highlighting",
              "organize effortlessly",
              "share snippets",
            ].map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 bg-white text-black text-sm font-medium"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto py-32 space-y-32">
        {/* Feature 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold">save in seconds</h2>
            <p className="text-xl text-gray-500">
              copy, paste, done. no folders, no friction. just your code, saved
              and tagged automatically.
            </p>
          </div>
          <div className="bg-gray-900 h-64 flex items-center justify-center">
            <span className="text-gray-600 text-sm">[snippet preview]</span>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-900 h-64 flex items-center justify-center md:order-first">
            <span className="text-gray-600 text-sm">[search interface]</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-bold">find anything, fast</h2>
            <p className="text-xl text-gray-500">
              search by language, tag, or keyword. your snippets show up
              instantly. no endless scrolling.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold">share with the team</h2>
            <p className="text-xl text-gray-500">
              make snippets public or keep them private. share links,
              collaborate, level up together.
            </p>
          </div>
          <div className="bg-gray-900 h-64 flex items-center justify-center">
            <span className="text-gray-600 text-sm">[sharing options]</span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto py-32 text-center space-y-8">
        <h2 className="text-6xl md:text-8xl font-black">ready to stash?</h2>
        <p className="text-xl text-gray-500">
          join devs who actually ship. start organizing your code today.
        </p>
        <Button
          className="px-12 py-8 text-xl"
          onClick={() => router.push("/myspace")}
        >
          Let's GO →
        </Button>
        <p className="text-sm text-gray-600 pt-4">
          it's fucking free give it a try.
        </p>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto py-12 border-t border-gray-800 flex justify-between items-center">
        <p className="text-sm text-gray-600">© 2025 STSH. built different.</p>
        <div className="flex gap-6 text-sm text-gray-600">
          <Button
            variant="ghost"
            onClick={() => window.open("https://x.com/kymicrashedit", "_blank")}
          >
            twitter
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              window.open("https://github.com/kymibuilds", "_blank")
            }
          >
            github
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.open("https://discord.gg/yourlink", "_blank")}
          >
            discord
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Heroes;
