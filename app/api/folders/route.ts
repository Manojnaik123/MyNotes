import type { Folder, FolderDB } from "@/types/folder";
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('updated_at', { ascending: false })
      .returns<FolderDB[]>();

    const finalData: Folder[] = (data ?? []).map(folder => ({
      id: folder.id,
      folderName: folder.folder_name,
      userId: folder.user_id,
      createdAt: folder.created_at,
      updatedAt: folder.updated_at,
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

export async function PUT(req: Request) {
  try {
    const body: Folder = await req.json();
    // const { id, folderName, updatedAt } = body;

    if (!body.id) {
      return NextResponse.json(
        { error: "Folder ID is required" },
        { status: 400 }
      );
    }

    if (!body.folderName) {
      return NextResponse.json(
        { error: "folderName is required" },
        { status: 400 }
      );
    }

    // Update the folder in Supabase
    const folderForUpdate : Partial<FolderDB> = {
      folder_name: body.folderName,
      updated_at:  new Date().toISOString(),
    }

    console.log(body);

    const { data, error } = await supabase
      .from("folders")
      .update(folderForUpdate)
      .eq("id", body.id)
      .select()
      .single<FolderDB>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map Supabase response to your Folder type
    const finalData: Folder = {
      id: data.id,
      folderName: data.folder_name,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(finalData, { status: 200 });
  } catch (error) {
    console.error("Failed to update folder:", error);
    return NextResponse.json(
      { error: "Failed to update folder" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body: Partial<Folder> = await req.json(); 
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from<Folder>("folders") 
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 }); 
  } catch (error) {
    console.error("Failed to delete folder:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}