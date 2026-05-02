"use client"

import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8" />

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#b0aea5] hover:text-[#141413] dark:hover:text-[#faf9f5] hover:bg-[#e8e6dc] dark:hover:bg-[#2a2926] rounded-lg transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}
