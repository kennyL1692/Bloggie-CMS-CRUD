import Link from "next/link"
import Image from "next/image"
import { formatDate, getReadingTime, stripHtml, truncate } from "@/lib/utils"
import { Clock } from "lucide-react"

interface PostCardPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  published_at: string | null
  created_at: string
  categories?: { id: string; name: string; slug: string }[]
  profiles?: { name: string; avatar_url: string | null } | null
}

interface PostCardProps {
  post: PostCardPost
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const readTime   = getReadingTime(stripHtml(post.content))
  const dateStr    = formatDate(post.published_at ?? post.created_at)
  const category   = post.categories?.[0]
  const authorName = post.profiles?.name ?? "Author"
  const avatarInitial = authorName.slice(0, 1).toUpperCase()
  const excerpt    = post.excerpt
    ? truncate(post.excerpt, featured ? 200 : 120)
    : truncate(stripHtml(post.content), featured ? 200 : 120)

  if (featured) {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="group block bg-white dark:bg-[#1e1d1b] rounded-2xl border border-[#e8e6dc] dark:border-[#2a2926] overflow-hidden transition-all duration-300 shadow-warm-sm hover:shadow-warm-orange hover:border-[#d97757]/40"
      >
        {post.featured_image ? (
          <div className="relative h-72 bg-[#faf9f5] dark:bg-[#2a2926]">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover motion-safe:group-hover:scale-[1.015] transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
            {/* Gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="h-72 bg-gradient-to-br from-[#f5d5c3] via-[#faf9f5] to-[#e8e6dc] dark:from-[#2a2926] dark:to-[#1e1d1b] flex items-center justify-center relative overflow-hidden">
            <div className="orb orb-orange w-48 h-48 opacity-30" style={{ position: 'absolute', top: '-20%', right: '-10%' }} />
            <span className="relative text-5xl font-bold text-[#d97757]/30" style={{ fontFamily: "var(--font-heading)" }}>
              {post.title.slice(0, 1)}
            </span>
          </div>
        )}

        <div className="p-6">
          {category && (
            <span className="inline-block text-xs font-semibold text-[#d97757] uppercase tracking-wider mb-3">
              {category.name}
            </span>
          )}
          <h2
            className="text-2xl font-bold text-[#141413] dark:text-[#faf9f5] leading-snug group-hover:text-[#d97757] transition-colors mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {post.title}
          </h2>
          <p className="text-[#6b6966] dark:text-[#8a8880] text-sm leading-relaxed mb-5">{excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-[#b0aea5]">
            {/* Author avatar */}
            <div className="w-6 h-6 rounded-full bg-[#d97757] flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-bold">{avatarInitial}</span>
            </div>
            <span className="font-medium text-[#141413] dark:text-[#faf9f5]">{authorName}</span>
            <span>·</span>
            <span>{dateStr}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock size={11} />{readTime}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block bg-white dark:bg-[#1e1d1b] rounded-2xl border border-[#e8e6dc] dark:border-[#2a2926] overflow-hidden transition-all duration-300 shadow-warm-sm hover:shadow-warm-orange hover:border-[#d97757]/40"
    >
      {post.featured_image ? (
        <div className="relative h-44 bg-[#faf9f5] dark:bg-[#2a2926]">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover motion-safe:group-hover:scale-[1.015] transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-br from-[#f5d5c3] via-[#faf9f5] to-[#e8e6dc] dark:from-[#2a2926] dark:to-[#1e1d1b] flex items-center justify-center relative overflow-hidden">
          <div className="orb orb-orange w-28 h-28 opacity-25" style={{ position: 'absolute', top: '-20%', right: '-10%' }} />
          <span className="relative text-3xl font-bold text-[#d97757]/25" style={{ fontFamily: "var(--font-heading)" }}>
            {post.title.slice(0, 1)}
          </span>
        </div>
      )}

      <div className="p-4">
        {category && (
          <span className="inline-block text-xs font-semibold text-[#d97757] uppercase tracking-wider mb-2">
            {category.name}
          </span>
        )}
        <h3
          className="text-base font-bold text-[#141413] dark:text-[#faf9f5] leading-snug group-hover:text-[#d97757] transition-colors mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {post.title}
        </h3>
        <p className="text-xs text-[#6b6966] dark:text-[#8a8880] leading-relaxed mb-3 line-clamp-2">{excerpt}</p>
        <div className="flex items-center gap-2 text-xs text-[#b0aea5]">
          <div className="w-5 h-5 rounded-full bg-[#d97757] flex items-center justify-center shrink-0">
            <span className="text-white text-[9px] font-bold">{avatarInitial}</span>
          </div>
          <span className="font-medium text-[#141413] dark:text-[#faf9f5]">{authorName}</span>
          <span>·</span>
          <span>{dateStr}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock size={10} />{readTime}</span>
        </div>
      </div>
    </Link>
  )
}
