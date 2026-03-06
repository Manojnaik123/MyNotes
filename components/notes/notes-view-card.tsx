import React from 'react'
import { Badge } from '../ui/badge'
import { Note } from '@/types/note'
import Link from 'next/link'

const NotesViewCard = ({ note }: { note: Note }) => {
  return (
    <Link href={`/home/dashboard/${note.folderId}/${note.id}`} className='ml-0 md:ml-4 p-4 border rounded-2xl flex flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col md:flex-row gap-2'>
          <h1 className='text-md md:text-1xl text-foreground'>{note.title}</h1>
          <div className='flex gap-2'>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='destructive'>Coding</Badge>
            <Badge variant='outline'>Blue print</Badge>
          </div>
        </div>
        <p className='text-sm text-foreground/50'>
          {note.content}
        </p>
      </div>
      <span className='text-xs text-foreground/30'>{new Date(note.createdAt).toLocaleDateString("en-GB")}</span>
    </Link>
  )
}

export default NotesViewCard