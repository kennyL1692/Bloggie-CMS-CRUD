import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

// Fraunces: high-contrast optical serif — matches Anthropic's Tiempos feel
const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
})

// Inter: neutral humanist sans — matches Claude product UI
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Bloggie"
const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL  ?? "http://localhost:3000"

export const metadata: Metadata = {
  title: {
    default:  siteName,
    template: `%s | ${siteName}`,
  },
  description: "A clean, modern blog powered by Bloggie",
  metadataBase: new URL(siteUrl),

  openGraph: {
    type:      "website",
    siteName:  siteName,
    locale:    "en_US",
    url:       siteUrl,
    title:     siteName,
    description: "A clean, modern blog powered by Bloggie",
  },

  twitter: {
    card:  "summary_large_image",
    title: siteName,
    description: "A clean, modern blog powered by Bloggie",
  },

  alternates: {
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking theme script — runs before React hydrates, prevents FOUC.
            Lives in <head>, outside the React component tree, so React 19
            never warns about it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      {/* font-[family-name:var(--font-body)] applies Inter to all body text */}
      <body className="min-h-full flex flex-col bg-background text-foreground font-[family-name:var(--font-body)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
