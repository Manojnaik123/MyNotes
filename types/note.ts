export type NoteDB = {
    id: number;
    folder_id: number;
    user_id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    is_pinned: boolean;
};

// types/folder.ts

export type Note = {
    id: number;
    folderId: number;
    userId: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    isPinned: boolean;
};

