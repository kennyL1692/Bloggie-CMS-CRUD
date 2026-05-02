import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("profiles").select("count")
    if (error) throw error
    return NextResponse.json({ status: "ok", db: "connected" })
  } catch (err) {
    return NextResponse.json({ status: "error", message: String(err) }, { status: 500 })
  }
}
