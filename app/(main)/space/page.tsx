"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Code2,
  Calendar,
  MoreVertical,
  Pin,
  ArrowUpDown,
  Copy,
  Edit,
  Save,
  X,
  Globe,
  Lock,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Snippet } from "@/types";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import ReactCodeMirror from "@uiw/react-codemirror";

// --- Custom Modal Component ---
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-xl shadow-lg w-[95vw] max-w-[1200px] max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function SpacePage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selected, setSelected] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [language, setLanguage] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = useSupabase();
  const { user } = useUser();

  // --- Fetch Snippets ---
  const fetchSnippets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSnippets(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to fetch snippets");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      if (navigator?.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast.success("Code copied!");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  useEffect(() => {
    if (user) fetchSnippets();
  }, [user]);

  useEffect(() => {
    if (selected) {
      setEditedCode(selected.code);
      setIsPublic(selected.is_public || false);
      setIsEditing(false);
    }
  }, [selected]);

  // --- Save Snippet ---
  const handleSave = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("snippets")
        .update({
          code: editedCode,
          is_public: isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selected.id);

      if (error) throw error;

      setSnippets((prev) =>
        prev.map((s) =>
          s.id === selected.id
            ? { ...s, code: editedCode, is_public: isPublic }
            : s
        )
      );

      setSelected({ ...selected, code: editedCode, is_public: isPublic });
      setIsEditing(false);
      toast.success("Snippet updated");
    } catch {
      toast.error("Failed to update snippet");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublicToggle = async (checked: boolean) => {
    if (!selected) return;
    setIsPublic(checked);
    try {
      const { error } = await supabase
        .from("snippets")
        .update({ is_public: checked })
        .eq("id", selected.id);
      if (error) throw error;
      setSnippets((prev) =>
        prev.map((s) =>
          s.id === selected.id ? { ...s, is_public: checked } : s
        )
      );
      toast.success(checked ? "Public" : "Private");
    } catch {
      setIsPublic(!checked);
      toast.error("Failed to update visibility");
    }
  };

  const pinnedSnippets = useMemo(
    () => snippets.filter((s) => s.is_pinned),
    [snippets]
  );

  const allSnippets = useMemo(() => {
    let filtered = snippets.filter((s) => !s.is_pinned);
    if (language !== "all")
      filtered = filtered.filter((s) => s.language === language);
    if (searchQuery.trim().length > 0) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === "name")
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "recent")
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    return filtered;
  }, [snippets, searchQuery, sortBy, language]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading snippets...</p>
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
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold">My Snippets</h1>
          </div>
          <p className="text-sm opacity-70">Manage your code snippets</p>
        </div>

        {/* Filters */}
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

          <div className="flex items-center justify-between">
            <p className="text-sm opacity-70">
              {pinnedSnippets.length + allSnippets.length} snippets
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sort: {sortBy === "recent" ? "Recent" : "Name"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("recent")}>
                  Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Name (A–Z)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Pinned */}
        {pinnedSnippets.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Pin className="w-4 h-4" />
              <h2 className="font-semibold">Pinned</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pinnedSnippets.map((s) => (
                <SnippetCard key={s.id} snippet={s} onView={setSelected} />
              ))}
            </div>
          </section>
        )}

        {/* All Snippets */}
        <section>
          <h2 className="font-semibold mb-4">All Snippets</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {allSnippets.map((s) => (
              <SnippetCard key={s.id} snippet={s} onView={setSelected} />
            ))}
          </div>
        </section>
      </div>

      {/* --- Custom Modal --- */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">{selected.title}</h2>
                <p className="text-sm opacity-70">{selected.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="text-sm">
                <Code2 className="w-3 h-3 mr-1" />
                {selected.language}
              </Badge>
              <div className="flex items-center gap-2">
                {isPublic ? (
                  <Globe className="w-4 h-4 text-green-600" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-600" />
                )}
                <Label className="text-sm">
                  {isPublic ? "Public" : "Private"}
                </Label>
                <Switch
                  checked={isPublic}
                  onCheckedChange={handlePublicToggle}
                />
              </div>
            </div>

            <ReactCodeMirror
              value={isEditing ? editedCode : selected.code}
              height="500px"
              theme="dark"
              editable={isEditing}
              onChange={(val) => setEditedCode(val)}
            />

            <div className="flex gap-3 mt-4">
              {!isEditing ? (
                <>
                  <Button onClick={() => handleCopy(selected.code)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

// --- Snippet Card ---
function SnippetCard({
  snippet,
  onView,
}: {
  snippet: Snippet;
  onView: (s: Snippet) => void;
}) {
  const supabase = useSupabase();

  const handleCopy = async (text: string) => {
    try {
      if (navigator?.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast.success("Code copied!");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this snippet?");
    if (!confirmDelete) return;
    const { error } = await supabase
      .from("snippets")
      .delete()
      .eq("id", snippet.id);
    if (error) toast.error("Failed to delete");
    else toast.success("Snippet deleted");
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col hover:bg-accent/30 transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{snippet.title}</h3>
            {snippet.is_public && <Globe className="w-3 h-3 text-green-600" />}
          </div>
          <p className="text-sm opacity-70 line-clamp-2">
            {snippet.description}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-50"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleCopy(snippet.code)}>
              <Copy className="w-3 h-3 mr-2" /> Copy Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <X className="w-3 h-3 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3 text-xs opacity-70 mb-3">
        <Calendar className="w-3 h-3" />
        <span>{new Date(snippet.created_at).toLocaleDateString()}</span>
      </div>

      <div className="flex justify-between items-center border-t pt-3 mt-auto">
        <Badge variant="secondary" className="text-xs">
          <Code2 className="w-3 h-3 mr-1" />
          {snippet.language}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-8"
          onClick={() => onView(snippet)}
        >
          View
        </Button>
      </div>
    </div>
  );
}

export default SpacePage;
