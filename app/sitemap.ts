import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const supabase = await createClient()

  // Fetch published posts
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  // Fetch published pages
  const { data: pages } = await supabase
    .from("pages")
    .select("slug, updated_at")
    .eq("status", "published")

  // Fetch categories that have at least one published post
  const { data: categories } = await supabase
    .from("categories")
    .select("slug")

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:              siteUrl,
      lastModified:     new Date(),
      changeFrequency:  "daily",
      priority:         1,
    },
    {
      url:              `${siteUrl}/search`,
      lastModified:     new Date(),
      changeFrequency:  "weekly",
      priority:         0.5,
    },
  ]

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url:             `${siteUrl}/posts/${post.slug}`,
    lastModified:    new Date(post.updated_at ?? post.published_at),
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }))

  const pageRoutes: MetadataRoute.Sitemap = (pages ?? []).map((page) => ({
    url:             `${siteUrl}/${page.slug}`,
    lastModified:    new Date(page.updated_at),
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((cat) => ({
    url:             `${siteUrl}/categories/${cat.slug}`,
    lastModified:    new Date(),
    changeFrequency: "weekly" as const,
    priority:        0.6,
  }))

  return [...staticRoutes, ...postRoutes, ...pageRoutes, ...categoryRoutes]
}
