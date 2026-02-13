import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const check = await requireAdmin();
  if (!check.ok) return NextResponse.redirect(new URL("/admin", req.url));

  const fd = await req.formData();
  const id = String(fd.get("id") ?? "");
  const status = String(fd.get("status") ?? "");

  if (!id || !["approved", "rejected", "pending"].includes(status)) {
    return NextResponse.redirect(new URL("/admin/orders", req.url));
  }

  const admin = supabaseAdmin();
  await admin.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);

  return NextResponse.redirect(new URL("/admin/orders", req.url));
}
