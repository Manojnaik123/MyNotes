import type { Folder, FolderDB } from "@/types/folder";
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .returns<FolderDB[]>();

    const finalData: Folder[] = (data ?? []).map(folder => ({
      id: folder.id,
      folderName: folder.folder_name,
      userId: folder.user_id,
      createdAt: folder.created_at,
    }))

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(finalData);
  } catch (error) {
    console.error("Failed to fetch folders:", error);

    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body : Folder = await req.json();

    const { folderName, userId } = body;

    if (!folderName) {
      return NextResponse.json(
        { error: "folderName is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("folders")
      .insert([
        {
          folder_name: folderName,
        },
      ])
      .select()
      .single<FolderDB>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const finalData: Folder = {
      id: data.id,
      folderName: data.folder_name,
      userId: data.user_id,
      createdAt: data.created_at,
    };

    return NextResponse.json(finalData, { status: 201 });

  } catch (error) {
    console.error("Failed to create folder:", error);

    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
