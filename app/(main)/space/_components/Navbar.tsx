"use client";
import {
  Folder,
  Heart,
  Home,
  Plus,
  Search,
  Settings,
  Github,
  Twitter,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
}

function NavItem({ icon: Icon, label, href }: NavItemProps) {
  const router = useRouter();
  return (
    <button
      className="w-full py-2.5 px-3 flex items-center gap-3 text-sm rounded-lg hover:bg-white/5 transition-colors group"
      onClick={() => {
        router.push(href);
      }}
    >
      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </button>
  );
}
 
export default function Navbar() {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <aside className="relative h-screen w-80 border-r border-border flex flex-col">
      {/* collapse icon */}
      <div className="absolute top-2 right-2 hover:bg-white/10 p-1 rounded-md cursor-pointer">
        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
      </div>
      {/* logo */}
      <div className="flex items-center justify-center pt-8 pb-6">
        <Image
          src={logoSrc}
          alt="logo"
          width={160}
          height={160}
          priority
          className="object-contain"
        />
      </div>
      {/* nav links */}
      <nav className="flex-1 px-3 space-y-1">
        <NavItem icon={Home} label="Home" href="/space" />
        <NavItem icon={Folder} label="Folders" href="/space/folders" />
        <NavItem icon={Search} label="Find" href="/space/find" />
        <NavItem icon={Plus} label="Add Snippet" href="/space/add" />
        <NavItem icon={Settings} label="Settings" href="/space/settings" />
      </nav>
      {/* footer */}
      <footer className="border-t border-border px-3 py-4 space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span>made with</span>
          <Heart className="w-3 h-3" />
          <span>by kymi</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/kymibuilds"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com/kymicrashedit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </aside>
  );
}
