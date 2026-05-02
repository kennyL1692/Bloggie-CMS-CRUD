export type PostStatus = "draft" | "published"

export interface Profile {
  id: string
  name: string
  bio: string | null
  avatar_url: string | null
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  status: PostStatus
  published_at: string | null
  scheduled_at: string | null
  author_id: string
  meta_title: string | null
  meta_description: string | null
  view_count: number
  created_at: string
  updated_at: string
  profiles?: Profile
  categories?: Category[]
  tags?: Tag[]
}

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  status: PostStatus
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  filename: string
  url: string
  size: number
  mime_type: string
  uploaded_by: string
  created_at: string
}
