"use client"

import { useState, useTransition, useEffect, useCallback, useRef } from "react"
import { Editor } from "@/components/admin/editor"
import { ImageUpload } from "@/components/admin/image-upload"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { slugify } from "@/lib/utils"
import { Loader2, Eye, Save, Maximize2, Minimize2 } from "lucide-react"
import type { Post, Category, PostStatus } from "@/types"
import Link from "next/link"
import { toast } from "sonner"

interface PostFormProps {
  post?: Partial<Post>
  categories: Category[]
  action: (formData: FormData) => Promise<{ error: string } | { success: boolean } | undefined>
  mode: "create" | "edit"
}

const DRAFT_KEY = (id?: string) => `bloggie_draft_${id ?? "new"}`

export function PostForm({ post, categories, action, mode }: PostFormProps) {
  const [isPending, startTransition] = useTransition()

  const [title,              setTitle]              = useState(post?.title ?? "")
  const [slug,               setSlug]               = useState(post?.slug ?? "")
  const [content,            setContent]            = useState(post?.content ?? "")
  const [excerpt,            setExcerpt]            = useState(post?.excerpt ?? "")
  const [status,             setStatus]             = useState<PostStatus>(post?.status ?? "draft")
  const [featuredImage,      setFeaturedImage]      = useState(post?.featured_image ?? "")
  const [metaTitle,          setMetaTitle]          = useState(post?.meta_title ?? "")
  const [metaDesc,           setMetaDesc]           = useState(post?.meta_description ?? "")
  const [scheduledAt,        setScheduledAt]        = useState(post?.scheduled_at ?? "")
  const [tags,               setTags]               = useState(
    post?.tags?.map((t) => t.name).join(", ") ?? ""
  )
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories?.map((c) => c.id) ?? []
  )
  const [focusMode,          setFocusMode]          = useState(false)
  const [autosaveIndicator,  setAutosaveIndicator]  = useState<"saved" | "saving" | null>(null)
  const autosaveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender  = useRef(true)   // ← skip autosave on initial mount

  // ── Collect latest form values without causing re-renders ──────────────────
  // Using a ref keeps handleSubmit / saveDraft always fresh with no stale closure
  const formValues = useRef({ title, slug, content, excerpt, status, featuredImage, metaTitle, metaDesc, scheduledAt, tags, selectedCategories })
  useEffect(() => {
    formValues.current = { title, slug, content, excerpt, status, featuredImage, metaTitle, metaDesc, scheduledAt, tags, selectedCategories }
  })

  // ── Autosave to localStorage ────────────────────────────────────────────────
  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(DRAFT_KEY(post?.id), JSON.stringify(formValues.current))
      setAutosaveIndicator("saved")
      setTimeout(() => setAutosaveIndicator(null), 2000)
    } catch { /* storage full — ignore */ }
  }, [post?.id])

  useEffect(() => {
    // Skip the very first render — user hasn't typed anything yet
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    setAutosaveIndicator("saving")
    autosaveTimer.current = setTimeout(saveDraft, 2000)
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current) }
  }, [title, content, excerpt, metaTitle, metaDesc, tags, saveDraft])

  // ── Cmd/Ctrl+S keyboard shortcut ───────────────────────────────────────────
  // handleSubmit is defined below, but we need a stable ref to call it
  const handleSubmitRef = useRef<() => void>(() => {})

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        handleSubmitRef.current()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, []) // stable — reads through ref, never stale

  function handleTitleChange(val: string) {
    setTitle(val)
    if (mode === "create") setSlug(slugify(val))
  }

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  function handleSubmit() {
    const { title, slug, content, excerpt, status, featuredImage, metaTitle, metaDesc, scheduledAt, tags, selectedCategories } = formValues.current
    startTransition(async () => {
      const fd = new FormData()
      fd.append("title",            title)
      fd.append("slug",             slug)
      fd.append("content",          content)
      fd.append("excerpt",          excerpt)
      fd.append("status",           status)
      fd.append("featured_image",   featuredImage)
      fd.append("meta_title",       metaTitle)
      fd.append("meta_description", metaDesc)
      fd.append("scheduled_at",     scheduledAt)
      fd.append("tags",             tags)
      selectedCategories.forEach((id) => fd.append("categories", id))

      const result = await action(fd)
      if (result && "error" in result) {
        toast.error(result.error)
      } else if (mode === "edit") {
        toast.success(status === "published" ? "Post published!" : "Draft saved!")
        // Clear localStorage draft on successful server save
        try { localStorage.removeItem(DRAFT_KEY(post?.id)) } catch { /* ignore */ }
      }
    })
  }
  // Keep the Cmd+S ref always pointing at the latest handleSubmit
  handleSubmitRef.current = handleSubmit

  return (
    <div className={`transition-all duration-300 ${focusMode ? "fixed inset-0 z-50 bg-[#faf9f5] overflow-auto p-6" : "max-w-5xl mx-auto"}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141413]" style={{ fontFamily: "var(--font-heading)" }}>
            {mode === "create" ? "New Post" : "Edit Post"}
          </h1>
          {mode === "edit" && post?.slug && (
            <Link
              href={`/posts/${post.slug}`}
              target="_blank"
              className="flex items-center gap-1 text-xs text-[#b0aea5] hover:text-[#d97757] mt-1 transition-colors"
            >
              <Eye size={12} /> Preview post
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Autosave indicator */}
          {autosaveIndicator && (
            <span className="text-xs text-[#b0aea5] flex items-center gap-1">
              {autosaveIndicator === "saving" ? (
                <><Loader2 size={11} className="animate-spin" /> Saving draft…</>
              ) : (
                <><Save size={11} /> Draft saved locally</>
              )}
            </span>
          )}

          {/* Focus mode toggle */}
          <button
            type="button"
            onClick={() => setFocusMode((v) => !v)}
            className="p-2 rounded-lg text-[#b0aea5] hover:text-[#141413] hover:bg-[#e8e6dc] transition-colors"
            title={focusMode ? "Exit focus mode" : "Focus mode (hide distractions)"}
          >
            {focusMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 text-sm rounded-lg bg-[#141413] hover:bg-[#d97757] text-white transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {isPending ? "Saving…" : status === "published" ? "Publish" : "Save Draft"}
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${focusMode ? "grid-cols-1 max-w-3xl mx-auto" : "grid-cols-1 lg:grid-cols-3"}`}>
        {/* Main content */}
        <div className={`space-y-4 ${focusMode ? "" : "lg:col-span-2"}`}>
          <Input
            placeholder="Post title"
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
          <Editor content={content} onChange={setContent} placeholder="Start writing your post…" />
          {!focusMode && (
            <p className="text-xs text-[#b0aea5] text-right">
              Tip: Press <kbd className="px-1 py-0.5 rounded bg-[#e8e6dc] font-mono text-[10px]">⌘S</kbd> to save
            </p>
          )}
        </div>

        {/* Sidebar — hidden in focus mode */}
        {!focusMode && (
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
              <div className="space-y-1">
                <Label className="text-xs text-[#b0aea5]">Schedule publish</Label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="text-xs h-8 border-[#e8e6dc] focus-visible:ring-[#d97757]"
                />
              </div>
            </div>

            {/* Featured image */}
            <div className="bg-white rounded-xl border border-[#e8e6dc] p-4 space-y-3">
              <h3 className="text-xs font-semibold text-[#141413] uppercase tracking-wide">Featured Image</h3>
              <ImageUpload
                value={featuredImage}
                onChange={setFeaturedImage}
                onClear={() => setFeaturedImage("")}
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl border border-[#e8e6dc] p-4 space-y-3">
              <h3 className="text-xs font-semibold text-[#141413] uppercase tracking-wide">Excerpt</h3>
              <Textarea
                placeholder="Short summary of the post…"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="text-sm border-[#e8e6dc] focus-visible:ring-[#d97757] resize-none"
                rows={3}
              />
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl border border-[#e8e6dc] p-4 space-y-3">
              <h3 className="text-xs font-semibold text-[#141413] uppercase tracking-wide">Categories</h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="accent-[#d97757]"
                    />
                    <span className="text-sm text-[#141413] group-hover:text-[#d97757] transition-colors">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-[#e8e6dc] p-4 space-y-3">
              <h3 className="text-xs font-semibold text-[#141413] uppercase tracking-wide">Tags</h3>
              <Input
                placeholder="tag1, tag2, tag3"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="text-sm border-[#e8e6dc] focus-visible:ring-[#d97757]"
              />
              <p className="text-xs text-[#b0aea5]">Comma separated</p>
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
                  placeholder="Meta description…"
                  className="text-sm border-[#e8e6dc] focus-visible:ring-[#d97757] resize-none"
                  rows={3}
                />
                <p className={`text-xs ${metaDesc.length > 160 ? "text-red-500" : "text-[#b0aea5]"}`}>
                  {metaDesc.length}/160
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
