export type Folder = {
  id: number;
  folderName: string;
  userId: number;
  createdAt: string;
  updatedAt: string;

};

// types/folder.ts

export type FolderDB = {
  id: number;
  folder_name: string;
  user_id: number;
  created_at: string;
  updated_at: string;

};

export type FolderSideBar = {
  id: number,
  name: string,
  url: string,
}