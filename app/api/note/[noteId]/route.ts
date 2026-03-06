// app/api/note/[noteId]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"
import { Note } from "@/types/note";
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ noteId: string }> }
) {
  try {
    console.log("reached");

    const { noteId } = await context.params; // ✅ THIS IS THE FIX

    const id = Number(noteId);

    if (!id) {
      return NextResponse.json(
        { error: "Invalid note id" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}

export function mapNoteToDb(note: Partial<Note>) {
  const result: any = {};

  if (note.title !== undefined) {
    result.title = note.title;
  }

  if (note.content !== undefined) {
    result.content = note.content;
  }

  if (note.folderId !== undefined) {
    result.folder_id = note.folderId;
  }

  if (note.isPinned !== undefined) {
    result.is_pinned = note.isPinned;
  }

  result.updated_at = new Date().toISOString();

  return result;
}

export async function PUT(
  req: Request,
  context: { params: { noteId: string } }
) {
  try {
    const { noteId } = context.params;

    const body : Partial<Note> = await req.json();

    const { folderId } = body;

    console.log('here');
    console.log(folderId);

    const noteDb = mapNoteToDb(body);

    console.log(noteDb);

    if (noteDb.is_pinned === true) {
      // count already pinned notes in same folder
      const { count, error: countError } = await supabase
        .from("notes")
        .select("*", { count: "exact", head: true })
        .eq("folder_id", folderId)
        .eq("is_pinned", true);

      if (countError) throw countError;

      if ((count ?? 0) >= 5) {
        return NextResponse.json(
          { error: "Maximum 5 pinned notes allowed" },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from("notes")
      .update(noteDb)
      .eq("id", Number(noteId))
      .select()
      .maybeSingle();

    console.log(error?.message);

    if (error) throw error;

    return NextResponse.json(mapDbToNote(data));
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export function mapDbToNote(row: any): Note {
  return {
    id: row.id,
    userId: 0,
    title: row.title,
    content: row.content,
    folderId: row.folder_id,
    isPinned: row.is_pinned,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}