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
import { Plus } from "lucide-react"
import RichTextEditor from "./richtext-field"
import { Textarea } from "../ui/textarea"
import { SubmitEventHandler, useEffect, useState } from "react"
import { Note } from "@/types/note"
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { Folder } from "@/types/folder";
import { FoldersQueryKey } from "@/lib/query-keys";

const saveFolder = async (folder: Partial<Folder>) => {
    if (folder.id) {
        // Update existing folder
        const response = await fetch("/api/folders", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(folder),
        });
        return response.json();
    } else {
        // Create new folder
        const response = await fetch("/api/folders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(folder),
        });
        return response.json();
    }
};

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    folderId?: number
}


const AddFolderDialog = ({ open, setOpen, folderId }: Props) => {

    const [folderData, setFolderData] = useState<Partial<Folder>>(
        {
            id: folderId,
            folderName: '',
            updatedAt: '',
        }
    );

    const queryClient = useQueryClient();

    const { mutate: addFolder } = useMutation({
        mutationFn: saveFolder,
        onMutate: async (folder) => {
            await queryClient.cancelQueries({
                queryKey: [FoldersQueryKey]
            });

            const previousFolders = queryClient.getQueryData<Folder[]>([FoldersQueryKey]);

            const optimisticFolder: Folder = {
                id: folder.id ?? Date.now(),
                folderName: folder.folderName ?? '',
                userId: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            queryClient.setQueryData<Folder[]>(
                [FoldersQueryKey],
                (old = []) => {
                    if (folder.id) {
                        return old.map(f => f.id === folder.id ? optimisticFolder : f);
                    }
                    return [optimisticFolder, ...old]
                }
            )

            return { previousFolders }
        },
        onError: (err, newFolder, context) => {
            queryClient.setQueryData(
                [FoldersQueryKey],
                context?.previousFolders,
            )
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [FoldersQueryKey]
            })
        },
    })

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        addFolder(folderData);
        setFolderData({});
        setOpen(false);
    }

    useEffect(() => {
        if (folderId) {
            const folder = queryClient.getQueryData<Folder[]>([FoldersQueryKey])
                ?.find((folder) => folder.id === folderId);

            if (folder) {
                setFolderData(folder);
            }
        } else {
            setFolderData({ folderName: '' })
        }

    }, [folderId, queryClient])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form id="notes-form" onSubmit={handleSubmit}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Folder</DialogTitle>
                        <DialogDescription>
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio cum quasi ipsam.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="folderName">Folder Name</Label>
                            <Input
                                id="folderName"
                                name="folderName"
                                placeholder="Folder name"
                                value={folderData.folderName}
                                onChange={(e) => setFolderData((prev) => ({
                                    ...prev,
                                    folderName: e.target.value,
                                }))}
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="notes-form">Add Folder</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default AddFolderDialog