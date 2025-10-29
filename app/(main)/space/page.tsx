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
  Folder as FolderIcon,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Snippet } from "@/types";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import ReactCodeMirror from "@uiw/react-codemirror";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Custom Snippet Viewer Modal
function CustomSnippetViewer({ 
  snippet, 
  onClose, 
  onSave, 
  onCopy 
}: { 
  snippet: Snippet;
  onClose: () => void;
  onSave: (code: string, isPublic: boolean) => Promise<void>;
  onCopy: (code: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(snippet.code);
  const [isPublic, setIsPublic] = useState(snippet.is_public || false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedCode(snippet.code);
    setIsPublic(snippet.is_public || false);
    setIsEditing(false);
  }, [snippet]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(editedCode, isPublic);
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-lg shadow-lg border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-semibold mb-1">
                {snippet.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {snippet.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Badge variant="secondary" className="text-xs">
              <Code2 className="w-3 h-3 mr-1.5" />
              {snippet.language}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(snippet.created_at).toLocaleDateString()}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {isPublic ? (
                <Globe className="w-4 h-4 text-green-600" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <Label className="text-sm">
                {isPublic ? "Public" : "Private"}
              </Label>
              <Switch 
                checked={isPublic} 
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 240px)' }}>
          <div className="rounded-md overflow-hidden border">
            <ReactCodeMirror
              value={isEditing ? editedCode : snippet.code}
              height="500px"
              theme="dark"
              editable={isEditing}
              onChange={(val) => setEditedCode(val)}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button onClick={() => onCopy(snippet.code)}>
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
                    onClick={() => {
                      setIsEditing(false);
                      setEditedCode(snippet.code);
                      setIsPublic(snippet.is_public || false);
                    }}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
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
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  // Folder dialog state
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [snippetForFolder, setSnippetForFolder] = useState<Snippet | null>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [linking, setLinking] = useState(false);

  const supabase = useSupabase();
  const { user } = useUser();

  // Get unique languages from snippets
  const availableLanguages = useMemo(() => {
    const langs = new Set(snippets.map(s => s.language));
    return Array.from(langs).sort();
  }, [snippets]);

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

  useEffect(() => {
    if (user) fetchSnippets();
  }, [user]);

  // --- Helpers ---
  const openAddToFolder = (snippet: Snippet) => {
    setSnippetForFolder(snippet);
    setFolderDialogOpen(true);
  };

  // fetch folders when dialog opens
  useEffect(() => {
    if (!folderDialogOpen) return;
    const fetchFolders = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (!error) setFolders(data || []);
    };
    fetchFolders();
  }, [folderDialogOpen, user, supabase]);

  // --- Save Snippet ---
  const handleSave = async (code: string, isPublic: boolean) => {
    if (!selected) return;
    try {
      const { error } = await supabase
        .from("snippets")
        .update({
          code: code,
          is_public: isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selected.id);

      if (error) throw error;

      setSnippets((prev) =>
        prev.map((s) =>
          s.id === selected.id
            ? { ...s, code: code, is_public: isPublic }
            : s
        )
      );

      setSelected({ ...selected, code: code, is_public: isPublic });
      toast.success("Snippet updated");
    } catch {
      toast.error("Failed to update snippet");
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

  // add snippet to folder
  const handleAddToFolder = async (folderId: string | undefined) => {
    if (!snippetForFolder || !folderId || !user) {
      toast.error("Missing data");
      return;
    }
    setLinking(true);
    try {
      const { error } = await supabase.from("snippet_folders").insert([
        {
          snippet_id: snippetForFolder.id,
          folder_id: folderId,
        },
      ]);
      if (error) throw error;
      toast.success("Added to folder");
      setFolderDialogOpen(false);
      setSnippetForFolder(null);
      setSelectedFolderId("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add to folder");
    } finally {
      setLinking(false);
    }
  };

  // create folder and link
  const handleCreateFolderAndLink = async () => {
    if (!newFolderName.trim() || !user || !snippetForFolder) {
      toast.error("Provide folder name");
      return;
    }
    setCreatingFolder(true);
    try {
      const { data, error } = await supabase
        .from("folders")
        .insert([
          {
            name: newFolderName.trim(),
            user_id: user.id,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      setFolders((prev) => [...prev, data]);
      setNewFolderName("");
      await handleAddToFolder(data.id);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create folder");
    } finally {
      setCreatingFolder(false);
    }
  };

  const pinnedSnippets = useMemo(
    () => snippets.filter((s) => s.is_pinned),
    [snippets]
  );

  const allSnippets = useMemo(() => {
    let filtered = snippets.filter((s) => !s.is_pinned);
    
    // Language filter
    if (language !== "all") {
      filtered = filtered.filter((s) => s.language === language);
    }
    
    // Visibility filter
    if (visibilityFilter === "public") {
      filtered = filtered.filter((s) => s.is_public === true);
    } else if (visibilityFilter === "private") {
      filtered = filtered.filter((s) => s.is_public === false || !s.is_public);
    }
    
    // Search filter
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query) ||
          s.code.toLowerCase().includes(query)
      );
    }
    
    // Sorting
    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    
    return filtered;
  }, [snippets, searchQuery, sortBy, language, visibilityFilter]);

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
                placeholder="Search snippets by title, description, or code..."
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
                <SelectItem value="all">All Languages</SelectItem>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Snippets</SelectItem>
                <SelectItem value="public">Public Only</SelectItem>
                <SelectItem value="private">Private Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm opacity-70">
              {pinnedSnippets.length + allSnippets.length} snippets
              {searchQuery && ` (${allSnippets.length} filtered)`}
            </p>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                <SnippetCard
                  key={s.id}
                  snippet={s}
                  onView={setSelected}
                  onOpenAddToFolder={openAddToFolder}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Snippets */}
        <section>
          <h2 className="font-semibold mb-4">All Snippets</h2>
          {allSnippets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No snippets found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {allSnippets.map((s) => (
                <SnippetCard
                  key={s.id}
                  snippet={s}
                  onView={setSelected}
                  onOpenAddToFolder={openAddToFolder}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Custom Snippet Viewer */}
      {selected && (
        <CustomSnippetViewer
          snippet={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onCopy={handleCopy}
        />
      )}

      {/* Add to Folder Dialog */}
      <Dialog open={folderDialogOpen} onOpenChange={(open) => {
        setFolderDialogOpen(open);
        if (!open) setSnippetForFolder(null);
      }}>
        <DialogContent className="max-w-2xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>Add snippet to folder</DialogTitle>
            <DialogDescription>
              {snippetForFolder && `Adding "${snippetForFolder.title}" to a folder. Select a folder or create one.`}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <Label className="text-sm mb-2">Your folders</Label>
              {folders.length === 0 && <p className="text-sm opacity-70">No folders yet.</p>}
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {folders.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleAddToFolder(f.id)}
                    disabled={linking}
                    className="w-full text-left border rounded px-3 py-2 hover:bg-accent/20 flex items-center justify-between disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <FolderIcon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{f.name}</div>
                        <div className="text-xs opacity-70">{f.description || ""}</div>
                      </div>
                    </div>
                    <div className="text-xs opacity-70">Add</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t">
              <Label className="text-sm mb-2">Create new folder</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Folder name" 
                  value={newFolderName} 
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFolderAndLink();
                    }
                  }}
                />
                <Button onClick={handleCreateFolderAndLink} disabled={creatingFolder || !newFolderName.trim()}>
                  {creatingFolder ? "..." : <><Plus className="w-4 h-4 mr-2" />Create & Add</>}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setFolderDialogOpen(false);
              setSnippetForFolder(null);
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Snippet Card ---
function SnippetCard({
  snippet,
  onView,
  onOpenAddToFolder,
}: {
  snippet: Snippet;
  onView: (s: Snippet) => void;
  onOpenAddToFolder: (s: Snippet) => void;
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
    const { error } = await supabase.from("snippets").delete().eq("id", snippet.id);
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
          <p className="text-sm opacity-70 line-clamp-2">{snippet.description}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-50">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleCopy(snippet.code)}>
              <Copy className="w-3 h-3 mr-2" /> Copy Code
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onOpenAddToFolder(snippet)}>
              <FolderIcon className="w-3 h-3 mr-2" /> Add to Folder
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
        <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => onView(snippet)}>
          View
        </Button>
      </div>
    </div>
  );
}

export default SpacePage;