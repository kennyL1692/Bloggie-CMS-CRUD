"use client"

import { useState } from "react"
import { Link2, Check } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl   = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const twitterHref  = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
  const linkedinHref = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy link")
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-[#b0aea5] mr-1">Share:</span>

      {/* X / Twitter */}
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-[#1e1d1b] border border-[#e8e6dc] dark:border-[#2a2926] text-[#141413] dark:text-[#faf9f5] hover:border-[#141413] dark:hover:border-[#faf9f5] hover:bg-[#141413] dark:hover:bg-[#faf9f5] hover:text-white dark:hover:text-[#141413] transition-colors"
      >
        {/* X logo SVG */}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.262 5.633 5.902-5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Twitter
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-[#1e1d1b] border border-[#e8e6dc] dark:border-[#2a2926] text-[#141413] dark:text-[#faf9f5] hover:border-[#0a66c2] hover:text-[#0a66c2] dark:hover:text-[#6a9bcc] dark:hover:border-[#6a9bcc] transition-colors"
      >
        {/* LinkedIn logo SVG */}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </a>

      {/* Copy link */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-[#1e1d1b] border border-[#e8e6dc] dark:border-[#2a2926] text-[#141413] dark:text-[#faf9f5] hover:border-[#d97757] hover:text-[#d97757] dark:hover:text-[#d97757] dark:hover:border-[#d97757] transition-colors"
      >
        {copied ? <Check size={12} className="text-green-600" /> : <Link2 size={12} />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  )
}
