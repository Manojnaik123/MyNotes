import React from 'react';
import { Input } from "@/components/ui/input"
import { ArrowDownWideNarrow, ListFilter, Pin, Plus, Search } from "lucide-react"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotesViewCard from '@/components/notes/notes-view-card';

const NoteViewPage = () => {
    return (
        <div className='h-full w-full'>
            {/* input header */}
            <div className='flex flex-col  gap-4'>
                <div className='flex flex-1 gap-4'>
                    <div className="relative grow">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                        />
                        <Input
                            placeholder="Search notes..."
                            className="pl-9 "
                        />
                    </div>
                    <Button className=''>
                        <Plus />
                        Add Notes
                    </Button>
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
                <span className='text-muted-foreground text-sm flex gap-2'>
                    <Pin className='h-auto' />
                    Pinned Notes
                </span>

                <NotesViewCard/>
            </div>

            {/* other notes apart from pinned list */}
            <div className='pt-8 flex flex-col gap-4'>
                <span className='text-muted-foreground text-sm flex gap-2'>
                    <Pin className='h-auto' />
                    All Notes
                </span>

                <NotesViewCard/>
                <NotesViewCard/>
                <NotesViewCard/>

            </div>
        </div>
    )
}

export default NoteViewPage