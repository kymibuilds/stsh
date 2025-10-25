"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useSnippetsStore } from "@/store/snippetsStore";

const CreateSnippetPopup: React.FC = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { addSnippet } = useSnippetsStore();

  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [formData, setFormData] = useState({ name: "", code: "" });
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    "JavaScript", "TypeScript", "Python", "C++", "C#", "Go", "Rust",
    "HTML", "CSS", "SQL", "PHP", "Swift", "Kotlin", "Ruby", "Shell", "Java",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createSnippet = async () => {
    if (!formData.name || !formData.code || !selectedLanguage) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);

      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("Not authenticated");

      const supabase = createSupabaseClient(token);

      const newSnippet = {
        title: formData.name,
        content: formData.code,
        language: selectedLanguage,
        user_id: user?.id,
        created_at: new Date().toISOString(),
        is_pinned: false,
        description: "",
        tags: [],
      };

      const { data, error } = await supabase
        .from("snippets")
        .insert(newSnippet)
        .select()
        .single();

      if (error) throw error;

      // Add to Zustand store for instant visibility
      if (data) addSnippet(data);

      setOpen(false);
      setFormData({ name: "", code: "" });
      setSelectedLanguage("");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to create snippet");
    } finally {
      setIsLoading(false);
    }
  };

  const lineCount = formData.code.split("\n").length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1 shrink-0 hover:bg-gray-100 rounded transition-colors">
          <Plus className="w-4 h-4" color="black" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Code2 className="w-5 h-5" />
            Create New Code Snippet
          </DialogTitle>
          <DialogDescription className="text-sm">
            Add a new code snippet to your collection. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="grid gap-5 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Snippet Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., API Fetch Helper"
                  value={formData.name}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">
                  Language <span className="text-red-500">*</span>
                </Label>
                <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between w-full focus:ring-2 focus:ring-blue-500",
                        !selectedLanguage && "text-muted-foreground"
                      )}
                    >
                      {selectedLanguage || "Select language"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[280px]">
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {languages.map((lang) => (
                            <CommandItem
                              key={lang}
                              value={lang}
                              onSelect={() => {
                                setSelectedLanguage(lang);
                                setLanguageOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedLanguage === lang
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {lang}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="code" className="text-sm font-medium">
                  Code <span className="text-red-500">*</span>
                </Label>
                {formData.code && (
                  <span className="text-xs text-muted-foreground">
                    {lineCount} {lineCount === 1 ? "line" : "lines"}
                  </span>
                )}
              </div>
              <Textarea
                id="code"
                name="code"
                placeholder="Paste your code here..."
                className="font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 min-h-[300px] max-h-[400px]"
                value={formData.code}
                onChange={handleChange}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e1 #f1f5f9",
                }}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use Ctrl+V (Cmd+V on Mac) to paste code with formatting preserved
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50/50">
          <div className="flex gap-3 w-full sm:w-auto">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={createSnippet}
              disabled={isLoading || !formData.name || !formData.code || !selectedLanguage}
            >
              {isLoading ? "Creating..." : "Create Snippet"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSnippetPopup;
