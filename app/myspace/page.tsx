"use client";
import React, { useEffect, useState } from "react";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useAuth, useUser } from "@clerk/nextjs";
import { Snippet } from "@/types";
import { Button } from "@/components/ui/button";
import SnippetBox from "./_components/snippetBox";

function MySpacePage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pinned, all] = useState("pinned");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    language: "JavaScript",
  });

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken({ template: "supabase" });

      if (!token) {
        throw new Error("Not authenticated");
      }

      const supabase = createSupabaseClient(token);

      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSnippets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching snippets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnippet = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const token = await getToken({ template: "supabase" });

      if (!token || !user) {
        throw new Error("Not authenticated");
      }

      const supabase = createSupabaseClient(token);

      const { data, error } = await supabase
        .from("snippets")
        .insert([
          {
            title: formData.title,
            content: formData.content,
            language: formData.language,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;

      // Add new snippet to the list
      if (data) {
        setSnippets([data[0], ...snippets]);
      }

      // Reset form and close modal
      setFormData({ title: "", content: "", language: "JavaScript" });
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error creating snippet:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full min-h-screen flex-1 p-6">
      <div className="w-full mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Snippets
          </h1>
          <p className="text-gray-600">Total snippets: {snippets.length}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Create Snippet</Button>
      </div>

      <div className="w-full">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-700 text-lg">Loading snippets...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}

        {!loading && !error && snippets.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No snippets found. Create your first snippet!
          </div>
        )}

        {!loading && !error && snippets.length > 0 && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {snippets.map((snippet) => (
              <SnippetBox key={snippet.id} snippet={snippet} />
            ))}
          </div>
        )}
      </div>

      {/* Create Snippet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create New Snippet
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateSnippet}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., React useEffect Hook"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="C#">C#</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                    <option value="Ruby">Ruby</option>
                    <option value="PHP">PHP</option>
                    <option value="SQL">SQL</option>
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                    <option value="Bash">Bash</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Code
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Paste your code here..."
                    rows={12}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-blue-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Snippet"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MySpacePage;
