"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Code2,
  User,
  Eye,
  Calendar,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Snippet } from "@/types";

function FindPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [language, setLanguage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useSupabase();

  // Fetch public snippets
  const fetchPublicSnippets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSnippets(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicSnippets();
  }, []);

  // Filtering + sorting
  const filteredSnippets = useMemo(() => {
    let list = [...snippets];
    if (language !== "all")
      list = list.filter((s) => s.language === language);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      );
    }
    if (sortBy === "recent")
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    if (sortBy === "oldest")
      list.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    return list;
  }, [snippets, language, searchQuery, sortBy]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading public snippets...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-16 text-red-500">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Discover Snippets</h1>
          <p className="text-sm opacity-70">
            Browse public snippets shared by other users.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
              <Input
                placeholder="Search snippets..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {[
                  "javascript",
                  "typescript",
                  "python",
                  "java",
                  "css",
                  "html",
                ].map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort & Filters */}
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-70">{filteredSnippets.length} snippets found</p>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Sort:{" "}
                    {sortBy === "recent"
                      ? "Recent"
                      : sortBy === "oldest"
                      ? "Oldest"
                      : "Popular"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("recent")}>
                    Most Recent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                    Oldest
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="border rounded-lg p-4 hover:bg-accent/30 transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="font-semibold mb-1">{snippet.title}</h3>
                  <p className="text-sm opacity-70 line-clamp-2">
                    {snippet.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs opacity-70 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{snippet.author_name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(snippet.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t mt-auto">
                <Badge variant="secondary" className="text-xs">
                  <Code2 className="w-3 h-3 mr-1" />
                  {snippet.language}
                </Badge>
                <Button variant="ghost" size="sm" className="text-xs h-8">
                  View Code
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredSnippets.length === 0 && (
          <div className="text-center py-16">
            <Code2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">No snippets found</h3>
            <p className="text-sm opacity-70">
              Try changing filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindPage;
