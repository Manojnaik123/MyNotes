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
import { Separator } from '@/components/ui/separator';

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
        enabled: !!numericFolderId,
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
        <>
            <div className="flex flex-col h-full">
                {/* input header */}
                <div className='flex flex-col justify-between md:flex-row gap-2 p-2 md:p-4'>
                    <div className='flex flex-1 gap-4'>
                        <div className="relative grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search notes..."
                                className="pl-9 "
                            />
                        </div>
                    </div>
                    <div className='flex justify-between items-end'>
                        <div className='flex gap-2 w-full md:w-auto'>
                            <Button variant='outline' className='grow'>
                                <ListFilter />
                                Filter
                            </Button>
                            <Button variant='outline' className='grow'>
                                <ArrowDownWideNarrow />
                                Sort
                            </Button>
                            <AddNotesDialog isEdit={false} />
                        </div>
                        {/* <span className='text-xs text-muted-foreground/50'>
                        x notes total
                    </span> */}
                    </div>
                </div>

                {/* THis is not growing  */}
                <div className='flex-1 overflow-auto'>
                    <div className='p-4 bg-sidebar-foreground/10 flex justify-between items-center'>
                        <span className='text-muted-foreground text-sm flex gap-2 items-center'>
                            <Pin className='h-5' />
                            Pinned Notes
                        </span>
                        <span className='text-muted-foreground text-xs flex gap-2 items-center'>
                            X pinned notes
                        </span>
                    </div>
                    {/* pinned notes list */}
                    <div className='flex flex-col divide-y divide-border md:p-4'>
                        {notes && notes.filter((note) => note.isPinned === true).map((note) => (
                            <NotesViewCard note={note} />
                        ))}
                        {(notes && notes.filter((note) => note.isPinned === true).length === 0) && (
                            <p className='text-xs text-foreground/50 pl-8 flex'> Click the <Pin className='h-4' /> icon on any note to pin it here. </p>
                        )}
                    </div>

                    <div className='p-4 bg-sidebar-foreground/10 flex justify-between items-center'>
                        <span className='text-muted-foreground text-sm flex gap-2 items-center'>
                            <Book className='h-5' />
                            All Notes
                        </span>
                        <span className='text-muted-foreground text-xs flex gap-2 items-center'>
                            X pinned notes
                        </span>
                    </div>
                    {/* other notes apart from pinned list */}
                    <div className='flex flex-col divide-y divide-border md:p-4'>
                        {notes && notes.filter((note) => note.isPinned !== true).map((note) => (
                            <NotesViewCard note={note} />
                        ))}
                        {(notes && notes.filter((note) => note.isPinned !== true).length === 0) && (
                            <p className='text-xs text-foreground/50 pl-8'> No notes found. Click '+ Add Notes' to create one. </p>
                        )}
                    </div>
                </div>




                {/* footer */}
                <div className='border-t p-2 flex justify-between text-[9px] md:text-xs text-foreground/30'>
                    <div className='flex gap-2'>
                        <span className='flex items-center gap-1'>
                            <button className='bg-green-500 p-1 mt-0.5 rounded-full'>

                            </button>
                            Last Synced: 2 min age</span>
                        <Separator orientation='vertical' />
                        <span>App version v 1.4.2</span>
                    </div>
                    <div className='flex gap-2'>
                        <span>Privacy Policy</span>
                        <Separator orientation='vertical' />
                        <span>Terms of Service</span>
                    </div>
                </div>
            </div>

        </>
    )
}

export default NoteViewPage;