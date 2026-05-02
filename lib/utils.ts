import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import readingTime from "reading-time"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getReadingTime(content: string): string {
  const stats = readingTime(content)
  return stats.text
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + "..."
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}
