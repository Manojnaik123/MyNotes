import { Folder } from "@/types/folder";

export async function fetchFolders(): Promise<Folder[]> {
  const res = await fetch("/api/folders");
  if (!res.ok) throw new Error('Failed to fetch folders');
  return res.json();
}