"use client";

import { createSupabaseClient } from "@/utils/supabase/client";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Item from "./item";

function ItemList() {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<any[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("Not authenticated");

      const supabase = createSupabaseClient(token);

      // Fetch all snippet titles
      const { data, error } = await supabase
        .from("snippets")
        .select("id, title")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSnippets(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      console.error("Error fetching snippets:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading snippets...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (snippets.length === 0) {
    return <div className="p-4 text-gray-500">No snippets found.</div>;
  }

  return (
    <div className="p-1 w-full">
      <div className="flex flex-col gap-1">
        {snippets.map((snippet) => (
          <Item key={snippet.id} title={snippet.title || "Untitled"} />
        ))}
      </div>
    </div>
  );
}

export default ItemList;
