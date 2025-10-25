import React, { useState } from "react";
import { Snippet } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, Check, X, Edit2, Plus, Trash2, Pin, PinOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useAuth } from "@clerk/nextjs";

interface SnippetBoxProps {
  snippet: Snippet;
  onUpdate?: (id: string | number, updates: Partial<Snippet>) => Promise<void>;
  onDelete?: (id: string | number) => void;
  refreshSnippets?: () => void;
}

function SnippetBox({ snippet, onUpdate, onDelete, refreshSnippets }: SnippetBoxProps) {
  const { getToken } = useAuth();
  
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [editData, setEditData] = useState({
    title: snippet.title,
    content: snippet.content,
    language: snippet.language,
    description: snippet.description || "",
    tags: snippet.tags || [],
  });

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(snippet.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditData({
      title: snippet.title,
      content: snippet.content,
      language: snippet.language,
      description: snippet.description || "",
      tags: snippet.tags || [],
    });
    setTagInput("");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editData.tags.includes(tagInput.trim())) {
      setEditData({
        ...editData,
        tags: [...editData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditData({
      ...editData,
      tags: editData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSave = async () => {
    if (!onUpdate) return;

    try {
      setIsSaving(true);
      await onUpdate(snippet.id, editData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save snippet");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("Not authenticated");

      const supabase = createSupabaseClient(token);

      const { error } = await supabase
        .from("snippets")
        .delete()
        .eq("id", snippet.id);

      if (error) throw error;

      // Close modal and dialog
      setShowDeleteDialog(false);
      setIsModalOpen(false);

      // Notify parent component
      if (onDelete) {
        onDelete(snippet.id);
      }
      
      // Refresh snippets list
      if (refreshSnippets) {
        refreshSnippets();
      }
    } catch (err) {
      console.error("Failed to delete:", err);
      alert(err instanceof Error ? err.message : "Failed to delete snippet");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setIsPinning(true);
      
      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("Not authenticated");

      const supabase = createSupabaseClient(token);

      const { error } = await supabase
        .from("snippets")
        .update({ is_pinned: !snippet.is_pinned })
        .eq("id", snippet.id);

      if (error) throw error;

      // Update via parent callback if available
      if (onUpdate) {
        await onUpdate(snippet.id, { is_pinned: !snippet.is_pinned });
      }
      
      // Refresh snippets list
      if (refreshSnippets) {
        refreshSnippets();
      }
    } catch (err) {
      console.error("Failed to toggle pin:", err);
      alert("Failed to update pin status");
    } finally {
      setIsPinning(false);
    }
  };

  return (
    <>
      {/* Snippet Card */}
      <div
        onClick={handleOpenModal}
        className={`bg-white rounded-md shadow-md border transition-all overflow-hidden cursor-pointer ${
          snippet.is_pinned 
            ? 'border-blue-400 ring-2 ring-blue-100 hover:shadow-xl' 
            : 'border-gray-200 hover:shadow-lg'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {snippet.is_pinned && (
              <Pin className="h-3.5 w-3.5 text-blue-600 fill-blue-600 flex-shrink-0" />
            )}
            <h3 className="font-semibold text-base text-gray-800 truncate">
              {snippet.title}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={handleTogglePin}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              disabled={isPinning}
              title={snippet.is_pinned ? "Unpin snippet" : "Pin snippet"}
            >
              {snippet.is_pinned ? (
                <PinOff className="h-3 w-3" />
              ) : (
                <Pin className="h-3 w-3" />
              )}
            </Button>
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Code Content with Fade Effect */}
        <div className="relative">
          <pre className="bg-gray-50 p-4 text-sm overflow-hidden max-h-60">
            <code className="text-gray-800 font-mono whitespace-pre-wrap break-words leading-relaxed">
              {snippet.content}
            </code>
          </pre>
          {/* Fade Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {new Date(snippet.created_at).toLocaleDateString()}
            </span>
            {snippet.tags && snippet.tags.length > 0 && (
              <div className="flex gap-1">
                {snippet.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0 h-5">
                    {tag}
                  </Badge>
                ))}
                {snippet.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                    +{snippet.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
            {snippet.language}
          </span>
        </div>
      </div>

      {/* Full Snippet Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start p-4 border-b border-gray-200 gap-4">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                      placeholder="Snippet title"
                      className="text-xl font-bold"
                    />
                    <Textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                      placeholder="Add a description (optional)"
                      className="text-sm resize-none"
                      rows={2}
                    />
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>
                        {new Date(snippet.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <Select
                        value={editData.language}
                        onValueChange={(value) =>
                          setEditData({ ...editData, language: value })
                        }
                      >
                        <SelectTrigger className="w-32 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JavaScript">JavaScript</SelectItem>
                          <SelectItem value="TypeScript">TypeScript</SelectItem>
                          <SelectItem value="Python">Python</SelectItem>
                          <SelectItem value="Java">Java</SelectItem>
                          <SelectItem value="C++">C++</SelectItem>
                          <SelectItem value="C#">C#</SelectItem>
                          <SelectItem value="Go">Go</SelectItem>
                          <SelectItem value="Rust">Rust</SelectItem>
                          <SelectItem value="Ruby">Ruby</SelectItem>
                          <SelectItem value="PHP">PHP</SelectItem>
                          <SelectItem value="SQL">SQL</SelectItem>
                          <SelectItem value="HTML">HTML</SelectItem>
                          <SelectItem value="CSS">CSS</SelectItem>
                          <SelectItem value="Bash">Bash</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder="Add tag..."
                          className="h-7 text-xs"
                        />
                        <Button
                          onClick={handleAddTag}
                          variant="outline"
                          size="sm"
                          className="h-7 px-2"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {editData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {editData.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs px-2 py-0.5 h-6"
                            >
                              {tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      {snippet.is_pinned && (
                        <Pin className="h-4 w-4 text-blue-600 fill-blue-600 mt-1 flex-shrink-0" />
                      )}
                      <h2 className="text-xl font-bold text-gray-800 break-words">
                        {snippet.title}
                      </h2>
                    </div>
                    {snippet.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {snippet.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-gray-500">
                        {new Date(snippet.created_at).toLocaleDateString()} •{" "}
                        {snippet.language}
                      </p>
                      {snippet.tags && snippet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {snippet.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs px-2 py-0 h-5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      disabled={isSaving}
                      className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleTogglePin}
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      disabled={isPinning}
                      title={snippet.is_pinned ? "Unpin snippet" : "Pin snippet"}
                    >
                      {snippet.is_pinned ? (
                        <PinOff className="h-3 w-3" />
                      ) : (
                        <Pin className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      onClick={handleCopy}
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    {onUpdate && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
                <Button
                  onClick={handleCloseModal}
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isEditing ? (
                <Textarea
                  value={editData.content}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                  className="w-full min-h-[400px] font-mono text-sm resize-none"
                  placeholder="Enter your code here..."
                />
              ) : (
                <pre className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-gray-800 font-mono text-sm whitespace-pre-wrap wrap-break-word leading-relaxed">
                    {snippet.content}
                  </code>
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Snippet?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{snippet.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default SnippetBox;