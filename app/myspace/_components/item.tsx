import { Ellipsis, Notebook } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface itemProps {
  title: string;
}

function Item({ title }: itemProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onDelete = () => {};
  return (
    <div className="w-full flex items-center justify-between gap-2 group hover:bg-gray-100">
      <div className="flex items-center justify-center gap-1">
        <Notebook className="w-4 h-4 text-muted" />
        <p className="text-muted-foreground font-light">{title}</p>
      </div>
      <div className="relative">
        <Ellipsis
          className="w-4 h-4 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition p-1 cursor-pointer"
          color="black"
          onClick={() => setOpen((prev) => !prev)}
        />
        {open && (
          <div
            ref={popoverRef}
            className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-md z-50"
          >
            <div
              className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded"
              onClick={onDelete}
            >
              Delete
            </div>
            <div
              className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded"
              onClick={() => alert(`Editing "${title}"`)}
            >
              Edit
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Item;
