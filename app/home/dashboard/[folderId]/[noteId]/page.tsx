"use client";

import { SpinnerCustom } from '@/components/custom-comp/spinner';
import { AddNotesDialog } from '@/components/notes/add-notes-dailog';
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { timeAgo } from '@/lib/time-functions';
import { Note } from '@/types/note';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock4, Delete, Edit, FolderDotIcon, LoaderIcon, Pen, Pin, Trash, Users } from 'lucide-react'
import { redirect, useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';

const NotesViewPage = () => {
  const { noteId, folderId } = useParams();
  const queryKey = ['notes', Number(noteId)];

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: noteData, isLoading } = useQuery<Note>({
    queryKey: ['note', Number(noteId)],
    queryFn: async () => {
      const res = await fetch(`/api/note?noteId=${noteId}`);
      if (!res.ok) throw new Error('Failed to fetch note');
      return res.json();
    },
  });

  const { mutate: deleteNote } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/note/${noteId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['note', Number(noteId)] });

      const previousNote = queryClient.getQueryData(['note', Number(noteId)]);

      queryClient.removeQueries({ queryKey: ['note', Number(noteId)] });

      router.push(`/dashboard/${folderId}`);

      return { previousNote };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousNote) {
        queryClient.setQueryData(
          ['note', Number(noteId)],
          context.previousNote
        );
      }
    },
  });

  const { mutate: togglePin } = useMutation({
    mutationFn: async (newPinnedState: boolean) => {
      const res = await fetch(`/api/note/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
            isPinned: newPinnedState,
            folderId: folderId,
          }
        ),
      });

      if (!res.ok) throw new Error('Failed to update pin');

      return res.json(); // must return updated note
    },

    onSuccess: (updatedNote) => {
      // 🔥 overwrite single note cache with server result
      queryClient.setQueryData(
        ['note', Number(noteId)],
        updatedNote
      );

      // 🔥 update list cache too
      queryClient.setQueryData<Note[]>(
        ['notes', Number(folderId)],
        (old) =>
          old?.map((note) =>
            note.id === updatedNote.id
              ? updatedNote
              : note
          )
      );
    },
  });

  if (!noteData) return (
    <div className='w-full h-full flex justify-center items-center'>
      <Button variant={'link'} disabled>
        <SpinnerCustom data-icon='inline-start' />
        Loading...
      </Button>
    </div>
  )

  return (
    <div className='flex flex-col gap-4 max-w-3xl mx-auto text-foreground/50'>
      <div className='flex justify-between'>
        <span className='text-foreground text-2xl'>{noteData?.title}</span>
        <div>
          <Button
            variant="link"
            className="hover:bg-muted/50"
            onClick={() => togglePin(!noteData.isPinned)}
          >
            <Pin className={noteData.isPinned ? "fill-current text-yellow-500" : ""} />
          </Button>
          <AddNotesDialog isEdit={true} />
          <Button variant={'link'} className='text-destructive hover:bg-destructive/10'
            onClick={() => deleteNote()}>
            <Trash />
          </Button>
        </div>
      </div>
      <div className='flex gap-4 text-[10px] md:text-sm'>
        <span className='flex gap-1 items-center'>
          <Clock4 className='h-4' />
          Last updated {noteData && timeAgo(noteData.createdAt)}
        </span>
        <span className='flex gap-1 items-center'>
          <Users className='h-4' />
          Shared with 4 people
        </span>
      </div>
      <div className='flex gap-2'>
        <Badge>Strategy</Badge>
        <Badge variant={'destructive'}>Coding</Badge>
        <Badge variant={'secondary'}>Front end</Badge>
      </div>
      <div className='text-foreground/70 text-1xl'>
        <pre> {noteData?.content}</pre>
      </div>
    </div>
  )
}

export default NotesViewPage