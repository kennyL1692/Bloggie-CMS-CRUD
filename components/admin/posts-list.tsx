"use client"

import { useState, useTransition } from "react"
import { Eye, Pencil, Trash2, Check, Globe, FileText, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { DeletePostButton } from "@/components/admin/delete-post-button"
import { bulkUpdatePosts } from "@/app/admin/posts/actions"
import { toast } from "sonner"

interface Post {
  id: string
  title: string
  slug: string
  status: string
  view_count: number
  created_at: string
  published_at: string | null
}

export function PostsList({ posts }: { posts: Post[] }) {
  const [selected, setSelected]   = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const allSelected  = posts.length > 0 && selected.size === posts.length
  const noneSelected = selected.size === 0

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(posts.map((p) => p.id)))
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleBulk(action: "publish" | "draft" | "delete") {
    const ids = [...selected]
    const labels = { publish: "Published", draft: "Moved to draft", delete: "Deleted" }
    if (
      action === "delete" &&
      !confirm(`Delete ${ids.length} post${ids.length !== 1 ? "s" : ""}? This cannot be undone.`)
    ) return

    startTransition(async () => {
      const result = await bulkUpdatePosts(ids, action)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(`${labels[action]} ${ids.length} post${ids.length !== 1 ? "s" : ""}`)
        setSelected(new Set())
      }
    })
  }

  if (!posts.length) {
    return (
      <div className="bg-white rounded-xl border border-[#e8e6dc] py-16 text-center text-sm text-[#b0aea5]">
        No posts yet.{" "}
        <Link href="/admin/posts/new" className="text-[#d97757] hover:underline">
          Create your first post →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">

      {/* ── Bulk action bar — outside the white card so it isn't clipped ── */}
      {!noneSelected && (
        <div className="flex items-center gap-3 px-5 py-3 bg-[#141413] rounded-xl">
          <span className="text-sm text-[#faf9f5] font-medium">
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => handleBulk("publish")}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 size={11} className="animate-spin" /> : <Globe size={12} />}
              Publish
            </button>
            <button
              onClick={() => handleBulk("draft")}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#2a2926] hover:bg-[#3a3936] text-[#faf9f5] transition-colors disabled:opacity-50"
            >
              <FileText size={12} /> Draft
            </button>
            <button
              onClick={() => handleBulk("delete")}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50"
            >
              <Trash2 size={12} /> Delete
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 text-xs font-medium text-[#b0aea5] hover:text-[#faf9f5] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Posts table — inside its own white card with overflow-hidden for rounded corners ── */}
      <div className="bg-white rounded-xl border border-[#e8e6dc] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-[#b0aea5] border-b border-[#e8e6dc] bg-[#faf9f5]">
              <th className="px-5 py-3 w-8">
                <button
                  onClick={toggleAll}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    allSelected
                      ? "bg-[#d97757] border-[#d97757]"
                      : "border-[#e8e6dc] hover:border-[#d97757]"
                  }`}
                  aria-label="Select all"
                >
                  {allSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                </button>
              </th>
              <th className="text-left px-3 py-3 font-medium">Title</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Views</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Date</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e6dc]">
            {posts.map((post) => {
              const isSelected = selected.has(post.id)
              return (
                <tr
                  key={post.id}
                  className={`transition-colors ${isSelected ? "bg-[#d97757]/5" : "hover:bg-[#faf9f5]"}`}
                >
                  <td className="px-5 py-3 w-8">
                    <button
                      onClick={() => toggleOne(post.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-[#d97757] border-[#d97757]"
                          : "border-[#e8e6dc] hover:border-[#d97757]"
                      }`}
                      aria-label={`Select ${post.title}`}
                    >
                      {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-medium text-[#141413]">{post.title}</span>
                    <span className="block text-xs text-[#b0aea5] mt-0.5">/{post.slug}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-50 text-green-700"
                        : "bg-[#e8e6dc] text-[#b0aea5]"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#b0aea5] hidden md:table-cell">
                    <span className="flex items-center gap-1"><Eye size={13} />{post.view_count}</span>
                  </td>
                  <td className="px-5 py-3 text-[#b0aea5] hidden md:table-cell">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-[#b0aea5] hover:text-[#141413] hover:bg-[#e8e6dc] transition-colors"
                        title="View post"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="p-1.5 rounded-lg text-[#b0aea5] hover:text-[#141413] hover:bg-[#e8e6dc] transition-colors"
                        title="Edit post"
                      >
                        <Pencil size={15} />
                      </Link>
                      <DeletePostButton id={post.id} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
