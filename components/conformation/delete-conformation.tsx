"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Separator } from "../ui/separator"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FoldersQueryKey } from "@/lib/query-keys";
import { Folder } from "@/types/folder";

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  folderId?: number
}

const deleteFolder = async (folderId: number) => {
  const response = await fetch("/api/folders", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: folderId }),
  });
  return response.json();
}

export function DeleteConformationDialog({ open, setOpen, folderId }: Props) {

  const queryClient = useQueryClient();

  const folder = queryClient.getQueryData<Folder[]>([FoldersQueryKey])
    ?.find((folder) => folder.id === folderId);

  const { mutate: removeFolder } = useMutation({
    mutationFn: deleteFolder,
    onMutate: async (folderId: number) => {
      await queryClient.cancelQueries({ queryKey: [FoldersQueryKey] });

      const previousFolders = queryClient.getQueryData<Folder[]>([FoldersQueryKey]);

      queryClient.setQueryData<Folder[]>([FoldersQueryKey], old =>
        old?.filter(folder => folder.id !== folderId) ?? []
      );

      return { previousFolders };
    },
    onError: (err, folderId, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData([FoldersQueryKey], context.previousFolders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [FoldersQueryKey] });
    },
  });

  const handleDelete = (folderId: number) => {
    removeFolder(folderId);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-md p-0">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>Delete folder <b>"{" " + folder?.folderName + " "}"</b> ?</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="p-4">
            <p>
              This action cannot be undone. All notes inside this folder will be permanently deleted.
            </p>
          </div>
          <Separator />
          <DialogFooter className="px-4 pb-4 flex">
            <DialogClose asChild className="grow">
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant={'destructive'} className="grow"
              onClick={() => handleDelete(folderId!)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
