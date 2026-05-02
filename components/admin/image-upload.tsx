"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onClear: () => void
}

export function ImageUpload({ value, onChange, onClear }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    setUploading(true)
    setError(null)

    const supabase = createClient()
    const ext = file.name.split(".").pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filename, file, { cacheControl: "3600", upsert: false })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from("media").getPublicUrl(filename)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-[#e8e6dc] bg-[#faf9f5]">
          <Image
            src={value}
            alt="Featured image"
            width={800}
            height={400}
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow border border-[#e8e6dc] hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-36 border-2 border-dashed border-[#e8e6dc] rounded-xl flex flex-col items-center justify-center gap-2 text-[#b0aea5] hover:border-[#d97757] hover:text-[#d97757] transition-colors bg-[#faf9f5]"
        >
          {uploading ? (
            <><Loader2 size={20} className="animate-spin" /><span className="text-xs">Uploading...</span></>
          ) : (
            <><Upload size={20} /><span className="text-xs">Click to upload featured image</span></>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
