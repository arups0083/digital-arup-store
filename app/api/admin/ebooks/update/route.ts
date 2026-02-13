import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const check = await requireAdmin();
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 401 });

  const admin = supabaseAdmin();
  const fd = await req.formData();

  const id = String(fd.get("id") ?? "");
  const title = String(fd.get("title") ?? "").trim();
  const price = Number(fd.get("price") ?? 0);
  const description = String(fd.get("description") ?? "");
  const isActive = String(fd.get("is_active") ?? "true") === "true";

  if (!id || !title) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const cover = fd.get("cover");
  const pdf = fd.get("pdf");

  const updates: any = { title, price, description: description || null, is_active: isActive, updated_at: new Date().toISOString() };

  // Optional: if title changed, update slug too (keep unique suffix)
  updates.slug = slugify(title) + "-" + id.slice(0, 4);

  if (cover && typeof cover !== "string") {
    const f = cover as File;
    const bytes = new Uint8Array(await f.arrayBuffer());
    const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
    const up = await admin.storage.from("covers").upload(path, bytes, { contentType: f.type || "image/jpeg", upsert: false });
    if (up.error) return NextResponse.json({ error: up.error.message }, { status: 400 });
    updates.cover_path = path;
  }

  if (pdf && typeof pdf !== "string") {
    const p = pdf as File;
    const bytes = new Uint8Array(await p.arrayBuffer());
    const path = `${Date.now()}-${Math.random().toString(16).slice(2)}.pdf`;
    const up = await admin.storage.from("ebooks").upload(path, bytes, { contentType: "application/pdf", upsert: false });
    if (up.error) return NextResponse.json({ error: up.error.message }, { status: 400 });
    updates.pdf_path = path;
  }

  const { error } = await admin.from("ebooks").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
