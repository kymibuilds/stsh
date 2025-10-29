"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import ReactCodeMirror from "@uiw/react-codemirror";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Code2,
  Eye,
  Copy,
  Save,
  X,
  Globe,
  Lock,
} from "lucide-react";

export default function FolderIdPage() {
  const { folderId } = useParams() as { folderId?: string };
  const router = useRouter();
  const supabase = useSupabase();
  const { user } = useUser();

  const [folder, setFolder] = useState<any | null>(null);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!folderId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data: folderData, error: folderErr } = await supabase
          .from("folders")
          .select("*")
          .eq("id", folderId)
          .single();
        if (folderErr) throw folderErr;
        setFolder(folderData);

        const { data: jf, error: jfErr } = await supabase
          .from("snippet_folders")
          .select("snippet_id")
          .eq("folder_id", folderId);
        if (jfErr) throw jfErr;
        const ids = (jf || []).map((r: any) => r.snippet_id);

        if (ids.length === 0) {
          setSnippets([]);
          setLoading(false);
          return;
        }

        const { data: snippetsData, error: snErr } = await supabase
          .from("snippets")
          .select("*")
          .in("id", ids)
          .order("created_at", { ascending: false });
        if (snErr) throw snErr;
        setSnippets(snippetsData || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load folder");
        toast.error("Failed to load folder");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [folderId, supabase]);

  useEffect(() => {
    if (selected) {
      setEditedCode(selected.code);
      setIsPublic(selected.is_public || false);
      setIsEditing(false);
    }
  }, [selected]);

  async function handleRename() {
    if (!folderId || !newName.trim()) return;
    const { error } = await supabase
      .from("folders")
      .update({ name: newName })
      .eq("id", folderId);
    if (error) {
      toast.error("Failed to rename folder");
      return;
    }
    toast.success("Folder renamed");
    setFolder((f: any) => ({ ...f, name: newName }));
    setRenameDialogOpen(false);
  }

  async function handleDelete() {
    if (!folderId) return;
    const { error } = await supabase.from("folders").delete().eq("id", folderId);
    if (error) {
      toast.error("Failed to delete folder");
      return;
    }
    toast.success("Folder deleted");
    router.push("/space");
  }

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

  async function handleSave() {
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
  }

  async function handlePublicToggle(checked: boolean) {
    if (!selected) return;
    setIsPublic(checked);
    try {
      const { error } = await supabase
        .from("snippets")
        .update({ is_public: checked })
        .eq("id", selected.id);
      if (error) throw error;
      toast.success(checked ? "Public" : "Private");
    } catch {
      setIsPublic(!checked);
      toast.error("Failed to update visibility");
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  if (error)
    return <div className="text-center py-16 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen w-full p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold">{folder?.name}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Folder Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
              <Edit className="w-4 h-4 mr-2" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter new name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this folder?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent. Snippets remain, but folder will be gone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Snippets List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {snippets.map((s) => (
          <div
            key={s.id}
            className="border rounded-lg p-4 flex flex-col hover:bg-accent/30 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{s.title}</h3>
                  {s.is_public && <Globe className="w-3 h-3 text-green-600" />}
                </div>
                <p className="text-sm opacity-70 line-clamp-2">
                  {s.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs opacity-70 mb-3">
              <Calendar className="w-3 h-3" />
              <span>{new Date(s.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between items-center border-t pt-3 mt-auto">
              <Badge variant="secondary" className="text-xs">
                <Code2 className="w-3 h-3 mr-1" />
                {s.language}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={() => setSelected(s)}
              >
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Snippet Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="text-sm opacity-70 mb-2">
                {selected.description}
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
