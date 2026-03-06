export type NoteDB = {
    id: number;
    folder_id: number;
    user_id: number;
    title: string;
    content: string;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
    
};

// types/folder.ts

export type Note = {
    id: number;
    folderId: number;
    userId: number;
    title: string;
    content: string;
    isPinned: boolean;
    createdAt: string;
    updatedAt: string;
};

