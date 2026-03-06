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

const createFolder = async (folder: Folder) => {
    const response = await fetch("/api/folders",
        {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(folder),
        }
    );
    return response.json();
}

const AddFolderDialog = () => {

    const [folderName, setFolderName] = useState('');
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const { mutate: addFolder } = useMutation({
        mutationFn: createFolder,
        onMutate: async (newFolder) => {
            await queryClient.cancelQueries({
                queryKey: [FoldersQueryKey]
            });

            const previousFolders = queryClient.getQueryData<Folder[]>([FoldersQueryKey]);

            const optimisticFolder = {
                id: Date.now(),
                folderName: newFolder.folderName,
            }

            queryClient.setQueryData<Folder[]>(
                [FoldersQueryKey],
                (old = []) => [...old, optimisticFolder]
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
        addFolder({ folderName: folderName });
        setFolderName('');
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form id="notes-form" onSubmit={handleSubmit}>
                <DialogTrigger asChild>
                    <Button variant={'link'} className="text-sidebar-foreground/70 no-underline hover:no-underline">
                        <Plus />
                        <span className='hidden md:flex text-xs'>Add Folder</span>
                    </Button>
                </DialogTrigger>
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
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
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