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
              className="border rounded-lg p-4 hover:bg-muted transition cursor-pointer group"
              onClick={() => router.push(`/space/folders/${folder.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted">
                    <Folder className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{folder.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {folder.description}
                    </p>
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
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="w-3 h-3" />
                  <span>{folder.snippetCount ?? 0} snippets</span>
                </div>
                <Button size="sm" variant="ghost" className="text-xs px-2">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {visibleFolders.length === 0 && !loading && (
          <div className="text-center py-16">
            <Folder className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">No folders</h3>
            <p className="text-sm opacity-70 mb-4">
              Create your first folder to organize snippets
            </p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Folder
            </Button>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-2">Create Folder</h3>
        <p className="text-sm opacity-70 mb-4">Add a name and description.</p>
        <div className="grid gap-3">
          <Input
            placeholder="Folder name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
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
