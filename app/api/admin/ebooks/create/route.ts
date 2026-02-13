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

  const title = String(fd.get("title") ?? "").trim();
  const price = Number(fd.get("price") ?? 0);
  const description = String(fd.get("description") ?? "");

  const cover = fd.get("cover");
  const pdf = fd.get("pdf");

  if (!title || !pdf || typeof pdf === "string") return NextResponse.json({ error: "Title & PDF required" }, { status: 400 });

  const slug = slugify(title) + "-" + Math.random().toString(16).slice(2, 6);

  // upload cover optional
  let coverPath: string | null = null;
  if (cover && typeof cover !== "string") {
    const f = cover as File;
    const bytes = new Uint8Array(await f.arrayBuffer());
    const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
    const up = await admin.storage.from("covers").upload(path, bytes, { contentType: f.type || "image/jpeg", upsert: false });
    if (up.error) return NextResponse.json({ error: up.error.message }, { status: 400 });
    coverPath = path;
  }

  // upload pdf
  const p = pdf as File;
  const pdfBytes = new Uint8Array(await p.arrayBuffer());
  const pdfPath = `${Date.now()}-${Math.random().toString(16).slice(2)}.pdf`;
  const upPdf = await admin.storage.from("ebooks").upload(pdfPath, pdfBytes, { contentType: "application/pdf", upsert: false });
  if (upPdf.error) return NextResponse.json({ error: upPdf.error.message }, { status: 400 });

  const { error } = await admin.from("ebooks").insert({
    title,
    slug,
    price,
    description: description || null,
    cover_path: coverPath,
    pdf_path: pdfPath,
    is_active: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
