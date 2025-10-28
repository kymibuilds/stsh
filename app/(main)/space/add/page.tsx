"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Globe2, Save } from "lucide-react";
import React, { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

function AddPage() {
  const [code, setCode] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");

  const { user } = useUser();
  const supabase = useSupabase();

  const onSaveHandler = async () => {
    if (!title.trim() || !language.trim()) return;

    const { data, error } = await supabase.from("snippets").insert([
      {
        user_id: user?.id,
        title,
        description,
        code,
        language,
        tags: [], // optional
        is_public: isPublic,
        is_pinned: false,
      },
    ]);
    if (error) {
      console.error(
        "Supabase error:",
        error.message,
        error.details,
        error.hint
      );
      toast.error(error.message || "Insert failed");
      return;
    } else toast.success("Snippet saved successfully");
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header Section */}
        <div className="border-b pb-4 mb-4">
          <h1 className="text-xl font-semibold mb-3">Create New Snippet</h1>

          {/* Form Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Title Input */}
            <div className="lg:col-span-5">
              <Input
                placeholder="Title (required)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Language Select */}
            <div className="lg:col-span-3">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <div className="grid grid-cols-2 gap-1">
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="swift">Swift</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="kotlin">Kotlin</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="dart">Dart</SelectItem>
                    <SelectItem value="scala">Scala</SelectItem>
                    <SelectItem value="perl">Perl</SelectItem>
                    <SelectItem value="haskell">Haskell</SelectItem>
                    <SelectItem value="lua">Lua</SelectItem>
                    <SelectItem value="shell">Shell</SelectItem>
                    <SelectItem value="r">R</SelectItem>
                    <SelectItem value="matlab">MATLAB</SelectItem>
                    <SelectItem value="objective-c">Objective-C</SelectItem>
                    <SelectItem value="elixir">Elixir</SelectItem>
                    <SelectItem value="clojure">Clojure</SelectItem>
                    <SelectItem value="fsharp">F#</SelectItem>
                    <SelectItem value="erlang">Erlang</SelectItem>
                    <SelectItem value="solidity">Solidity</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="assembly">Assembly</SelectItem>
                  </div>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row gap-2">
              <Button
                variant={isPublic ? "default" : "outline"}
                onClick={() => setIsPublic(!isPublic)}
                className="flex-1 sm:flex-none sm:w-28"
              >
                <Globe2 className="w-4 h-4 mr-2" />
                {isPublic ? "Public" : "Private"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={onSaveHandler}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-3">
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-16 resize-none"
            />
          </div>
        </div>

        {/* Code Editor */}
        <div className="border rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm font-medium">Code Editor</span>
            <span className="text-xs opacity-70">
              {code.split("\n").length} lines
            </span>
          </div>
          <ReactCodeMirror
            height="500px"
            value={code}
            theme={vscodeDark}
            onChange={(value) => setCode(value)}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              searchKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export default AddPage;
