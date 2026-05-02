"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { X, Upload, Loader2, Search, ImageIcon } from "lucide-react"
import Image from "next/image"
import type { Media } from "@/types"

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

interface MediaPickerModalProps {
  onSelect: (url: string) => void
  onClose:  () => void
}

export function MediaPickerModal({ onSelect, onClose }: MediaPickerModalProps) {
  const [media,       setMedia]       = useState<Media[]>([])
  const [loading,     setLoading]     = useState(true)
  const [uploading,   setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [query,       setQuery]       = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMedia((data as Media[]) ?? [])
        setLoading(false)
      })
  }, [])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  async function handleUpload(files: FileList) {
    setUploading(true)
    setUploadError(null)
    const supabase = createClient()
    const uploaded: Media[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue

      const ext = file.name.split(".").pop()
      const storageName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from("media")
        .upload(storageName, file, { cacheControl: "3600", upsert: false })

      if (uploadErr) { setUploadError(uploadErr.message); continue }

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(storageName)

      const { data: row } = await supabase
        .from("media")
        .insert({ filename: storageName, url: urlData.publicUrl, size: file.size, mime_type: file.type })
        .select()
        .single()

      if (row) uploaded.push(row as Media)
    }

    setMedia((prev) => [...uploaded, ...prev])
    setUploading(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files)
  }

  const filtered = query.trim()
    ? media.filter((m) => m.filename.toLowerCase().includes(query.toLowerCase()))
    : media

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Panel */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-[#e8e6dc]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e6dc] shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-[#141413]">Media Library</h2>
            <p className="text-xs text-[#b0aea5] mt-0.5">Click an image to insert it into the editor</p>
          </div>
          <button
            onMouseDown={onClose}
            className="p-2 rounded-lg text-[#b0aea5] hover:text-[#141413] hover:bg-[#e8e6dc] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search + Upload strip */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#e8e6dc] shrink-0">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0aea5]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by filename…"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-[#e8e6dc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97757] focus:border-transparent bg-[#faf9f5]"
            />
          </div>

          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#141413] hover:bg-[#d97757] text-white font-medium transition-colors disabled:opacity-60 cursor-pointer"
          >
            {uploading
              ? <><Loader2 size={12} className="animate-spin" /> Uploading…</>
              : <><Upload size={12} /> Upload</>
            }
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />
        </div>

        {uploadError && (
          <p className="px-5 py-2 text-xs text-red-500 bg-red-50 border-b border-red-100 shrink-0">
            {uploadError}
          </p>
        )}

        {/* Grid — scrollable */}
        <div
          className="flex-1 overflow-y-auto p-5"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={24} className="animate-spin text-[#d97757]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
              <ImageIcon size={28} className="text-[#e8e6dc]" />
              <p className="text-sm text-[#b0aea5]">
                {query ? "No images match your search." : "No images uploaded yet. Use the Upload button above."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.url)}
                  className="group relative bg-[#faf9f5] border border-[#e8e6dc] rounded-xl overflow-hidden hover:border-[#d97757] hover:shadow-md transition-all cursor-pointer text-left"
                  title={item.filename}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.url}
                      alt={item.filename}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                    />
                    {/* Insert overlay */}
                    <div className="absolute inset-0 bg-[#d97757]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold uppercase tracking-wider">Insert</span>
                    </div>
                  </div>
                  <div className="px-2 py-1.5 border-t border-[#e8e6dc]">
                    <p className="text-[10px] text-[#141413] truncate font-medium">{item.filename}</p>
                    <p className="text-[10px] text-[#b0aea5]">{formatBytes(item.size)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
