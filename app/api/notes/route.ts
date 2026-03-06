import type { Note, NoteDB } from "@/types/note";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const folderId = searchParams.get("folderId");

        const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("folder_id", folderId)
            .returns<NoteDB[]>()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const finalData: Note[] = (data ?? []).map((note) => ({
            id: note.id,
            folderId: note.folder_id,
            userId: note.user_id,
            title: note.title,
            content: note.content,
            isPinned: note.is_pinned,
            createdAt: note.created_at,
            updatedAt: note.updated_at,
        }));
        return NextResponse.json(finalData); 
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body: Note = await req.json();
        const { folderId, title, content } = body;
        
        if (!folderId || !title) {
            return NextResponse.json(
                { error: "Empty required field"},
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("notes")
            .insert([
                {
                    folder_id: folderId,
                    title,
                    content,
                },
            ])
            .select("*")
            .returns<NoteDB[]>();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const newNote = data![0];

        const finalNote: Note = {
            id: newNote.id,
            folderId: newNote.folder_id,
            userId: newNote.user_id,
            title: newNote.title,
            content: newNote.content,
            createdAt: newNote.created_at,
            updatedAt: newNote.updated_at,
        };

        return NextResponse.json(finalNote, { status: 201 });
    } catch (error) {
        console.error("Failed to create note:", error);
        return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }
}