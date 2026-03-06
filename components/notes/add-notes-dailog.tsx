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
import { Pen, Plus } from "lucide-react"
import RichTextEditor from "./richtext-field"
import { Textarea } from "../ui/textarea"
import { useEffect, useState } from "react"
import { Note } from "@/types/note"
import { useParams } from "next/navigation";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function AddNotesDialog({ isEdit = false }: { isEdit: boolean }) {
    const { folderId } = useParams();
    const queryClient = useQueryClient();
    const queryKey = ['notes', Number(folderId)]

    const { noteId } = useParams();

    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState<Partial<Note>>({
        title: '',
        content: '',
        folderId: Number(folderId),
    });

    // useEffect(() => {
    //     setUserData({
    //         title: '',
    //         content: '',
    //         folderId: Number(folderId),
    //     })
    // }, [open])



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    // const { mutate: onAddNote } = useMutation({
    //     mutationFn: async (userData: Partial<Note>) => {
    //         const res = await fetch(`/api/note`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(userData),
    //         });
    //         return res.json();
    //     },

    //     onMutate: async (userData: Partial<Note>) => {
    //         await queryClient.cancelQueries({ queryKey: queryKey })

    //         const previousNotes = queryClient.getQueryData(queryKey);

    //         queryClient.setQueryData(queryKey, (old: Note[]  = []) => [
    //             ...old,
    //             userData,
    //         ])

    //         return { previousNotes }
    //     },

    //     onError: (err, userData, context) => {
    //         queryClient.setQueryData(queryKey, context?.previousNotes)
    //     },

    //     onSettled: () => {
    //         queryClient.invalidateQueries({ queryKey })
    //     }
    // })

    const mutation = useMutation({
        mutationFn: async (userData: Partial<Note>) => {
            const isEditing = isEdit && noteId;

            const res = await fetch(
                isEditing
                    ? `/api/note/${noteId}`
                    : `/api/note`,
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                }
            );

            if (!res.ok) throw new Error("Something went wrong");

            return res.json();
        },

        // 🔥 THIS MAKES IT OPTIMISTIC
        onMutate: async (newData) => {
            await queryClient.cancelQueries({
                queryKey: ['notes', Number(folderId)],
            });

            const previousNotes = queryClient.getQueryData<Note[]>([
                'notes',
                Number(folderId),
            ]);

            queryClient.setQueryData<Note[]>(
                ['notes', Number(folderId)],
                (old = []) => {
                    if (isEdit && noteId) {
                        // ✏️ Optimistic Edit
                        return old.map(note =>
                            note.id === Number(noteId)
                                ? { ...note, ...newData }
                                : note
                        );
                    }

                    // ➕ Optimistic Add
                    return [
                        ...old,
                        {
                            ...newData,
                            id: Date.now(), // temporary id
                        } as Note,
                    ];
                }
            );

            return { previousNotes };
        },

        onSuccess: (updatedNote) => {
            // 🔥 update single note page cache
            if (isEdit && noteId) {
                queryClient.setQueryData(
                    ['note', Number(noteId)],
                    updatedNote
                );
            }

            // 🔥 refresh list page
            queryClient.invalidateQueries({
                queryKey: ['notes', Number(folderId)],
            });

            setOpen(false);
        },

        // rollback if fails
        // onError: (_err, _vars, context) => {
        //     if (context?.previousNotes) {
        //         queryClient.setQueryData(
        //             ['notes', Number(folderId)],
        //             context.previousNotes
        //         );
        //     }
        // },

        // // refetch to sync with real DB
        // onSettled: () => {
        //     queryClient.invalidateQueries({
        //         queryKey: ['notes', Number(folderId)],
        //     });
        //     queryClient.invalidateQueries({
        //         queryKey: ['notes', Number(noteId)],
        //     });
        // },
    });

    // get the note data if the page is isedit 
    const { data: noteData } = useQuery<Partial<Note>>({
        queryKey: ['note', Number(noteId)],
        queryFn: async () => {
            const res = await fetch(`/api/note?noteId=${noteId}`);
            if (!res.ok) throw new Error('Failed to fetch note');
            return res.json();
        },
        enabled: isEdit && !!noteId, // only runs in edit mode
    });

    useEffect(() => {
        if (isEdit && noteData) {
            setUserData(noteData);
        }
    }, [isEdit, noteData]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isEdit ? 'link' : 'default'} className={`${isEdit? 'hover:bg-foreground/5': ''}`} >
                    {isEdit ? (
                        <Pen />
                    ) : (
                        <>
                            <Plus />
                            <span className="hidden md:flex">Add Notes</span>
                        </>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <form onSubmit={e => {
                    e.preventDefault();
                    mutation.mutate(userData);
                    setOpen(false);
                }}>
                    <DialogHeader>
                        <DialogTitle>Add notes</DialogTitle>
                        <DialogDescription>
                            Lorem ipsum ipsum kunjalkunjalkunjalkunjalkunjalkunjalkunjalkunjalkunjalkunjalkunjal
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="pt-4">
                        <Field>
                            <Label htmlFor="name-1">Notes title</Label>
                            <Input
                                id="name-1"
                                name="title"
                                value={userData.title || ""}
                                onChange={handleChange}
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="username-1">Notes</Label>
                            <Textarea
                                id="username-1"
                                name="content"
                                value={userData.content || ""}
                                onChange={handleChange}
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit">
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
