"use client"

import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, Suspense } from "react"
import { Search, X, Menu, Feather } from "lucide-react"
import { ThemeToggle } from "@/components/public/theme-toggle"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home",     href: "/" },
  { label: "Articles", href: "/search" },
]

function NavbarInner() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery]           = useState(searchParams.get("q") ?? "")
  const [menuOpen, setMenuOpen]     = useState(false)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f5]/95 dark:bg-[#141413]/95 backdrop-blur-md border-b border-[#e8e6dc] dark:border-[#2a2926]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#d97757] flex items-center justify-center">
            <Feather size={13} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold text-[#141413] dark:text-[#faf9f5] tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}>
            Bloggie
          </span>
        </Link>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-[#e8e6dc] dark:bg-[#2a2926] shrink-0" />

        {/* Desktop nav — page links only */}
        <nav className="hidden sm:flex items-center gap-1 flex-1">
          {navLinks.map(({ label, href }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg transition-colors duration-150",
                  active
                    ? "text-[#141413] dark:text-[#faf9f5] font-medium"
                    : "text-[#6b6966] dark:text-[#8a8880] hover:text-[#141413] dark:hover:text-[#faf9f5] hover:bg-[#e8e6dc]/60 dark:hover:bg-[#2a2926]"
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right-side actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts…"
                className="text-sm border border-[#e8e6dc] dark:border-[#2a2926] bg-white dark:bg-[#1e1d1b] dark:text-[#faf9f5] rounded-lg px-3 py-1.5 w-48 focus:outline-none focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#6b6966] hover:text-[#141413] dark:hover:text-[#faf9f5] rounded-lg hover:bg-[#e8e6dc] dark:hover:bg-[#2a2926] transition-colors"
                aria-label="Close search"
              >
                <X size={15} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#6b6966] dark:text-[#8a8880] hover:text-[#141413] dark:hover:text-[#faf9f5] hover:bg-[#e8e6dc]/60 dark:hover:bg-[#2a2926] rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          )}

          <ThemeToggle />

          {/* Admin link — subtle, right edge */}
          <Link
            href="/admin"
            className="hidden sm:block px-3 py-1.5 text-xs font-medium text-[#6b6966] dark:text-[#8a8880] hover:text-[#141413] dark:hover:text-[#faf9f5] hover:bg-[#e8e6dc]/60 dark:hover:bg-[#2a2926] rounded-lg transition-colors ml-1"
          >
            Admin
          </Link>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-[#6b6966] hover:text-[#141413] dark:hover:text-[#faf9f5] hover:bg-[#e8e6dc] dark:hover:bg-[#2a2926] rounded-lg transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="sm:hidden border-t border-[#e8e6dc] dark:border-[#2a2926] bg-[#faf9f5] dark:bg-[#141413] px-4 py-3 flex flex-col gap-0.5"
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 px-3 text-sm text-[#141413] dark:text-[#faf9f5] rounded-lg hover:bg-[#e8e6dc] dark:hover:bg-[#2a2926] transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="py-2.5 px-3 text-sm text-[#6b6966] dark:text-[#8a8880] rounded-lg hover:bg-[#e8e6dc] dark:hover:bg-[#2a2926] transition-colors"
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  )
}

export function Navbar() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-40 bg-[#faf9f5]/95 dark:bg-[#141413]/95 backdrop-blur-md border-b border-[#e8e6dc] dark:border-[#2a2926] h-14" />
    }>
      <NavbarInner />
    </Suspense>
  )
}
