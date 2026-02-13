import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const check = await requireAdmin();
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 401 });

  const { id } = await req.json().catch(() => ({ id: null }));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = supabaseAdmin();

  // Get paths for cleanup (best-effort)
  const { data: ebook } = await admin.from("ebooks").select("cover_path, pdf_path").eq("id", id).single();
  await admin.from("ebooks").delete().eq("id", id);

  if (ebook?.cover_path) await admin.storage.from("covers").remove([ebook.cover_path]);
  if (ebook?.pdf_path) await admin.storage.from("ebooks").remove([ebook.pdf_path]);

  return NextResponse.json({ ok: true });
}
