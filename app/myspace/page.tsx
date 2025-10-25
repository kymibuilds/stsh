"use client";

import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSnippetsStore } from "@/store/snippetsStore";
import SnippetBox from "./_components/snippetBox";
import CreateSnippetPopup from "@/components/popup/createSnippetPopup";
import { Button } from "@/components/ui/button";

export default function MySpacePage() {
  const { getToken, userId } = useAuth();
  const { snippets, isLoading, error, fetchSnippets } = useSnippetsStore();

  useEffect(() => {
    if (userId) {
      const loadSnippets = async () => {
        const token = await getToken({ template: "supabase" });
        if (token) await fetchSnippets(token, userId);
      };
      loadSnippets();
    }
  }, [userId, getToken, fetchSnippets]);

  return (
    <div className="w-full min-h-screen p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Your Snippets</h1>
          <p className="text-gray-600">
            {snippets.length} snippet{snippets.length !== 1 && "s"}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <p>create a new snippet</p>
          <Button variant={"outline"}>
            <CreateSnippetPopup />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12 text-gray-600">Loading snippets...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      ) : snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-600 gap-2">
          <p>No snippets yet!</p>
          <Button>
            <CreateSnippetPopup />
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
