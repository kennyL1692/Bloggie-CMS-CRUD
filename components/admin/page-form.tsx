"use client"

import { useState, useTransition, useEffect } from "react"
import { Editor } from "@/components/admin/editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { slugify } from "@/lib/utils"
import { Loader2, Eye } from "lucide-react"
import type { Page, PostStatus } from "@/types"
import Link from "next/link"

interface PageFormProps {
  page?: Partial<Page>
  action: (formData: FormData) => Promise<{ error: string } | { success: boolean } | undefined>
  mode: "create" | "edit"
}

export function PageForm({ page, action, mode }: PageFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [title,   setTitle]   = useState(page?.title ?? "")
  const [slug,    setSlug]    = useState(page?.slug ?? "")
  const [content, setContent] = useState(page?.content ?? "")
  const [status,  setStatus]  = useState<PostStatus>(page?.status ?? "draft")
  const [metaTitle, setMetaTitle] = useState(page?.meta_title ?? "")
  const [metaDesc,  setMetaDesc]  = useState(page?.meta_description ?? "")

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => setSuccess(false), 3000)
    return () => clearTimeout(t)
  }, [success])

  function handleTitleChange(val: string) {
    setTitle(val)
    if (mode === "create") setSlug(slugify(val))
  }

  function handleSubmit() {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const fd = new FormData()
      fd.append("title",            title)
      fd.append("slug",             slug)
      fd.append("content",          content)
      fd.append("status",           status)
      fd.append("meta_title",       metaTitle)
      fd.append("meta_description", metaDesc)

      const result = await action(fd)
      if (result && "error" in result) setError(result.error)
      else if (mode === "edit") setSuccess(true)
    })
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141413]" style={{ fontFamily: "var(--font-heading)" }}>
            {mode === "create" ? "New Page" : "Edit Page"}
          </h1>
          {mode === "edit" && page?.slug && (
            <Link
              href={`/${page.slug}`}
              target="_blank"
              className="flex items-center gap-1 text-xs text-[#b0aea5] hover:text-[#d97757] mt-1 transition-colors"
            >
              <Eye size={12} /> Preview page
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          {error   && <p className="text-xs text-red-500 max-w-xs truncate">{error}</p>}
          {success && <p className="text-xs text-green-600">Saved!</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 text-sm rounded-lg bg-[#141413] hover:bg-[#d97757] text-white transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {isPending ? "Saving..." : status === "published" ? "Publish" : "Save Draft"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <Input
            placeholder="Page title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-xl font-bold border-[#e8e6dc] focus-visible:ring-[#d97757] h-12"
            style={{ fontFamily: "var(--font-heading)" }}
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#b0aea5] shrink-0">Slug:</span>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="text-xs text-[#b0aea5] h-7 border-[#e8e6dc] focus-visible:ring-[#d97757]"
            />
          </div>
          <Editor content={content} onChange={setContent} placeholder="Write your page content..." />
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-white rounded-xl border border-[#e8e6dc] p-4 space-y-3">
            <h3 className="text-xs font-semibold text-[#141413] uppercase tracking-wide">Status</h3>
            <div className="flex gap-2">
              {(["draft", "published"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                    status === s
                      ? s === "published"
                        ? "border-[#d97757] bg-[#d97757] text-white"
                        : "border-[#141413] bg-[#141413] text-white"
                      : "border-[#e8e6dc] text-[#b0aea5] hover:border-[#141413]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#b0aea5]">Toggle status then click Save</p>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-[#e8e6dc] p-4 space-y-3">
            <h3 className="text-xs font-semibold text-[#141413] uppercase tracking-wide">SEO</h3>
            <div className="space-y-2">
              <Label className="text-xs text-[#b0aea5]">Meta title</Label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || "Meta title"}
                className="text-sm border-[#e8e6dc] focus-visible:ring-[#d97757]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-[#b0aea5]">Meta description</Label>
              <Textarea
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="Meta description..."
                className="text-sm border-[#e8e6dc] focus-visible:ring-[#d97757] resize-none"
                rows={3}
              />
              <p className={`text-xs ${metaDesc.length > 160 ? "text-red-500" : "text-[#b0aea5]"}`}>
                {metaDesc.length}/160
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
