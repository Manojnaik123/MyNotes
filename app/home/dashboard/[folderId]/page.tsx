"use client";

import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input"
import { ArrowDownWideNarrow, Book, ListFilter, Pin, Plus, Search } from "lucide-react"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotesViewCard from '@/components/notes/notes-view-card';
import { AddNotesDialog } from '@/components/notes/add-notes-dailog';
import { Note } from '@/types/note';
import { useParams } from 'next/navigation';
import { useQuery, QueryFunctionContext } from '@tanstack/react-query';
import { SpinnerCustom } from '@/components/custom-comp/spinner';

async function fetchNotes(
    context: QueryFunctionContext<[string, number]>
): Promise<Note[]> {
    const [, folderId] = context.queryKey

    const res = await fetch(`/api/notes?folderId=${folderId}`)
    if (!res.ok) throw new Error("Failed to fetch")

    return res.json()
}

const NoteViewPage = () => {
    const { folderId } = useParams()
    const numericFolderId = Number(folderId)

    const { data: notes, isLoading, error } = useQuery({
        queryKey: ['notes', numericFolderId],
        queryFn: fetchNotes,
        enabled: !!numericFolderId, // prevents run before param exists
    })

    if (!notes) return (
        <div className='w-full h-full flex justify-center items-center'>
            <Button variant={'link'} disabled>
                <SpinnerCustom data-icon='inline-start' />
                Loading...
            </Button>
        </div>
    )

    return (
        <div className='h-full w-full'>
            {/* input header */}
            <div className='flex flex-col  gap-4'>
                <div className='flex flex-1 gap-4'>
                    <div className="relative grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search notes..."
                            className="pl-9 "
                        />
                    </div>
                    <AddNotesDialog isEdit={false} />
                </div>
                <div className='flex justify-between items-end'>
                    <div className='flex gap-4'>
                        <Button variant='outline'>
                            <ListFilter />
                            Filter
                        </Button>
                        <Button variant='outline'>
                            <ArrowDownWideNarrow />
                            Sort
                        </Button>
                    </div>
                    <span className='text-xs text-muted-foreground/50'>
                        x notes total
                    </span>
                </div>
            </div>
            {/* pinned notes list */}
            <div className='pt-8 flex flex-col gap-4'>
                <span className='text-muted-foreground text-sm flex gap-2 items-center'>
                    <Pin className='h-5' />
                    Pinned Notes
                </span>
                {notes && notes.filter((note) => note.isPinned === true).map((note) => (
                    <NotesViewCard note={note} />
                ))}
                {(notes && notes.filter((note) => note.isPinned === true).length === 0) && (
                    <p className='text-xs text-foreground/50 pl-8 flex'> Click the <Pin className='h-4'/> icon on any note to pin it here. </p>
                )}
            </div>

            {/* other notes apart from pinned list */}
            <div className='pt-8 flex flex-col gap-4'>
                <span className='text-muted-foreground text-sm flex gap-2 items-center'>
                    <Book className='h-5' />
                    All Notes
                </span>
                {notes && notes.filter((note) => note.isPinned !== true).map((note) => (
                    <NotesViewCard note={note} />
                ))}
                {(notes && notes.filter((note) => note.isPinned !== true).length === 0 )&& (
                    <p className='text-xs text-foreground/50 pl-8'> No notes found. Click '+ Add Notes' to create one. </p>
                )}
            </div>
        </div>
    )
}

export default NoteViewPage;