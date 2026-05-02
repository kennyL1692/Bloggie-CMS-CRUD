import { createClient } from "@/lib/supabase/server"
import { stripHtml, truncate } from "@/lib/utils"

export async function GET() {
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL  ?? "http://localhost:3000"
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Bloggie"

  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id, title, slug, excerpt, content, published_at, created_at,
      profiles ( name )
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20)

  const items = (posts ?? [])
    .map((post) => {
      const author  = (post.profiles as unknown as { name: string } | null)?.name ?? "Bloggie"
      const pubDate = new Date(post.published_at ?? post.created_at).toUTCString()
      const link    = `${siteUrl}/posts/${post.slug}`
      const desc    = post.excerpt
        ? post.excerpt
        : truncate(stripHtml(post.content), 200)

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${desc}]]></description>
      <author>${author}</author>
      <pubDate>${pubDate}</pubDate>
    </item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>A clean, modern blog powered by Bloggie</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
