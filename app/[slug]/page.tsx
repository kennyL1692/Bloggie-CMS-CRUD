import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

async function getPage(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return { title: "Page not found" }
  return {
    title:       page.meta_title || page.title,
    description: page.meta_description || undefined,
  }
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] dark:bg-[#141413]">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <header className="mb-10 border-b border-[#e8e6dc] dark:border-[#2a2926] pb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#141413] dark:text-[#faf9f5] mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {page.title}
          </h1>
          <p className="text-xs text-[#b0aea5]">Last updated {formatDate(page.updated_at)}</p>
        </header>

        <article>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </main>

      <Footer />
    </div>
  )
}
