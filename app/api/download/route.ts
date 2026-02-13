import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ebookId = url.searchParams.get("ebookId");
  if (!ebookId) return NextResponse.json({ error: "Missing ebookId" }, { status: 400 });

  const sb = supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return NextResponse.redirect(new URL("/auth/login?next=/library", req.url));

  const admin = supabaseAdmin();

  const { data: order } = await admin
    .from("orders")
    .select("id")
    .eq("user_id", auth.user.id)
    .eq("ebook_id", ebookId)
    .eq("status", "approved")
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "No access" }, { status: 403 });

  const { data: ebook } = await admin.from("ebooks").select("pdf_path, title").eq("id", ebookId).single();
  if (!ebook?.pdf_path) return NextResponse.json({ error: "PDF not found" }, { status: 404 });

  const { data, error } = await admin.storage.from("ebooks").createSignedUrl(ebook.pdf_path, 60 * 5);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(data.signedUrl);
}
