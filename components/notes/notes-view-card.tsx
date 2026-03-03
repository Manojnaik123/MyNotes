import React from 'react'
import { Badge } from '../ui/badge'

const NotesViewCard = () => {
  return (
    <div className='p-4 border rounded-2xl flex flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col-reverse md:flex-row gap-2'>
          <h1 className='text-md md:text-1xl text-foreground'>Quaterly Meeting strategy</h1>
          <Badge variant='secondary'>Secondary</Badge>
        </div>
        <p className='text-sm text-foreground/50'>
          Lorem ipsum dolor sit ame impedit, dicta modi aperiam libero eos! Quam et sequi voluptate eveniet....</p>
      </div>
      <span className='text-xs text-foreground/30'>Oct 01, 2025</span>
    </div>
  )
}

export default NotesViewCard