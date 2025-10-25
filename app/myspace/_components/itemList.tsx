"use client";

import React from "react";
import { useSnippetsStore } from "@/store/snippetsStore";
import Item from "./item";

function ItemList() {
  const snippets = useSnippetsStore((state) => state.snippets);
  const isLoading = useSnippetsStore((state) => state.isLoading);
  const error = useSnippetsStore((state) => state.error);

  if (isLoading) {
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
