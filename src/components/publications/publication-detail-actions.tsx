"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deletePublication } from "@/actions/publications";

export function PublicationDetailActions({
  publicationId,
  title,
}: {
  publicationId: number;
  title: string;
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteConfirm() {
    setIsDeleting(true);
    try {
      const result = await deletePublication(publicationId);
      if (result.success) {
        toast.success("Publication deleted successfully.");
        setIsDeleteDialogOpen(false);
        router.push("/publications");
      } else {
        toast.error(result.error || "Failed to delete publication.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred during deletion.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild className="gap-1.5">
          <Link href={`/publications/${publicationId}/edit`}>
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Publication?</DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete <strong className="text-foreground font-semibold">&ldquo;{title}&rdquo;</strong>?
              This action cannot be undone and will permanently remove the publication, along with all associated authors and evidence.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Publication"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
