"use client"

import { useState, useRef, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { deleteMedia } from "@/app/admin/media/actions"
import { Upload, Copy, Trash2, Loader2, Check, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import type { Media } from "@/types"

interface MediaLibraryProps {
  initialMedia: Media[]
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function MediaLibrary({ initialMedia }: MediaLibraryProps) {
  const [media, setMedia] = useState<Media[]>(initialMedia)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

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

      if (uploadErr) {
        setUploadError(uploadErr.message)
        continue
      }

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(storageName)

      const { data: row } = await supabase
        .from("media")
        .insert({
          filename: storageName,
          url:      urlData.publicUrl,
          size:     file.size,
          mime_type: file.type,
        })
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

  function copyUrl(item: Media) {
    navigator.clipboard.writeText(item.url).then(() => {
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 1800)
    })
  }

  function handleDelete(item: Media) {
    setDeletingId(item.id)
    startTransition(async () => {
      const result = await deleteMedia(item.id, item.filename)
      if (!result?.error) {
        setMedia((prev) => prev.filter((m) => m.id !== item.id))
      }
      setDeletingId(null)
    })
  }

  return (
    <div className="space-y-6">
      {/* Drop zone / upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-[#e8e6dc] rounded-xl bg-white flex flex-col items-center justify-center gap-3 py-10 transition-colors hover:border-[#d97757] hover:bg-[#faf9f5] cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 size={28} className="animate-spin text-[#d97757]" />
            <p className="text-sm text-[#b0aea5]">Uploading...</p>
          </>
        ) : (
          <>
            <div className="p-3 rounded-xl bg-[#faf9f5]">
              <Upload size={24} className="text-[#d97757]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#141413]">Click or drag images here to upload</p>
              <p className="text-xs text-[#b0aea5] mt-1">PNG, JPG, GIF, WebP supported</p>
            </div>
          </>
        )}
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
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-2 rounded-lg">
          {uploadError}
        </p>
      )}

      {/* Grid */}
      {media.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e8e6dc] py-16 text-center">
          <ImageIcon size={32} className="mx-auto text-[#e8e6dc] mb-3" />
          <p className="text-sm text-[#b0aea5]">No media files yet. Upload your first image above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-[#e8e6dc] rounded-xl overflow-hidden hover:border-[#d97757] transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square bg-[#faf9f5]">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); copyUrl(item) }}
                  className="p-2 bg-white rounded-lg hover:bg-[#faf9f5] transition-colors"
                  title="Copy URL"
                >
                  {copiedId === item.id
                    ? <Check size={14} className="text-green-600" />
                    : <Copy size={14} className="text-[#141413]" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(item) }}
                  disabled={deletingId === item.id || isPending}
                  className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  {deletingId === item.id
                    ? <Loader2 size={14} className="animate-spin text-red-500" />
                    : <Trash2 size={14} className="text-red-500" />}
                </button>
              </div>

              {/* File info */}
              <div className="px-2 py-1.5 border-t border-[#e8e6dc]">
                <p className="text-xs text-[#141413] truncate font-medium">{item.filename}</p>
                <p className="text-xs text-[#b0aea5]">{formatBytes(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
