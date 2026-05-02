"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Link as LinkIcon, Image as ImageIcon,
  Minus, Undo, Redo,
} from "lucide-react"
import { useCallback, useState } from "react"
import { MediaPickerModal } from "@/components/admin/media-picker-modal"

const lowlight = createLowlight(common)

interface EditorProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
}

export function Editor({ content = "", onChange, placeholder = "Start writing..." }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full" } }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none min-h-[400px] px-6 py-4 focus:outline-none text-[#141413]",
        style: "font-family: var(--font-body); color: #141413;",
      },
    },
  })

  const setLink = useCallback(() => {
    const url = window.prompt("URL")
    if (url) editor?.chain().focus().setLink({ href: url }).run()
  }, [editor])

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  const addImage = useCallback(() => {
    setMediaPickerOpen(true)
  }, [])

  function handleMediaSelect(url: string) {
    editor?.chain().focus().setImage({ src: url }).run()
    setMediaPickerOpen(false)
  }

  if (!editor) return (
    <div className="border border-[#e8e6dc] rounded-xl bg-white overflow-hidden min-h-[480px] flex items-center justify-center">
      <span className="text-sm text-[#b0aea5]">Loading editor...</span>
    </div>
  )

  const toolbarBtn = (active: boolean) =>
    `p-1.5 rounded transition-colors cursor-pointer ${
      active
        ? "bg-[#141413] text-white"
        : "text-[#b0aea5] hover:text-[#141413] hover:bg-[#e8e6dc]"
    }`

  // onMouseDown + preventDefault keeps editor focus and selection intact.
  // onClick loses the selection before the command runs (editor blur fires first).
  function tb(cmd: () => void) {
    return (e: React.MouseEvent) => { e.preventDefault(); cmd() }
  }

  return (
    <div className="border border-[#e8e6dc] rounded-xl bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-[#e8e6dc] bg-[#faf9f5]">
        <button type="button" onMouseDown={tb(() => editor.chain().focus().toggleBold().run())}
          className={toolbarBtn(editor.isActive("bold"))} title="Bold">
          <Bold size={15} />
        </button>
        <button type="button" onMouseDown={tb(() => editor.chain().focus().toggleItalic().run())}
          className={toolbarBtn(editor.isActive("italic"))} title="Italic">
          <Italic size={15} />
        </button>
        <div className="w-px h-5 bg-[#e8e6dc] mx-1" />
        <button type="button" onMouseDown={tb(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          className={toolbarBtn(editor.isActive("heading", { level: 2 }))} title="Heading 2">
          <Heading2 size={15} />
        </button>
        <button type="button" onMouseDown={tb(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
          className={toolbarBtn(editor.isActive("heading", { level: 3 }))} title="Heading 3">
          <Heading3 size={15} />
        </button>
        <div className="w-px h-5 bg-[#e8e6dc] mx-1" />
        <button type="button" onMouseDown={tb(() => editor.chain().focus().toggleBulletList().run())}
          className={toolbarBtn(editor.isActive("bulletList"))} title="Bullet list">
          <List size={15} />
        </button>
        <button type="button" onMouseDown={tb(() => editor.chain().focus().toggleOrderedList().run())}
          className={toolbarBtn(editor.isActive("orderedList"))} title="Ordered list">
          <ListOrdered size={15} />
        </button>
        <div className="w-px h-5 bg-[#e8e6dc] mx-1" />
        <button type="button" onMouseDown={tb(() => editor.chain().focus().toggleBlockquote().run())}
          className={toolbarBtn(editor.isActive("blockquote"))} title="Blockquote">
          <Quote size={15} />
        </button>
        <button type="button" onMouseDown={tb(() => editor.chain().focus().toggleCodeBlock().run())}
          className={toolbarBtn(editor.isActive("codeBlock"))} title="Code block">
          <Code size={15} />
        </button>
        <button type="button" onMouseDown={tb(() => editor.chain().focus().setHorizontalRule().run())}
          className={toolbarBtn(false)} title="Divider">
          <Minus size={15} />
        </button>
        <div className="w-px h-5 bg-[#e8e6dc] mx-1" />
        <button type="button" onMouseDown={tb(setLink)}
          className={toolbarBtn(editor.isActive("link"))} title="Add link">
          <LinkIcon size={15} />
        </button>
        <button type="button" onMouseDown={tb(addImage)}
          className={toolbarBtn(false)} title="Add image">
          <ImageIcon size={15} />
        </button>
        <div className="w-px h-5 bg-[#e8e6dc] mx-1 ml-auto" />
        <button type="button" onMouseDown={tb(() => editor.chain().focus().undo().run())}
          className={toolbarBtn(false)} title="Undo">
          <Undo size={15} />
        </button>
        <button type="button" onMouseDown={tb(() => editor.chain().focus().redo().run())}
          className={toolbarBtn(false)} title="Redo">
          <Redo size={15} />
        </button>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Word / char count */}
      <div className="px-6 py-2 border-t border-[#e8e6dc] bg-[#faf9f5] flex gap-4 text-xs text-[#b0aea5]">
        <span>{editor.storage.characterCount.words()} words</span>
        <span>{editor.storage.characterCount.characters()} characters</span>
      </div>

      {/* Media picker modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          onSelect={handleMediaSelect}
          onClose={() => setMediaPickerOpen(false)}
        />
      )}
    </div>
  )
}
