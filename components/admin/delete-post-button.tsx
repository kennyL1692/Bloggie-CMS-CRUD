"use client"

import { useState, useTransition } from "react"
import { deletePost } from "@/app/admin/posts/actions"
import { Trash2, Loader2 } from "lucide-react"

export function DeletePostButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const [confirm, setConfirm] = useState(false)

  function handleClick() {
    if (!confirm) {
      setConfirm(true)
      return
    }
    startTransition(async () => {
      await deletePost(id)
    })
  }

  return (
    <button
      onClick={handleClick}
      onBlur={() => setConfirm(false)}
      disabled={isPending}
      className={`p-1.5 rounded-lg transition-colors ${
        confirm
          ? "bg-red-500 text-white"
          : "text-[#b0aea5] hover:text-red-500 hover:bg-red-50"
      }`}
      title={confirm ? "Click again to confirm delete" : "Delete post"}
    >
      {isPending
        ? <Loader2 size={15} className="animate-spin" />
        : <Trash2 size={15} />}
    </button>
  )
}
