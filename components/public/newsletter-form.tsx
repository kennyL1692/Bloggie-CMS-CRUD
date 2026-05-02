"use client"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"

export function NewsletterForm() {
  const [email, setEmail]         = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    setEmail("")
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 px-5 py-3 bg-green-900/30 border border-green-700/50 rounded-xl text-sm text-green-400 font-medium shrink-0">
        <Check size={14} />
        You&apos;re subscribed!
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubscribe}
      className="flex items-center gap-2 w-full sm:w-auto shrink-0"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 sm:w-56 h-10 px-3.5 text-sm rounded-lg border border-[#2a2926] bg-[#1e1d1b] text-[#faf9f5] placeholder:text-[#6b6966] focus:outline-none focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
      />
      <button
        type="submit"
        className="h-10 px-4 text-sm font-medium bg-[#d97757] hover:bg-[#c96645] text-white rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
      >
        Subscribe <ArrowRight size={13} />
      </button>
    </form>
  )
}
