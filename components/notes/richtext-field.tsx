"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";

export default function RichTextEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
    ],
    content: "",
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border rounded-md bg-white p-4">

      {/* Toolbar */}
      <div className="flex gap-2 mb-4 border-b pb-3">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2 py-1 border rounded"
        >
          Bold
        </button>

        <button
          onClick={addImage}
          className="px-2 py-1 border rounded"
        >
          Add Image
        </button>
      </div>

      <EditorContent editor={editor} className="min-h-[150px]" />
    </div>
  );
}