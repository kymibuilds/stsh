"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Folder,
  Plus,
  MoreVertical,
  FileText,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
        className="bg-background rounded-xl shadow-lg w-[90vw] max-w-[500px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

type FolderItem = {
  id: string | number;
  name: string;
  description?: string;
  snippetCount?: number;
};

const folderColors = [
  "text-blue-500 bg-blue-500/10",
  "text-green-500 bg-green-500/10",
  "text-purple-500 bg-purple-500/10",
  "text-orange-500 bg-orange-500/10",
  "text-pink-500 bg-pink-500/10",
  "text-cyan-500 bg-cyan-500/10",
  "text-yellow-500 bg-yellow-500/10",
  "text-red-500 bg-red-500/10",
];

const getColorForFolder = (id: string | number) => {
  const index = typeof id === 'string' 
    ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) 
    : id;
  return folderColors[Number(index) % folderColors.length];
};

export default function FolderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const supabase = useSupabase();
  const { user } = useUser();
  const router = useRouter();

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setFolders(data || []);
    } catch (err) {
      toast.error("Failed to load folders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchFolders();
  }, [user]);

  const handleCreateFolder = async () => {
    if (!name.trim()) {
      toast.error("Folder name required");
      return;
    }
    if (!user?.id) {
      toast.error("You must be signed in");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("folders")
        .insert([{ user_id: user.id, name, description }])
        .select()
        .single();
      if (error) throw error;

      setFolders((prev) => [data, ...prev]);
      toast.success("Folder created");
      setModalOpen(false);
      setName("");
      setDescription("");
    } catch (err) {
      toast.error("Failed to create folder");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFolder = async (folderId: string | number) => {
    try {
      const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", folderId);
      
      if (error) throw error;

      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      toast.success("Folder deleted");
    } catch (err) {
      toast.error("Failed to delete folder");
      console.error(err);
    }
  };

  const visibleFolders = folders.filter((f) =>
    `${f.name} ${f.description || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">My Folders</h1>
            <p className="text-sm opacity-70">
              Organize your snippets efficiently
            </p>
          </div>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <Input
            placeholder="Search folders..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Folder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleFolders.map((folder) => (
            <div
              key={folder.id}
              className="border rounded-lg p-4 transition-all group bg-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${getColorForFolder(folder.id)}`}>
                    <Folder className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base">{folder.name}</h3>
                    {folder.description && (
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {folder.description}
                      </p>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{folder.snippetCount ?? 0} snippets</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-sm h-8 px-3"
                  onClick={() => router.push(`/space/folders/${folder.id}`)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {visibleFolders.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Folder className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No folders yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Create your first folder to organize your snippets and keep everything tidy
            </p>
            <Button onClick={() => setModalOpen(true)} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Folder
            </Button>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-1">Create New Folder</h3>
        <p className="text-sm text-muted-foreground mb-6">Add a name and optional description.</p>
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Folder Name</label>
            <Input
              placeholder="e.g., React Components"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Description (optional)</label>
            <Input
              placeholder="Brief description of folder contents"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setModalOpen(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateFolder} disabled={saving}>
            {saving ? "Creating..." : "Create Folder"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}