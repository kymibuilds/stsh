"use client";

import React, { useEffect, useState } from "react";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useAuth, useUser } from "@clerk/nextjs";
import { Snippet } from "@/types";
import { Button } from "@/components/ui/button";
import SnippetBox from "./_components/snippetBox";
import CreateSnippetPopup from "@/components/popup/createSnippetPopup";

export default function MySpacePage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("Not authenticated");
      const supabase = createSupabaseClient(token);
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSnippets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Your Snippets
          </h1>
          <p className="text-gray-600">
            {snippets.length} snippet{snippets.length !== 1 && "s"}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <p> create a new snippet</p>
          <Button variant={"outline"}>
            <CreateSnippetPopup refreshSnippets={fetchSnippets} />
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12 text-gray-600">
          Loading snippets...
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      ) : snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-600 gap-2">
          <p>No snippets yet!</p>
          <Button>
            <CreateSnippetPopup refreshSnippets={fetchSnippets} />
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {snippets.map((snippet) => (
            <SnippetBox key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
}
